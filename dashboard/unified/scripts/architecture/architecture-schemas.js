/**
 * Architecture Schema Definitions
 * 
 * This file contains standardized schemas and calculation utilities for the
 * architecture dashboard. These schemas provide a layer between raw markdown parsing
 * and dashboard visualization, ensuring consistent calculations and data formats.
 */

// Status Constants
const STATUS = {
  COMPLETE: 'complete',
  IN_PROGRESS: 'in-progress',
  PLANNED: 'planned',
  NOT_STARTED: 'not-started'
};

// Status Emoji Mapping
const STATUS_EMOJI = {
  [STATUS.COMPLETE]: '=â',
  [STATUS.IN_PROGRESS]: '=á',
  [STATUS.PLANNED]: '=à',
  [STATUS.NOT_STARTED]: '=4'
};

/**
 * Component Schema - Base structure for component data
 */
const ComponentSchema = {
  id: '',                     // Unique identifier for the component
  name: '',                   // Display name
  description: '',            // Detailed description
  status: STATUS.NOT_STARTED, // Current status
  project: '',                // Associated project (montpc, mexpress, giandra)
  layer: '',                  // Architecture layer (api, service, data, infrastructure)
  brqs: [],                   // Associated BRQ IDs
  dependencies: [],           // Components this component depends on
  tests: {                    // Test statistics
    total: 0,
    passing: 0,
    failing: 0,
    skipped: 0
  },
  completion: 0               // Percentage completion (0-100)
};

/**
 * BRQ Schema - Base structure for Business Requirement data
 */
const BRQSchema = {
  id: '',                     // Unique identifier (e.g., MEXP-2025-007-BE)
  name: '',                   // Display name
  description: '',            // Detailed description
  status: STATUS.NOT_STARTED, // Current status
  priority: 'P0',             // Priority level (P0, P1, P2, P3)
  components: [],             // Associated component IDs
  tags: [],                   // Classification tags
  tests: {                    // Test statistics
    total: 0,
    passing: 0,
    failing: 0,
    skipped: 0
  },
  completion: 0               // Percentage completion (0-100)
};

/**
 * Phase Schema - Base structure for roadmap phase data
 */
const PhaseSchema = {
  id: '',                     // Phase identifier (e.g., "phase1")
  number: 0,                  // Phase number (1, 2, 3, 4)
  name: '',                   // Display name
  description: '',            // Detailed description
  status: STATUS.NOT_STARTED, // Current status
  items: [],                  // Phase deliverables/items
  components: [],             // Associated component IDs
  brqs: [],                   // Associated BRQ IDs
  completion: 0               // Percentage completion (0-100)
};

/**
 * Project Schema - Base structure for project data
 */
const ProjectSchema = {
  id: '',                     // Project identifier (e.g., "montpc")
  name: '',                   // Display name
  description: '',            // Detailed description
  components: [],             // Component IDs in this project
  brqs: [],                   // BRQ IDs in this project
  currentPhase: '',           // Current phase ID
  tests: {                    // Test statistics
    total: 0,
    passing: 0,
    failing: 0,
    skipped: 0
  },
  completion: 0               // Percentage completion (0-100)
};

/**
 * Connection Schema - Structure for component relationships
 */
const ConnectionSchema = {
  source: '',                 // Source component ID
  target: '',                 // Target component ID 
  type: 'dependency',         // Relationship type (dependency, layer)
  strength: 1                 // Relationship strength (1-5)
};

/**
 * Calculation Utilities
 */
const CalculationUtils = {
  /**
   * Calculate component completion percentage from test results
   * @param {Object} tests - Test statistics object
   * @returns {number} - Completion percentage (0-100)
   */
  calculateComponentCompletion: function(tests) {
    if (tests.total === 0) return 0;
    return Math.round((tests.passing / tests.total) * 100);
  },

  /**
   * Calculate BRQ completion percentage from test results
   * @param {Object} tests - Test statistics object 
   * @returns {number} - Completion percentage (0-100)
   */
  calculateBRQCompletion: function(tests) {
    if (tests.total === 0) return 0;
    return Math.round((tests.passing / tests.total) * 100);
  },

  /**
   * Calculate project completion from components
   * @param {Array} components - Array of component objects
   * @returns {number} - Completion percentage (0-100)
   */
  calculateProjectCompletion: function(components) {
    if (components.length === 0) return 0;
    
    const completeCount = components.filter(c => c.status === STATUS.COMPLETE).length;
    const inProgressCount = components.filter(c => c.status === STATUS.IN_PROGRESS).length;
    
    // Weight complete components as 100% and in-progress as 50%
    return Math.round(((completeCount + (inProgressCount * 0.5)) / components.length) * 100);
  },

  /**
   * Calculate phase completion from components or BRQs
   * @param {Array} items - Array of component or BRQ objects
   * @returns {number} - Completion percentage (0-100)
   */
  calculatePhaseCompletion: function(items) {
    if (items.length === 0) return 0;
    
    const sum = items.reduce((acc, item) => acc + item.completion, 0);
    return Math.round(sum / items.length);
  },

  /**
   * Determine component status based on test results
   * @param {Object} tests - Test statistics object
   * @returns {string} - Status constant
   */
  determineComponentStatus: function(tests) {
    if (tests.total === 0) return STATUS.NOT_STARTED;
    
    const passRatio = tests.passing / tests.total;
    
    if (passRatio === 1) return STATUS.COMPLETE;
    if (passRatio >= 0.5) return STATUS.IN_PROGRESS;
    if (tests.passing > 0) return STATUS.PLANNED;
    return STATUS.NOT_STARTED;
  },

  /**
   * Get status counts for components
   * @param {Array} components - Array of component objects
   * @returns {Object} - Counts by status
   */
  getComponentStatusCounts: function(components) {
    return {
      complete: components.filter(c => c.status === STATUS.COMPLETE).length,
      inProgress: components.filter(c => c.status === STATUS.IN_PROGRESS).length,
      planned: components.filter(c => c.status === STATUS.PLANNED).length,
      notStarted: components.filter(c => c.status === STATUS.NOT_STARTED).length
    };
  },

  /**
   * Get status counts for BRQs
   * @param {Array} brqs - Array of BRQ objects
   * @returns {Object} - Counts by status
   */
  getBRQStatusCounts: function(brqs) {
    return {
      complete: brqs.filter(b => b.status === STATUS.COMPLETE).length,
      inProgress: brqs.filter(b => b.status === STATUS.IN_PROGRESS).length,
      planned: brqs.filter(b => b.status === STATUS.PLANNED).length,
      notStarted: brqs.filter(b => b.status === STATUS.NOT_STARTED).length
    };
  },

  /**
   * Calculate total test statistics across multiple items
   * @param {Array} items - Array of objects with test properties
   * @returns {Object} - Aggregated test statistics
   */
  aggregateTestStats: function(items) {
    return items.reduce((acc, item) => {
      return {
        total: acc.total + item.tests.total,
        passing: acc.passing + item.tests.passing,
        failing: acc.failing + item.tests.failing,
        skipped: acc.skipped + item.tests.skipped
      };
    }, { total: 0, passing: 0, failing: 0, skipped: 0 });
  },

  /**
   * Generate chart data for component status
   * @param {Array} components - Array of component objects
   * @returns {Object} - Chart data in Chart.js format
   */
  generateComponentChartData: function(components) {
    const counts = this.getComponentStatusCounts(components);
    
    return {
      labels: ['Complete', 'In Progress', 'Planned', 'Not Started'],
      datasets: [{
        data: [counts.complete, counts.inProgress, counts.planned, counts.notStarted],
        backgroundColor: [
          'var(--complete-color)',
          'var(--in-progress-color)',
          'var(--planned-color)',
          'var(--not-started-color)'
        ],
        borderWidth: 0
      }]
    };
  },

  /**
   * Generate chart data for BRQ progress
   * @param {Array} brqs - Array of BRQ objects
   * @returns {Object} - Chart data in Chart.js format
   */
  generateBRQChartData: function(brqs) {
    const counts = this.getBRQStatusCounts(brqs);
    
    return {
      labels: ['Completed', 'In Progress', 'Planned'],
      datasets: [{
        data: [counts.complete, counts.inProgress, counts.planned],
        backgroundColor: [
          'var(--complete-color)',
          'var(--in-progress-color)',
          'var(--planned-color)'
        ],
        borderWidth: 0
      }]
    };
  },

  /**
   * Filter components by project
   * @param {Array} components - Array of component objects
   * @param {string} projectId - Project identifier
   * @returns {Array} - Filtered components
   */
  filterComponentsByProject: function(components, projectId) {
    if (projectId === 'all') return components;
    return components.filter(component => component.project === projectId);
  },

  /**
   * Get related BRQs for a component
   * @param {string} componentId - Component identifier
   * @param {Array} brqs - Array of BRQ objects
   * @returns {Array} - Related BRQs
   */
  getRelatedBRQs: function(componentId, brqs) {
    return brqs.filter(brq => brq.components.includes(componentId));
  },

  /**
   * Generate component connections list
   * @param {Array} components - Array of component objects
   * @returns {Array} - Connection objects
   */
  generateComponentConnections: function(components) {
    const connections = [];
    
    // Create dependency connections based on component dependencies
    components.forEach(component => {
      component.dependencies.forEach(depId => {
        connections.push({
          source: depId,
          target: component.id,
          type: 'dependency',
          strength: 2
        });
      });
    });
    
    // Add layer connections between adjacent layer components
    const layers = ['api', 'service', 'data', 'infrastructure'];
    
    for (let i = 0; i < layers.length - 1; i++) {
      const upperLayerComponents = components.filter(c => c.layer === layers[i]);
      const lowerLayerComponents = components.filter(c => c.layer === layers[i + 1]);
      
      // Add connections between layers based on name similarity or other heuristics
      upperLayerComponents.forEach(upperComp => {
        lowerLayerComponents.forEach(lowerComp => {
          // Example heuristic: connect if name contains similar substring
          // In real implementation, this would use more sophisticated matching
          if (upperComp.name.toLowerCase().includes(lowerComp.name.toLowerCase().split(' ')[0]) ||
              lowerComp.name.toLowerCase().includes(upperComp.name.toLowerCase().split(' ')[0])) {
            connections.push({
              source: upperComp.id,
              target: lowerComp.id,
              type: 'layer',
              strength: 1
            });
          }
        });
      });
    }
    
    return connections;
  }
};

// Export all schemas and utilities
module.exports = {
  STATUS,
  STATUS_EMOJI,
  ComponentSchema,
  BRQSchema,
  PhaseSchema,
  ProjectSchema,
  ConnectionSchema,
  CalculationUtils
};