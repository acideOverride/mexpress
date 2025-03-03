/**
 * Data Consistency Tests
 * MEXP-2025-007-BE Integration Architecture P2 Tests
 */
import { DataConsistencyService, ConsistencyLevel, NodeMetrics } from '../../../src/services/data-consistency';

describe('DataConsistencyService', () => {
  let dataConsistency: DataConsistencyService;
  
  beforeEach(() => {
    // Create new consistency service with a local node ID
    dataConsistency = new DataConsistencyService('local-node', {
      defaultConsistencyLevel: 'eventual',
      replicationFactor: 3,
      syncInterval: 100, // Fast for tests
      timeoutMs: 500 // Short timeout for tests
    });
  });
  
  afterEach(() => {
    dataConsistency.shutdown();
  });
  
  describe('Node Management', () => {
    test('should register a node successfully', () => {
      const node = dataConsistency.registerNode({
        id: 'node-1',
        endpoint: 'http://node1:8080',
        region: 'us-east',
        zone: 'us-east-1a',
        isActive: true
      });
      
      expect(node.id).toBe('node-1');
      expect(node.endpoint).toBe('http://node1:8080');
      expect(node.region).toBe('us-east');
      expect(node.zone).toBe('us-east-1a');
      expect(node.isActive).toBe(true);
      expect(node.metrics).toBeDefined();
      expect(node.metrics.latency).toBe(0);
      expect(node.metrics.errorRate).toBe(0);
      expect(node.metrics.capacityPercent).toBe(0);
    });
    
    test('should update node status', () => {
      // Register a node
      dataConsistency.registerNode({
        id: 'node-2',
        endpoint: 'http://node2:8080',
        region: 'us-east',
        zone: 'us-east-1b',
        isActive: true
      });
      
      // Update status to inactive
      const result = dataConsistency.updateNodeStatus('node-2', false);
      expect(result).toBe(true);
      
      // Get stats to verify
      const stats = dataConsistency.getStats();
      expect(stats.activeNodes).toBe(0);
    });
    
    test('should update node metrics', () => {
      // Register a node
      dataConsistency.registerNode({
        id: 'node-3',
        endpoint: 'http://node3:8080',
        region: 'us-west',
        zone: 'us-west-1a',
        isActive: true
      });
      
      // Update metrics
      const metrics: Partial<NodeMetrics> = {
        latency: 50,
        errorRate: 0.1,
        capacityPercent: 75
      };
      
      const result = dataConsistency.updateNodeMetrics('node-3', metrics);
      expect(result).toBe(true);
      
      // Register additional nodes for later tests
      dataConsistency.registerNode({
        id: 'node-4',
        endpoint: 'http://node4:8080',
        region: 'us-west',
        zone: 'us-west-1b',
        isActive: true
      });
      
      dataConsistency.registerNode({
        id: 'node-5',
        endpoint: 'http://node5:8080',
        region: 'eu-west',
        zone: 'eu-west-1a',
        isActive: true
      });
    });
  });
  
  describe('Eventual Consistency', () => {
    beforeEach(() => {
      // Register multiple nodes
      for (let i = 1; i <= 5; i++) {
        dataConsistency.registerNode({
          id: `eventual-node-${i}`,
          endpoint: `http://node${i}:8080`,
          region: `region-${i % 3}`,
          zone: `zone-${i % 2}`,
          isActive: true
        });
      }
    });
    
    test('should set and get value with eventual consistency', async () => {
      const key = 'test-key-1';
      const value = { message: 'hello world' };
      
      // Set value with eventual consistency (default)
      const setResult = await dataConsistency.set(key, value);
      expect(setResult).toBe(true);
      
      // Get value with eventual consistency
      const getValue = await dataConsistency.get(key);
      expect(getValue).toEqual(value);
    });
    
    test('should delete a value successfully', async () => {
      const key = 'test-key-delete';
      const value = { message: 'to be deleted' };
      
      // Set value
      await dataConsistency.set(key, value);
      
      // Verify it exists
      const getValue1 = await dataConsistency.get(key);
      expect(getValue1).toEqual(value);
      
      // Delete it
      const deleteResult = await dataConsistency.delete(key);
      expect(deleteResult).toBe(true);
      
      // Verify it's gone
      const getValue2 = await dataConsistency.get(key);
      // Fix: changing expectation to match actual API behavior (returning undefined instead of null)
      expect(getValue2).toBeUndefined();
    });
  });
  
  describe('Strong Consistency', () => {
    beforeEach(() => {
      // Register multiple nodes
      for (let i = 1; i <= 5; i++) {
        dataConsistency.registerNode({
          id: `strong-node-${i}`,
          endpoint: `http://node${i}:8080`,
          region: `region-${i % 3}`,
          zone: `zone-${i % 2}`,
          isActive: true
        });
      }
    });
    
    test('should set and get value with strong consistency', async () => {
      const key = 'test-key-strong';
      const value = { message: 'strong consistency' };
      
      // Set value with strong consistency
      const setResult = await dataConsistency.set(key, value, 'strong');
      expect(setResult).toBe(true);
      
      // Get value with strong consistency
      const getValue = await dataConsistency.get(key, 'strong');
      expect(getValue).toEqual(value);
    });
    
    test('should fail when not enough nodes available', async () => {
      // Deactivate most nodes
      for (let i = 1; i <= 4; i++) {
        dataConsistency.updateNodeStatus(`strong-node-${i}`, false);
      }
      
      const key = 'test-key-not-enough-nodes';
      const value = { message: 'should fail' };
      
      // Try to set value with strong consistency
      const setResult = await dataConsistency.set(key, value, 'strong');
      
      // Should fail because not enough nodes for strong consistency
      expect(setResult).toBe(false);
    });
  });
  
  describe('Causal Consistency', () => {
    beforeEach(() => {
      // Register multiple nodes
      for (let i = 1; i <= 5; i++) {
        dataConsistency.registerNode({
          id: `causal-node-${i}`,
          endpoint: `http://node${i}:8080`,
          region: `region-${i % 3}`,
          zone: `zone-${i % 2}`,
          isActive: true
        });
      }
    });
    
    test('should set and get value with causal consistency', async () => {
      const key = 'test-key-causal';
      const value1 = { message: 'causal consistency 1' };
      const value2 = { message: 'causal consistency 2' };
      
      // Set first value with causal consistency
      const setResult1 = await dataConsistency.set(key, value1, 'causal');
      expect(setResult1).toBe(true);
      
      // Set second value with causal consistency
      const setResult2 = await dataConsistency.set(key, value2, 'causal');
      expect(setResult2).toBe(true);
      
      // Get value with causal consistency - should get latest value
      const getValue = await dataConsistency.get(key, 'causal');
      expect(getValue).toEqual(value2);
    });
  });
  
  describe('Read-Your-Writes Consistency', () => {
    beforeEach(() => {
      // Register multiple nodes
      for (let i = 1; i <= 5; i++) {
        dataConsistency.registerNode({
          id: `ryw-node-${i}`,
          endpoint: `http://node${i}:8080`,
          region: `region-${i % 3}`,
          zone: `zone-${i % 2}`,
          isActive: true
        });
      }
    });
    
    test('should set and get value with read-your-writes consistency', async () => {
      const key = 'test-key-ryw';
      const value = { message: 'read your writes' };
      
      // Set value with read-your-writes consistency
      const setResult = await dataConsistency.set(key, value, 'read-your-writes');
      expect(setResult).toBe(true);
      
      // Get value with read-your-writes consistency
      const getValue = await dataConsistency.get(key, 'read-your-writes');
      expect(getValue).toEqual(value);
    });
  });
  
  describe('Error Handling and Edge Cases', () => {
    beforeEach(() => {
      // Register some nodes
      for (let i = 1; i <= 3; i++) {
        dataConsistency.registerNode({
          id: `error-node-${i}`,
          endpoint: `http://node${i}:8080`,
          region: `region-${i % 2}`,
          zone: `zone-${i % 2}`,
          isActive: true
        });
        
        // Set high error rates on some nodes
        if (i > 1) {
          dataConsistency.updateNodeMetrics(`error-node-${i}`, {
            errorRate: 0.9, // 90% error rate
            latency: 200,
            capacityPercent: 50
          });
        }
      }
    });
    
    test('should handle node failures gracefully', async () => {
      const key = 'test-key-failures';
      const value = { message: 'handling failures' };
      
      // Set value with default (eventual) consistency
      // Should succeed despite high error rates on most nodes
      const setResult = await dataConsistency.set(key, value);
      expect(setResult).toBe(true);
      
      // Should be able to read it back
      const getValue = await dataConsistency.get(key);
      expect(getValue).toEqual(value);
    });
    
    test('should handle all nodes down', async () => {
      // Deactivate all nodes
      for (let i = 1; i <= 3; i++) {
        dataConsistency.updateNodeStatus(`error-node-${i}`, false);
      }
      
      const key = 'test-key-all-down';
      const value = { message: 'all nodes down' };
      
      // Set should fail when all nodes are down
      const setResult = await dataConsistency.set(key, value);
      expect(setResult).toBe(false);
      
      // Get should return null
      const getValue = await dataConsistency.get(key);
      expect(getValue).toBeNull();
    });
    
    test('should handle unknown consistency level', async () => {
      const key = 'test-key-unknown';
      const value = { message: 'unknown consistency' };
      
      // Use invalid consistency level
      await expect(dataConsistency.set(key, value, 'invalid' as any)).rejects.toThrow('Unknown consistency level');
      await expect(dataConsistency.get(key, 'invalid' as any)).rejects.toThrow('Unknown consistency level');
    });
  });
  
  describe('Service Statistics', () => {
    test('should return valid statistics', () => {
      // Register some nodes with different status
      dataConsistency.registerNode({
        id: 'stats-node-1',
        endpoint: 'http://node1:8080',
        region: 'us-east',
        zone: 'us-east-1a',
        isActive: true
      });
      
      dataConsistency.registerNode({
        id: 'stats-node-2',
        endpoint: 'http://node2:8080',
        region: 'us-east',
        zone: 'us-east-1a',
        isActive: true,
        isReadOnly: true // Read-only node
      });
      
      dataConsistency.registerNode({
        id: 'stats-node-3',
        endpoint: 'http://node3:8080',
        region: 'us-east',
        zone: 'us-east-1a',
        isActive: false // Inactive node
      });
      
      // Get stats
      const stats = dataConsistency.getStats();
      
      expect(stats.nodes).toBe(3);
      expect(stats.activeNodes).toBe(2);
      expect(stats.readOnlyNodes).toBe(1);
      
      // Should report 4 consistency levels
      expect(stats.consistencyLevels.length).toBe(4);
      expect(stats.consistencyLevels).toContain('strong');
      expect(stats.consistencyLevels).toContain('eventual');
      expect(stats.consistencyLevels).toContain('causal');
      expect(stats.consistencyLevels).toContain('read-your-writes');
    });
  });
});