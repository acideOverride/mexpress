// UI Components
import Button from './components/ui/Button.vue';
import Input from './components/ui/Input.vue';
import Card from './components/ui/Card.vue';
import Checkbox from './components/ui/Checkbox.vue';
import Select from './components/ui/Select.vue';
import Table from './components/ui/Table.vue';
import TableExample from './components/ui/TableExample.vue';
import Toggle from './components/ui/Toggle.vue';

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout.vue';
import Sidebar from './components/layout/Sidebar.vue';

// Import visualization components
import { BaseChart, BarChart, LineChart, PieChart, AreaChart } from './components/visualizations';

// Import search components
import {
  LiveSearch,
  CustomerResult,
  ProductResult,
  UserResult,
  CreateNewModal,
  CustomerForm,
  ProductForm,
  UserForm
} from './components/search';
import LiveSearchExample from './components/search/LiveSearchExample.vue';
import CreateNewExample from './components/search/CreateNewExample.vue';

// Import directives
import { highlightDirective } from './directives/highlight';

// Import stores and Pinia
import { pinia } from './stores/pinia';

// Export types
export * from './types';

// Export composables
export * from './composables';

// Export visualization utilities
export * from './components/visualizations/utils';

// Export stores
export * from './stores';

// Export all components
export {
  // UI Components
  Button,
  Input,
  Card,
  Checkbox,
  Select,
  Table,
  TableExample,
  Toggle,
  
  // Layout Components
  DashboardLayout,
  Sidebar,
  
  // Chart Components
  BaseChart,
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  
  // Search Components
  LiveSearch,
  LiveSearchExample,
  CreateNewExample,
  CustomerResult,
  ProductResult,
  UserResult,
  CreateNewModal,
  CustomerForm,
  ProductForm,
  UserForm,
  
  // Directives
  highlightDirective,
  
  // Pinia instance
  pinia
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
    app.component('MTable', Table);
    app.component('MTableExample', TableExample);
    app.component('MToggle', Toggle);
    
    // Layout Components
    app.component('MDashboardLayout', DashboardLayout);
    app.component('MSidebar', Sidebar);
    
    // Chart Components
    app.component('MBaseChart', BaseChart);
    app.component('MBarChart', BarChart);
    app.component('MLineChart', LineChart);
    app.component('MPieChart', PieChart);
    app.component('MAreaChart', AreaChart);
    
    // Search Components
    app.component('MLiveSearch', LiveSearch);
    app.component('MLiveSearchExample', LiveSearchExample);
    app.component('MCreateNewExample', CreateNewExample);
    app.component('MCustomerResult', CustomerResult);
    app.component('MProductResult', ProductResult);
    app.component('MUserResult', UserResult);
    
    // Register directives
    app.directive('highlight', highlightDirective);
    
    // Install Pinia
    app.use(pinia);
  }
};