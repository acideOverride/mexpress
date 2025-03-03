/**
 * Data Consistency Service implementation
 * Fixes for MEXP-2025-007-BE Integration Architecture P2 Tests
 */
import { EventEmitter } from 'events';

export interface ConsistencyLevel {
  name: 'strong' | 'eventual' | 'causal' | 'read-your-writes';
  minReplicas: number;
  minAcknowledgements: number;
  maxStaleness?: number; // milliseconds
  conflictResolution?: 'lww' | 'custom' | 'merge'; // last-write-wins, custom resolver, auto-merge
}

export interface NodeMetrics {
  latency: number;
  errorRate: number;
  capacityPercent: number;
}

export interface DataNode {
  id: string;
  endpoint: string;
  region: string;
  zone: string;
  isActive: boolean;
  isReadOnly?: boolean;
  metrics: NodeMetrics; // Make metrics required instead of optional
}

export interface ConsistencyTransaction {
  id: string;
  operation: 'read' | 'write' | 'update' | 'delete';
  key: string;
  value?: any;
  timestamp: Date;
  consistencyLevel: ConsistencyLevel['name'];
  nodes: string[]; // Node IDs involved
  status: 'pending' | 'committed' | 'aborted' | 'partial';
  vector?: Map<string, number>; // Vector clock for causal consistency
}

export interface ConsistencyOptions {
  defaultConsistencyLevel?: ConsistencyLevel['name'];
  replicationFactor?: number;
  syncInterval?: number;
  conflictResolutionStrategy?: 'lww' | 'custom' | 'merge';
  timeoutMs?: number;
  enableMetrics?: boolean;
}

/**
 * Enhanced Data Consistency Service
 * Provides multi-node data consistency guarantees with configurable consistency levels
 */
export class DataConsistencyService extends EventEmitter {
  private data: Map<string, { value: any; timestamp: number; vector: Map<string, number> }>;
  private nodes: Map<string, DataNode>;
  private transactions: Map<string, ConsistencyTransaction>;
  private consistencyLevels: Map<string, ConsistencyLevel>;
  private defaultConsistencyLevel: ConsistencyLevel['name'];
  private replicationFactor: number;
  private syncInterval: number;
  private conflictResolutionStrategy: 'lww' | 'custom' | 'merge';
  private timeoutMs: number;
  private enableMetrics: boolean;
  private syncTimer?: NodeJS.Timeout;
  private localNodeId: string;
  private vectorClock: Map<string, number>;

  /**
   * Create a new data consistency service
   */
  constructor(localNodeId: string, options: ConsistencyOptions = {}) {
    super();
    
    this.data = new Map();
    this.nodes = new Map();
    this.transactions = new Map();
    this.consistencyLevels = new Map();
    this.defaultConsistencyLevel = options.defaultConsistencyLevel || 'eventual';
    this.replicationFactor = options.replicationFactor || 3;
    this.syncInterval = options.syncInterval || 5000; // 5 seconds
    this.conflictResolutionStrategy = options.conflictResolutionStrategy || 'lww';
    this.timeoutMs = options.timeoutMs || 3000; // 3 seconds
    this.enableMetrics = options.enableMetrics !== undefined ? options.enableMetrics : true;
    this.localNodeId = localNodeId;
    this.vectorClock = new Map();
    this.vectorClock.set(this.localNodeId, 0);
    
    // Initialize built-in consistency levels
    this.initConsistencyLevels();
    
    // Start sync timer
    this.startSyncTimer();
  }

  /**
   * Initialize built-in consistency levels
   */
  private initConsistencyLevels(): void {
    // Strong consistency
    this.consistencyLevels.set('strong', {
      name: 'strong',
      minReplicas: this.replicationFactor,
      minAcknowledgements: this.replicationFactor, // All replicas must acknowledge
      maxStaleness: 0, // No staleness allowed
      conflictResolution: 'lww'
    });
    
    // Eventual consistency
    this.consistencyLevels.set('eventual', {
      name: 'eventual',
      minReplicas: this.replicationFactor,
      minAcknowledgements: 1, // Only one acknowledgement needed
      maxStaleness: 60000, // 60 seconds staleness allowed
      conflictResolution: this.conflictResolutionStrategy
    });
    
    // Causal consistency
    this.consistencyLevels.set('causal', {
      name: 'causal',
      minReplicas: Math.max(2, Math.ceil(this.replicationFactor / 2)),
      minAcknowledgements: Math.ceil(this.replicationFactor / 2), // Majority
      maxStaleness: 10000, // 10 seconds staleness allowed
      conflictResolution: 'merge'
    });
    
    // Read-your-writes consistency
    this.consistencyLevels.set('read-your-writes', {
      name: 'read-your-writes',
      minReplicas: Math.max(2, Math.ceil(this.replicationFactor / 2)),
      minAcknowledgements: 1, // Only one acknowledgement needed
      maxStaleness: 5000, // 5 seconds staleness allowed
      conflictResolution: 'lww'
    });
  }

  /**
   * Register a data node
   */
  registerNode(node: Omit<DataNode, 'metrics'>): DataNode {
    // Create a node with default metrics
    const newNode: DataNode = {
      ...node,
      metrics: {
        latency: 0,
        errorRate: 0,
        capacityPercent: 0
      }
    };
    
    this.nodes.set(node.id, newNode);
    
    // Initialize vector clock for this node
    if (!this.vectorClock.has(node.id)) {
      this.vectorClock.set(node.id, 0);
    }
    
    this.emit('node.registered', {
      nodeId: node.id,
      region: node.region,
      zone: node.zone
    });
    
    return newNode;
  }

  /**
   * Update node status
   */
  updateNodeStatus(nodeId: string, isActive: boolean, isReadOnly?: boolean): boolean {
    const node = this.nodes.get(nodeId);
    
    if (!node) {
      return false;
    }
    
    node.isActive = isActive;
    
    if (isReadOnly !== undefined) {
      node.isReadOnly = isReadOnly;
    }
    
    this.emit('node.status', {
      nodeId,
      isActive,
      isReadOnly: node.isReadOnly
    });
    
    return true;
  }

  /**
   * Update node metrics
   */
  updateNodeMetrics(nodeId: string, metrics: Partial<NodeMetrics>): boolean {
    const node = this.nodes.get(nodeId);
    
    if (!node) {
      return false;
    }
    
    // Update metrics with new values if provided
    if (metrics.latency !== undefined) {
      node.metrics.latency = metrics.latency;
    }
    
    if (metrics.errorRate !== undefined) {
      node.metrics.errorRate = metrics.errorRate;
    }
    
    if (metrics.capacityPercent !== undefined) {
      node.metrics.capacityPercent = metrics.capacityPercent;
    }
    
    return true;
  }

  /**
   * Get available nodes for write operations
   */
  private getWriteNodes(count: number): DataNode[] {
    const activeNodes = Array.from(this.nodes.values())
      .filter(node => node.isActive && !node.isReadOnly)
      .sort((a, b) => {
        // Prioritize lower latency and error rate
        const aScore = a.metrics.latency * (1 + a.metrics.errorRate);
        const bScore = b.metrics.latency * (1 + b.metrics.errorRate);
        return aScore - bScore;
      });
    
    // Ensure nodes from different regions and zones
    const selectedNodes: DataNode[] = [];
    const seenRegions = new Set<string>();
    const seenZones = new Set<string>();
    
    // First pass: select nodes from unique regions
    for (const node of activeNodes) {
      if (!seenRegions.has(node.region)) {
        selectedNodes.push(node);
        seenRegions.add(node.region);
        seenZones.add(`${node.region}:${node.zone}`);
        
        if (selectedNodes.length >= count) {
          break;
        }
      }
    }
    
    // Second pass: select nodes from unique zones
    if (selectedNodes.length < count) {
      for (const node of activeNodes) {
        const zoneKey = `${node.region}:${node.zone}`;
        
        if (!seenZones.has(zoneKey) && !selectedNodes.includes(node)) {
          selectedNodes.push(node);
          seenZones.add(zoneKey);
          
          if (selectedNodes.length >= count) {
            break;
          }
        }
      }
    }
    
    // Final pass: select any remaining active nodes
    if (selectedNodes.length < count) {
      for (const node of activeNodes) {
        if (!selectedNodes.includes(node)) {
          selectedNodes.push(node);
          
          if (selectedNodes.length >= count) {
            break;
          }
        }
      }
    }
    
    return selectedNodes;
  }

  /**
   * Get available nodes for read operations
   */
  private getReadNodes(count: number): DataNode[] {
    const activeNodes = Array.from(this.nodes.values())
      .filter(node => node.isActive)
      .sort((a, b) => {
        // Prioritize lower latency for reads
        return a.metrics.latency - b.metrics.latency;
      });
    
    return activeNodes.slice(0, count);
  }

  /**
   * Set a value with specified consistency level
   */
  async set(key: string, value: any, consistencyLevel?: ConsistencyLevel['name']): Promise<boolean> {
    const level = consistencyLevel || this.defaultConsistencyLevel;
    const consistency = this.consistencyLevels.get(level);
    
    if (!consistency) {
      throw new Error(`Unknown consistency level: ${level}`);
    }
    
    // Create a new transaction
    const transaction: ConsistencyTransaction = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      operation: 'write',
      key,
      value,
      timestamp: new Date(),
      consistencyLevel: level,
      nodes: [],
      status: 'pending'
    };
    
    // Get nodes for write operation
    const targetNodes = this.getWriteNodes(consistency.minReplicas);
    
    if (targetNodes.length < consistency.minReplicas) {
      // Not enough nodes available
      transaction.status = 'aborted';
      this.transactions.set(transaction.id, transaction);
      
      this.emit('transaction.aborted', {
        transactionId: transaction.id,
        reason: 'insufficient_nodes',
        required: consistency.minReplicas,
        available: targetNodes.length
      });
      
      return false;
    }
    
    // Increment vector clock for the current node
    const currentNodeClock = this.vectorClock.get(this.localNodeId) || 0;
    this.vectorClock.set(this.localNodeId, currentNodeClock + 1);
    
    // Create a copy of the vector clock for this operation
    const vectorClock = new Map(this.vectorClock);
    
    // Store transaction
    transaction.nodes = targetNodes.map(node => node.id);
    transaction.vector = vectorClock;
    this.transactions.set(transaction.id, transaction);
    
    // Update local data
    this.data.set(key, {
      value,
      timestamp: Date.now(),
      vector: new Map(vectorClock)
    });
    
    // Simulate writing to remote nodes (in a real system, this would make API calls)
    const promises = targetNodes.map(async node => {
      try {
        // Simulate network delay based on node metrics
        const delay = node.metrics.latency || Math.random() * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Simulate errors based on node error rate
        if (Math.random() < node.metrics.errorRate) {
          throw new Error(`Simulated error writing to node ${node.id}`);
        }
        
        // Success
        return { nodeId: node.id, success: true };
      } catch (err) {
        return { nodeId: node.id, success: false, error: err };
      }
    });
    
    // Wait for acknowledgements with timeout
    const results = await Promise.race([
      Promise.all(promises),
      new Promise<any[]>(resolve => setTimeout(() => resolve([]), this.timeoutMs))
    ]);
    
    // Count successful acknowledgements
    const successes = results.filter(r => r && r.success).length;
    
    // Update transaction status
    if (successes >= consistency.minAcknowledgements) {
      transaction.status = 'committed';
      
      this.emit('transaction.committed', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level
      });
      
      return true;
    } else {
      transaction.status = 'partial';
      
      this.emit('transaction.partial', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level,
        acknowledgements: successes,
        required: consistency.minAcknowledgements
      });
      
      return false;
    }
  }

  /**
   * Get a value with specified consistency level
   */
  async get(key: string, consistencyLevel?: ConsistencyLevel['name']): Promise<any> {
    const level = consistencyLevel || this.defaultConsistencyLevel;
    const consistency = this.consistencyLevels.get(level);
    
    if (!consistency) {
      throw new Error(`Unknown consistency level: ${level}`);
    }
    
    // Create a new transaction
    const transaction: ConsistencyTransaction = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      operation: 'read',
      key,
      timestamp: new Date(),
      consistencyLevel: level,
      nodes: [],
      status: 'pending'
    };
    
    // Get nodes for read operation
    const targetNodes = this.getReadNodes(consistency.minReplicas);
    
    if (targetNodes.length < consistency.minAcknowledgements) {
      // Not enough nodes available
      transaction.status = 'aborted';
      this.transactions.set(transaction.id, transaction);
      
      this.emit('transaction.aborted', {
        transactionId: transaction.id,
        reason: 'insufficient_nodes',
        required: consistency.minAcknowledgements,
        available: targetNodes.length
      });
      
      return null;
    }
    
    // Store transaction
    transaction.nodes = targetNodes.map(node => node.id);
    this.transactions.set(transaction.id, transaction);
    
    // Check local data
    const localData = this.data.get(key);
    
    // For read-your-writes consistency, we can just return local data
    if (level === 'read-your-writes' && localData) {
      transaction.status = 'committed';
      
      this.emit('transaction.committed', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level
      });
      
      return localData.value;
    }
    
    // Simulate reading from remote nodes
    const promises = targetNodes.map(async node => {
      try {
        // Simulate network delay based on node metrics
        const delay = node.metrics.latency || Math.random() * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Simulate errors based on node error rate
        if (Math.random() < node.metrics.errorRate) {
          throw new Error(`Simulated error reading from node ${node.id}`);
        }
        
        // Simulate a read operation (in a real system, this would make API calls)
        // Here we just return the local data as if it came from the remote node
        return { 
          nodeId: node.id, 
          success: true, 
          value: localData?.value,
          timestamp: localData?.timestamp || 0,
          vector: localData?.vector || new Map()
        };
      } catch (err) {
        return { nodeId: node.id, success: false, error: err };
      }
    });
    
    // Wait for responses with timeout
    const results = await Promise.race([
      Promise.all(promises),
      new Promise<any[]>(resolve => setTimeout(() => resolve([]), this.timeoutMs))
    ]);
    
    // Count successful responses
    const successes = results.filter(r => r && r.success);
    
    if (successes.length < consistency.minAcknowledgements) {
      // Not enough successful responses
      transaction.status = 'partial';
      
      this.emit('transaction.partial', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level,
        acknowledgements: successes.length,
        required: consistency.minAcknowledgements
      });
      
      return null;
    }
    
    // Process responses based on consistency level
    if (level === 'strong') {
      // All responses should be the same
      const firstValue = successes[0]?.value;
      const allSame = successes.every(r => JSON.stringify(r.value) === JSON.stringify(firstValue));
      
      if (!allSame) {
        // Data inconsistency detected
        transaction.status = 'aborted';
        
        this.emit('transaction.aborted', {
          transactionId: transaction.id,
          reason: 'data_inconsistency',
          key
        });
        
        return null;
      }
      
      transaction.status = 'committed';
      
      this.emit('transaction.committed', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level
      });
      
      return firstValue;
    } else if (level === 'causal') {
      // Causal consistency requires checking vector clocks
      const validResponses = successes.filter(r => {
        // A response is valid if its vector clock is at least as recent as our local one
        // for all nodes that we know about
        for (const [nodeId, clock] of this.vectorClock.entries()) {
          const responseClock = r.vector?.get(nodeId) || 0;
          if (responseClock < clock) {
            return false;
          }
        }
        return true;
      });
      
      if (validResponses.length < consistency.minAcknowledgements) {
        // Not enough causally consistent responses
        transaction.status = 'partial';
        
        this.emit('transaction.partial', {
          transactionId: transaction.id,
          key,
          consistencyLevel: level,
          acknowledgements: validResponses.length,
          required: consistency.minAcknowledgements
        });
        
        return null;
      }
      
      // Get the most recent value by timestamp
      const mostRecent = validResponses.reduce((latest, current) => {
        return current.timestamp > latest.timestamp ? current : latest;
      });
      
      transaction.status = 'committed';
      
      this.emit('transaction.committed', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level
      });
      
      return mostRecent.value;
    } else {
      // For eventual consistency, just get the most recent value by timestamp
      const mostRecent = successes.reduce((latest, current) => {
        return current.timestamp > latest.timestamp ? current : latest;
      });
      
      transaction.status = 'committed';
      
      this.emit('transaction.committed', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level
      });
      
      return mostRecent.value;
    }
  }

  /**
   * Delete a value with specified consistency level
   */
  async delete(key: string, consistencyLevel?: ConsistencyLevel['name']): Promise<boolean> {
    const level = consistencyLevel || this.defaultConsistencyLevel;
    const consistency = this.consistencyLevels.get(level);
    
    if (!consistency) {
      throw new Error(`Unknown consistency level: ${level}`);
    }
    
    // Create a new transaction
    const transaction: ConsistencyTransaction = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      operation: 'delete',
      key,
      timestamp: new Date(),
      consistencyLevel: level,
      nodes: [],
      status: 'pending'
    };
    
    // Check if key exists first
    const existingData = this.data.get(key);
    if (!existingData) {
      // Important fix: In most consistency models, deleting a non-existent key
      // should be considered successful because the end state is the same
      transaction.status = 'committed';
      this.transactions.set(transaction.id, transaction);
      
      this.emit('transaction.committed', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level,
        note: 'key did not exist'
      });
      
      return true; // Return success since the key is already not there
    }
    
    // Get nodes for write operation (delete is a write)
    const targetNodes = this.getWriteNodes(consistency.minReplicas);
    
    if (targetNodes.length < consistency.minReplicas) {
      // Not enough nodes available
      transaction.status = 'aborted';
      this.transactions.set(transaction.id, transaction);
      
      this.emit('transaction.aborted', {
        transactionId: transaction.id,
        reason: 'insufficient_nodes',
        required: consistency.minReplicas,
        available: targetNodes.length
      });
      
      return false;
    }
    
    // Increment vector clock for the current node
    const currentNodeClock = this.vectorClock.get(this.localNodeId) || 0;
    this.vectorClock.set(this.localNodeId, currentNodeClock + 1);
    
    // Store transaction
    transaction.nodes = targetNodes.map(node => node.id);
    transaction.vector = new Map(this.vectorClock);
    this.transactions.set(transaction.id, transaction);
    
    // Delete local data
    this.data.delete(key);
    
    // Simulate writing to remote nodes
    const promises = targetNodes.map(async node => {
      try {
        // Simulate network delay based on node metrics
        const delay = node.metrics.latency || Math.random() * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Simulate errors based on node error rate
        if (Math.random() < node.metrics.errorRate) {
          throw new Error(`Simulated error deleting from node ${node.id}`);
        }
        
        // Success
        return { nodeId: node.id, success: true };
      } catch (err) {
        return { nodeId: node.id, success: false, error: err };
      }
    });
    
    // Wait for acknowledgements with timeout
    const results = await Promise.race([
      Promise.all(promises),
      new Promise<any[]>(resolve => setTimeout(() => resolve([]), this.timeoutMs))
    ]);
    
    // Count successful acknowledgements
    const successes = results.filter(r => r && r.success).length;
    
    // Update transaction status
    if (successes >= consistency.minAcknowledgements) {
      transaction.status = 'committed';
      
      this.emit('transaction.committed', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level
      });
      
      return true;
    } else {
      transaction.status = 'partial';
      
      this.emit('transaction.partial', {
        transactionId: transaction.id,
        key,
        consistencyLevel: level,
        acknowledgements: successes,
        required: consistency.minAcknowledgements
      });
      
      return false;
    }
  }

  /**
   * Synchronize data across nodes
   * In a real system, this would involve communication with other nodes
   * Here we just simulate the process
   */
  private async synchronizeData(): Promise<void> {
    if (this.nodes.size <= 1) {
      return; // Nothing to synchronize
    }
    
    // Get all active nodes
    const activeNodes = Array.from(this.nodes.values()).filter(node => node.isActive);
    
    if (activeNodes.length <= 1) {
      return; // Nothing to synchronize
    }
    
    // Simulate sync with each node
    for (const node of activeNodes) {
      if (node.id === this.localNodeId) {
        continue; // Skip local node
      }
      
      try {
        // Simulate network delay
        const delay = node.metrics.latency || Math.random() * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Simulate errors based on node error rate
        if (Math.random() < node.metrics.errorRate) {
          throw new Error(`Simulated error syncing with node ${node.id}`);
        }
        
        // In a real system, we would exchange data and vector clocks
        // Here we just simulate successful sync
        
        // Merge vector clocks
        for (const [nodeId, clock] of this.vectorClock.entries()) {
          // In a real system, we would get the remote vector clock
          // For simulation, just assume the remote clock is at most 2 versions behind
          const remoteClock = Math.max(0, clock - Math.floor(Math.random() * 3));
          
          // Update our vector clock with the max value
          this.vectorClock.set(nodeId, Math.max(clock, remoteClock));
        }
        
        this.emit('sync.completed', {
          nodeId: node.id,
          timestamp: new Date()
        });
      } catch (err) {
        this.emit('sync.failed', {
          nodeId: node.id,
          error: err
        });
      }
    }
  }

  /**
   * Start synchronization timer
   */
  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    this.syncTimer = setInterval(() => {
      this.synchronizeData().catch(err => {
        this.emit('error', {
          operation: 'sync',
          error: err
        });
      });
    }, this.syncInterval);
  }

  /**
   * Get service statistics
   */
  getStats(): {
    nodes: number;
    activeNodes: number;
    readOnlyNodes: number;
    keyCount: number;
    transactionCount: number;
    consistencyLevels: string[];
  } {
    const allNodes = Array.from(this.nodes.values());
    
    return {
      nodes: this.nodes.size,
      activeNodes: allNodes.filter(node => node.isActive).length,
      readOnlyNodes: allNodes.filter(node => node.isActive && node.isReadOnly).length,
      keyCount: this.data.size,
      transactionCount: this.transactions.size,
      consistencyLevels: Array.from(this.consistencyLevels.keys())
    };
  }

  /**
   * Clean up resources
   */
  shutdown(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = undefined;
    }
    
    this.removeAllListeners();
    this.data.clear();
    this.nodes.clear();
    this.transactions.clear();
  }
}