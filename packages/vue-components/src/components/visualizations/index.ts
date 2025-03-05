// Export all visualization components

// Base charts
import BaseChart from './charts/BaseChart.vue';
import BarChart from './charts/BarChart.vue';
import LineChart from './charts/LineChart.vue';

// Example components
import BarChartExample from './charts/BarChartExample.vue';
import LineChartExample from './charts/LineChartExample.vue';

// Export utilities
export * from './utils';

// Export chart components
export {
  // Base charts
  BaseChart,
  BarChart,
  LineChart,
  // Examples
  BarChartExample,
  LineChartExample
};

// Default export for Vue plugin
export default {
  install: (app: any) => {
    // Register all components globally
    app.component('MBaseChart', BaseChart);
    app.component('MBarChart', BarChart);
    app.component('MLineChart', LineChart);
  }
};