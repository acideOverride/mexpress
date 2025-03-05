// Export all visualization components

// Base charts
import BaseChart from './charts/BaseChart.vue';
import BarChart from './charts/BarChart.vue';
import LineChart from './charts/LineChart.vue';
import PieChart from './charts/PieChart.vue';

// Example components
import BarChartExample from './charts/BarChartExample.vue';
import LineChartExample from './charts/LineChartExample.vue';
import PieChartExample from './charts/PieChartExample.vue';

// Export utilities
export * from './utils';

// Export chart components
export {
  // Base charts
  BaseChart,
  BarChart,
  LineChart,
  PieChart,
  // Examples
  BarChartExample,
  LineChartExample,
  PieChartExample
};

// Default export for Vue plugin
export default {
  install: (app: any) => {
    // Register all components globally
    app.component('MBaseChart', BaseChart);
    app.component('MBarChart', BarChart);
    app.component('MLineChart', LineChart);
    app.component('MPieChart', PieChart);
  }
};