// Export all visualization components

// Base charts
import BaseChart from './charts/BaseChart.vue';
import BarChart from './charts/BarChart.vue';

// Export utilities
export * from './utils';

// Export chart components
export {
  // Base charts
  BaseChart,
  BarChart
};

// Default export for Vue plugin
export default {
  install: (app: any) => {
    // Register all components globally
    app.component('MBaseChart', BaseChart);
    app.component('MBarChart', BarChart);
  }
};