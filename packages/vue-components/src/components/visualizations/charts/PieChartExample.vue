<template>
  <div class="chart-example">
    <h3>Pie/Donut Chart Example</h3>
    
    <div class="controls">
      <div class="control-group">
        <label>Chart Type:</label>
        <select v-model="chartType">
          <option value="pie">Pie Chart</option>
          <option value="donut">Donut Chart</option>
        </select>
      </div>
      
      <div class="control-group" v-if="chartType === 'donut'">
        <label>Inner Radius:</label>
        <select v-model="innerRadius">
          <option value="25%">25%</option>
          <option value="40%">40%</option>
          <option value="50%">50%</option>
          <option value="60%">60%</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Pad Angle:</label>
        <input type="range" min="0" max="0.1" step="0.01" v-model.number="padAngle" />
        <span>{{ padAngle.toFixed(2) }}</span>
      </div>
      
      <div class="control-group">
        <label>Corner Radius:</label>
        <input type="range" min="0" max="10" step="1" v-model.number="cornerRadius" />
        <span>{{ cornerRadius }}</span>
      </div>
      
      <div class="control-group">
        <label>Label Type:</label>
        <select v-model="labelType">
          <option value="value">Value</option>
          <option value="percent">Percentage</option>
          <option value="name">Name</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Label Position:</label>
        <select v-model="labelPosition">
          <option value="inside">Inside</option>
          <option value="outside">Outside</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="enableLabels" />
          Show Labels
        </label>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="sortData" />
          Sort Data
        </label>
      </div>
      
      <div class="control-group">
        <label>Legend Position:</label>
        <select v-model="legendPosition">
          <option value="top">Top</option>
          <option value="right">Right</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showLegend" />
          Show Legend
        </label>
      </div>
    </div>
    
    <div class="chart-container">
      <PieChart
        :data="chartData"
        title="Revenue by Product Category"
        subtitle="Q1 2025"
        :inner-radius="chartType === 'donut' ? innerRadius : 0"
        :pad-angle="padAngle"
        :corner-radius="cornerRadius"
        :enable-labels="enableLabels"
        :label-type="labelType"
        :label-position="labelPosition"
        :sort-data="sortData"
        :show-legend="showLegend"
        :legend-position="legendPosition"
        :active-segment="activeSegment"
        :height="400"
        @click="handleClick"
      />
    </div>
    
    <div class="active-segment" v-if="selectedSegment">
      <h4>Selected Segment</h4>
      <p><strong>{{ selectedSegment.label }}:</strong> {{ selectedSegment.value.toLocaleString() }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import PieChart from './PieChart.vue';
import { ChartData, DataPoint } from '@/types';

export default defineComponent({
  name: 'PieChartExample',
  components: {
    PieChart
  },
  setup() {
    // Chart configuration options
    const chartType = ref<'pie' | 'donut'>('pie');
    const innerRadius = ref<string>('40%');
    const padAngle = ref<number>(0.02);
    const cornerRadius = ref<number>(3);
    const enableLabels = ref<boolean>(true);
    const labelType = ref<'value' | 'percent' | 'name'>('percent');
    const labelPosition = ref<'inside' | 'outside'>('outside');
    const sortData = ref<boolean>(true);
    const showLegend = ref<boolean>(true);
    const legendPosition = ref<'top' | 'right' | 'bottom' | 'left'>('right');
    
    // Selected segment for highlighting
    const selectedSegment = ref<DataPoint | null>(null);
    const activeSegment = computed(() => selectedSegment.value?.id || selectedSegment.value?.label || null);
    
    // Sample data for the chart
    const chartData: ChartData = {
      data: [
        { id: 1, label: 'Electronics', value: 820000 },
        { id: 2, label: 'Apparel', value: 540000 },
        { id: 3, label: 'Home & Garden', value: 420000 },
        { id: 4, label: 'Sports', value: 320000 },
        { id: 5, label: 'Beauty', value: 280000 },
        { id: 6, label: 'Books', value: 190000 },
        { id: 7, label: 'Toys', value: 150000 }
      ]
    };
    
    // Click handler for interactivity
    const handleClick = (event: any) => {
      selectedSegment.value = selectedSegment.value?.id === event.data.id ? null : event.data;
    };
    
    return {
      chartType,
      innerRadius,
      padAngle,
      cornerRadius,
      enableLabels,
      labelType,
      labelPosition,
      sortData,
      showLegend,
      legendPosition,
      chartData,
      selectedSegment,
      activeSegment,
      handleClick
    };
  }
});
</script>

<style scoped>
.chart-example {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f9fc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.control-group select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #d0d5dd;
  font-size: 14px;
  min-width: 120px;
}

.control-group input[type="range"] {
  width: 120px;
}

.chart-container {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 450px;
}

.active-segment {
  margin-top: 20px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.active-segment h4 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
  color: #1f2937;
}

h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #1f2937;
}
</style>