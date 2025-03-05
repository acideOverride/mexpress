<template>
  <div class="chart-example">
    <h3>Line Chart Example</h3>
    
    <div class="controls">
      <div class="control-group">
        <label>Chart Type:</label>
        <select v-model="chartType">
          <option value="single">Single Series</option>
          <option value="multi">Multi-Series</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Curve Type:</label>
        <select v-model="curveType">
          <option value="linear">Linear</option>
          <option value="monotone">Monotone</option>
          <option value="stepAfter">Step After</option>
          <option value="cardinal">Cardinal</option>
          <option value="catmullRom">Catmull Rom</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>X Axis Type:</label>
        <select v-model="xScaleType">
          <option value="linear">Linear</option>
          <option value="time">Time</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showPoints" />
          Show Points
        </label>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showArea" />
          Show Area
        </label>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="enableCrosshair" />
          Enable Crosshair
        </label>
      </div>
      
      <div class="control-group">
        <label>Point Shape:</label>
        <select v-model="pointShape" :disabled="!showPoints">
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="diamond">Diamond</option>
        </select>
      </div>
    </div>
    
    <div class="chart-container">
      <LineChart
        :data="chartData"
        title="Monthly Sales Data"
        subtitle="2024-2025"
        x-axis-title="Month"
        y-axis-title="Revenue ($)"
        :curve="curveType"
        :enable-points="showPoints"
        :point-shape="pointShape"
        :enable-area="showArea"
        :area-opacity="0.2"
        :enable-crosshair="enableCrosshair"
        :x-scale="xScaleType"
        :x-axis-tick-format="xAxisTickFormat"
        :animate="true"
        :height="400"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import LineChart from './LineChart.vue';
import { ChartData } from '@/types';
import * as d3 from 'd3';

export default defineComponent({
  name: 'LineChartExample',
  components: {
    LineChart
  },
  setup() {
    // Chart configuration options
    const chartType = ref<'single' | 'multi'>('single');
    const curveType = ref<'linear' | 'monotone' | 'stepAfter' | 'cardinal' | 'catmullRom'>('monotone');
    const showPoints = ref(true);
    const pointShape = ref<'circle' | 'square' | 'diamond'>('circle');
    const showArea = ref(true);
    const enableCrosshair = ref(false);
    const xScaleType = ref<'linear' | 'time'>('linear');
    
    // Generate single series data
    const generateSingleSeriesData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dates = months.map((m, i) => `2024-${String(i + 1).padStart(2, '0')}-01`);
      
      return {
        data: dates.map((date, i) => ({
          label: xScaleType.value === 'time' ? date : months[i],
          value: 10000 + Math.random() * 5000 + (i * 500) + (i % 3 === 0 ? 2000 : 0)
        }))
      };
    };
    
    // Generate multi-series data
    const generateMultiSeriesData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dates = months.map((m, i) => `2024-${String(i + 1).padStart(2, '0')}-01`);
      
      return {
        series: [
          {
            id: 1,
            name: 'Product A',
            data: dates.map((date, i) => ({
              label: xScaleType.value === 'time' ? date : months[i],
              value: 10000 + Math.random() * 4000 + (i * 400) + (i % 3 === 0 ? 1500 : 0)
            }))
          },
          {
            id: 2,
            name: 'Product B',
            data: dates.map((date, i) => ({
              label: xScaleType.value === 'time' ? date : months[i],
              value: 8000 + Math.random() * 3000 + (i * 350) + (i % 2 === 0 ? 1200 : 0)
            }))
          },
          {
            id: 3,
            name: 'Product C',
            data: dates.map((date, i) => ({
              label: xScaleType.value === 'time' ? date : months[i],
              value: 6000 + Math.random() * 2000 + (i * 300) + (i % 4 === 0 ? 2000 : 0)
            }))
          }
        ]
      };
    };
    
    // Chart data based on selection
    const chartData = computed<ChartData>(() => {
      return chartType.value === 'single' ? generateSingleSeriesData() : generateMultiSeriesData();
    });
    
    // Format function for time-based x-axis
    const xAxisTickFormat = (d: any) => {
      if (xScaleType.value === 'time') {
        const date = new Date(d);
        return d3.timeFormat('%b')(date);
      }
      return d;
    };
    
    // Click handler
    const handleClick = (event: any) => {
      console.log('Chart click:', event);
    };
    
    return {
      chartType,
      curveType,
      showPoints,
      pointShape,
      showArea,
      enableCrosshair,
      xScaleType,
      chartData,
      xAxisTickFormat,
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

.chart-container {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 450px;
}

h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #1f2937;
}
</style>