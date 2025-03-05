// UI Components
import Button from './components/ui/Button.vue';
import Input from './components/ui/Input.vue';
import Card from './components/ui/Card.vue';
import Checkbox from './components/ui/Checkbox.vue';
import Select from './components/ui/Select.vue';
import Toggle from './components/ui/Toggle.vue';

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout.vue';
import Sidebar from './components/layout/Sidebar.vue';

// Import visualization components
import { BaseChart, BarChart } from './components/visualizations';

// Export types
export * from './types';

// Export composables
export * from './composables';

// Export visualization utilities
export * from './components/visualizations/utils';

// Export all components
export {
  // UI Components
  Button,
  Input,
  Card,
  Checkbox,
  Select,
  Toggle,
  
  // Layout Components
  DashboardLayout,
  Sidebar,
  
  // Chart Components
  BaseChart,
  BarChart
};

// Vue plugin
export default {
  install: (app: any) => {
    // Register all components globally
    
    // UI Components
    app.component('MButton', Button);
    app.component('MInput', Input);
    app.component('MCard', Card);
    app.component('MCheckbox', Checkbox);
    app.component('MSelect', Select);
    app.component('MToggle', Toggle);
    
    // Layout Components
    app.component('MDashboardLayout', DashboardLayout);
    app.component('MSidebar', Sidebar);
    
    // Chart Components
    app.component('MBaseChart', BaseChart);
    app.component('MBarChart', BarChart);
  }
};