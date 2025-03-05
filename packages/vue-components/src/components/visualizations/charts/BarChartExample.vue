<template>
  <div class="chart-example">
    <div class="controls">
      <div class="control-group">
        <label>Orientation</label>
        <div class="control-options">
          <button 
            @click="orientation = 'vertical'" 
            :class="{ active: orientation === 'vertical' }"
          >
            Vertical
          </button>
          <button 
            @click="orientation = 'horizontal'" 
            :class="{ active: orientation === 'horizontal' }"
          >
            Horizontal
          </button>
        </div>
      </div>
      
      <div class="control-group">
        <label>Grouping</label>
        <div class="control-options">
          <button 
            @click="grouping = 'grouped'" 
            :class="{ active: grouping === 'grouped' }"
          >
            Grouped
          </button>
          <button 
            @click="grouping = 'stacked'" 
            :class="{ active: grouping === 'stacked' }"
          >
            Stacked
          </button>
        </div>
      </div>
      
      <div class="control-group">
        <label>Theme</label>
        <div class="control-options">
          <button 
            @click="theme = 'light'" 
            :class="{ active: theme === 'light' }"
          >
            Light
          </button>
          <button 
            @click="theme = 'dark'" 
            :class="{ active: theme === 'dark' }"
          >
            Dark
          </button>
        </div>
      </div>
      
      <div class="control-group">
        <label>Labels</label>
        <div class="control-options">
          <input type="checkbox" v-model="enableLabels" id="labels-toggle" />
          <label for="labels-toggle">Show Labels</label>
        </div>
      </div>
      
      <div class="control-group">
        <label>Sort By</label>
        <div class="control-options">
          <select v-model="sortBy">
            <option value="value">Value</option>
            <option value="label">Label</option>
          </select>
          <select v-model="sortOrder">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <BarChart
        :data="chartData"
        :title="'Product Sales by Category'"
        :subtitle="'Q1 2025'"
        :orientation="orientation"
        :grouping="grouping"
        :theme="theme"
        :enable-labels="enableLabels"
        :enable-sort="true"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        :show-grid="true"
        :x-axis-title="orientation === 'vertical' ? 'Product Category' : 'Sales ($)'"
        :y-axis-title="orientation === 'vertical' ? 'Sales ($)' : 'Product Category'"
        :animate="true"
        @click="handleChartClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BarChart } from '@/components/visualizations';
import { ChartData, SeriesData } from '@/types';

export default defineComponent({
  name: 'BarChartExample',
  components: {
    BarChart
  },
  setup() {
    const orientation = ref<'vertical' | 'horizontal'>('vertical');
    const grouping = ref<'grouped' | 'stacked'>('grouped');
    const theme = ref<'light' | 'dark'>('light');
    const enableLabels = ref(false);
    const sortBy = ref<'value' | 'label'>('value');
    const sortOrder = ref<'asc' | 'desc'>('desc');
    
    // Sample data for the chart
    const chartData: ChartData = {
      series: [
        {
          id: 1,
          name: 'Q1 2025',
          color: '#4C78DB',
          data: [
            { label: 'Electronics', value: 42000 },
            { label: 'Clothing', value: 28500 },
            { label: 'Home & Garden', value: 18900 },
            { label: 'Sports', value: 14200 },
            { label: 'Books', value: 9300 }
          ]
        },
        {
          id: 2,
          name: 'Q4 2024',
          color: '#F58518',
          data: [
            { label: 'Electronics', value: 38000 },
            { label: 'Clothing', value: 31000 },
            { label: 'Home & Garden', value: 16500 },
            { label: 'Sports', value: 12000 },
            { label: 'Books', value: 10500 }
          ]
        },
        {
          id: 3,
          name: 'Q3 2024',
          color: '#60BD68',
          data: [
            { label: 'Electronics', value: 36500 },
            { label: 'Clothing', value: 24000 },
            { label: 'Home & Garden', value: 19500 },
            { label: 'Sports', value: 11800 },
            { label: 'Books', value: 8700 }
          ]
        }
      ]
    };
    
    // Handle chart click events
    const handleChartClick = (event: any) => {
      console.log('Chart clicked:', event);
      
      if (event.data) {
        alert(`Clicked on: ${event.data.label} - ${event.data.value}`);
      }
    };
    
    return {
      orientation,
      grouping,
      theme,
      enableLabels,
      sortBy,
      sortOrder,
      chartData,
      handleChartClick
    };
  }
});
</script>

<style scoped>
.chart-example {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: bold;
  font-size: 0.875rem;
  color: #333;
}

.control-options {
  display: flex;
  gap: 0.5rem;
}

.control-options button {
  background-color: #e0e0e0;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.control-options button.active {
  background-color: #4C78DB;
  color: white;
}

.control-options select {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
  font-size: 0.875rem;
}

.chart-container {
  flex: 1;
  min-height: 400px;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>