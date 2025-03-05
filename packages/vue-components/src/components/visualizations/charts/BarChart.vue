<template>
  <BaseChart
    ref="baseChart"
    :data="data"
    :title="title"
    :subtitle="subtitle"
    :width="width"
    :height="height"
    :aspect-ratio="aspectRatio"
    :margin="margin"
    :min-width="minWidth"
    :min-height="minHeight"
    :theme="theme"
    :colors="colors"
    :custom-theme="customTheme"
    :accessible-description="accessibleDescription || generateAccessibleDescription()"
    :animate="animate"
    :animation-duration="animationDuration"
    :interactive="interactive"
    @ready="onChartReady"
    @click="(e) => $emit('click', e)"
    @hover="(e) => $emit('hover', e)"
    @mouseenter="(e) => $emit('mouseenter', e)"
    @mouseleave="(e) => $emit('mouseleave', e)"
    @selection-change="(e) => $emit('selection-change', e)"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, onMounted, onBeforeUnmount, watch } from 'vue';
import * as d3 from 'd3';
import BaseChart from './BaseChart.vue';
import { BarChartConfig, ChartData, DataPoint, SeriesData, ChartTheme } from '@/types';
import { 
  TooltipManager,
  LegendBuilder,
  getTheme,
  createColorScale,
  createContinuousScale,
  createBandScale,
  createAxis,
  applyThemeToAxis,
  formatNumberAbbrev,
  createAccessibleDescription
} from '../utils';

export default defineComponent({
  name: 'BarChart',
  components: {
    BaseChart
  },
  props: {
    // Base chart properties
    data: {
      type: Object as PropType<ChartData>,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    
    // Size options
    width: {
      type: [Number, String], 
      default: '100%'
    },
    height: {
      type: [Number, String],
      default: 300
    },
    aspectRatio: {
      type: Number,
      default: 0
    },
    margin: {
      type: Object as PropType<{ top: number; right: number; bottom: number; left: number }>,
      default: () => ({ top: 40, right: 20, bottom: 40, left: 50 })
    },
    minWidth: {
      type: Number,
      default: 200
    },
    minHeight: {
      type: Number,
      default: 200
    },
    
    // Bar chart specific options
    orientation: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical'
    },
    grouping: {
      type: String as PropType<'grouped' | 'stacked'>,
      default: 'grouped'
    },
    barPadding: {
      type: Number,
      default: 0.1
    },
    barWidth: {
      type: [Number, String],
      default: undefined
    },
    enableLabels: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String as PropType<'inside' | 'outside'>,
      default: 'outside'
    },
    enableSort: {
      type: Boolean,
      default: false
    },
    sortBy: {
      type: String as PropType<'value' | 'label' | 'custom'>,
      default: 'value'
    },
    sortOrder: {
      type: String as PropType<'asc' | 'desc'>,
      default: 'desc'
    },
    
    // Appearance
    theme: {
      type: String as PropType<'light' | 'dark' | 'custom'>,
      default: 'light'
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    customTheme: {
      type: Object as PropType<Partial<ChartTheme>>,
      default: () => ({})
    },
    
    // Axis configuration
    xAxisTitle: {
      type: String,
      default: ''
    },
    yAxisTitle: {
      type: String,
      default: ''
    },
    xAxisTickFormat: {
      type: Function as PropType<(value: any) => string>,
      default: null
    },
    yAxisTickFormat: {
      type: Function as PropType<(value: any) => string>,
      default: (value: number) => formatNumberAbbrev(value)
    },
    xAxisTickCount: {
      type: Number,
      default: undefined
    },
    yAxisTickCount: {
      type: Number,
      default: undefined
    },
    showGrid: {
      type: Boolean,
      default: true
    },
    
    // Legend
    showLegend: {
      type: Boolean,
      default: true
    },
    legendPosition: {
      type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
      default: 'bottom'
    },
    
    // Tooltip
    showTooltip: {
      type: Boolean,
      default: true
    },
    tooltipFormat: {
      type: Function as PropType<(point: DataPoint, series?: SeriesData) => string>,
      default: null
    },
    
    // Accessibility
    accessibleDescription: {
      type: String,
      default: ''
    },
    
    // Animation
    animate: {
      type: Boolean,
      default: true
    },
    animationDuration: {
      type: Number,
      default: 750
    },
    
    // Interactivity
    interactive: {
      type: Boolean,
      default: true
    }
  },
  
  emits: [
    'click',
    'hover',
    'mouseenter',
    'mouseleave',
    'selection-change'
  ],
  
  setup(props, { emit }) {
    const baseChart = ref<InstanceType<typeof BaseChart> | null>(null);
    const tooltipManager = ref<TooltipManager | null>(null);
    const sortedData = ref<DataPoint[] | SeriesData[]>([]);
    
    // Scales
    const xScale = ref<any>(null);
    const yScale = ref<any>(null);
    const colorScale = ref<any>(null);
    
    // Generate an accessible description for screen readers
    const generateAccessibleDescription = () => {
      if (!props.data) return '';
      
      const chartType = props.grouping === 'stacked' 
        ? 'Stacked bar chart' 
        : 'Bar chart';
      
      if (props.data.series) {
        // Multi-series data
        const firstSeries = props.data.series[0];
        if (!firstSeries) return chartType;
        
        const samplePoints = firstSeries.data.slice(0, 3).map(d => ({
          name: `${firstSeries.name} - ${d.label || ''}`,
          value: d.value
        }));
        
        return createAccessibleDescription(chartType, props.title, samplePoints);
      } else if (props.data.data) {
        // Single series data
        const samplePoints = props.data.data.slice(0, 5).map(d => ({
          name: d.label || '',
          value: d.value
        }));
        
        return createAccessibleDescription(chartType, props.title, samplePoints);
      }
      
      return chartType;
    };
    
    // Handle chart ready event
    const onChartReady = (chartInfo: any) => {
      // Initialize tooltip
      tooltipManager.value = new TooltipManager({
        show: props.showTooltip,
        format: props.tooltipFormat
      });
      
      // Draw initial chart
      drawChart();
    };
    
    // Draw or update the chart
    const drawChart = () => {
      if (!baseChart.value) return;
      
      const chartInstance = baseChart.value;
      const svg = chartInstance.svg();
      const chartGroup = chartInstance.chartGroup();
      
      if (!svg || !chartGroup) return;
      
      // Get chart dimensions
      const dimensions = chartInstance.dimensions();
      const { width, height, margin } = dimensions;
      
      // Get theme
      const theme = getTheme(props.theme, props.customTheme);
      
      // Sort data if needed
      updateSortedData();
      
      // Create scales based on orientation
      if (props.orientation === 'vertical') {
        createVerticalScales(width, height);
      } else {
        createHorizontalScales(width, height);
      }
      
      // Clear existing chart elements
      chartGroup.selectAll('.bar-group').remove();
      chartGroup.selectAll('.axis').remove();
      chartGroup.selectAll('.grid-line').remove();
      
      // Draw axes
      drawAxes(chartGroup, width, height, theme);
      
      // Draw bars
      if (props.data.series) {
        drawSeriesBars(chartGroup);
      } else if (props.data.data) {
        drawSingleSeriesBars(chartGroup);
      }
      
      // Draw legend
      if (props.showLegend) {
        drawLegend(svg, theme);
      }
    };
    
    // Create scales for vertical bar chart
    const createVerticalScales = (width: number, height: number) => {
      if (props.data.series) {
        // Multi-series data
        const series = sortedData.value as SeriesData[];
        const firstSeries = series[0]?.data || [];
        
        // Domain for x axis is the set of bar categories (labels)
        const xDomain = firstSeries.map(d => d.label || '');
        
        // Create x scale (band scale for categories)
        xScale.value = createBandScale(
          xDomain,
          [0, width],
          props.barPadding
        );
        
        if (props.grouping === 'stacked') {
          // For stacked bars, y domain is [0, max sum of all series values at each point]
          const maxStackedValue = d3.max(xDomain, (label) => {
            return d3.sum(series, serie => {
              const point = serie.data.find(d => d.label === label);
              return point ? point.value : 0;
            });
          }) || 0;
          
          yScale.value = createContinuousScale(
            [0, maxStackedValue],
            [height, 0]
          );
        } else {
          // For grouped bars, y domain is [0, max value across all series]
          const maxValue = d3.max(series, serie => 
            d3.max(serie.data, d => d.value)
          ) || 0;
          
          yScale.value = createContinuousScale(
            [0, maxValue],
            [height, 0]
          );
        }
        
        // Color scale for series
        colorScale.value = props.colors.length > 0
          ? d3.scaleOrdinal().domain(series.map(s => s.name)).range(props.colors)
          : createColorScale(theme, 'categorical');
          
      } else if (props.data.data) {
        // Single series data
        const data = sortedData.value as DataPoint[];
        
        // Domain for x axis is the set of bar categories (labels)
        const xDomain = data.map(d => d.label || '');
        
        // Create x scale (band scale for categories)
        xScale.value = createBandScale(
          xDomain,
          [0, width],
          props.barPadding
        );
        
        // Y scale based on data values
        const maxValue = d3.max(data, d => d.value) || 0;
        yScale.value = createContinuousScale(
          [0, maxValue],
          [height, 0]
        );
        
        // Color scale for bars
        colorScale.value = props.colors.length > 0
          ? d3.scaleOrdinal().domain(xDomain).range(props.colors)
          : (d: DataPoint) => d.color || theme.colors.primary[0];
      }
    };
    
    // Create scales for horizontal bar chart
    const createHorizontalScales = (width: number, height: number) => {
      if (props.data.series) {
        // Multi-series data
        const series = sortedData.value as SeriesData[];
        const firstSeries = series[0]?.data || [];
        
        // Domain for y axis is the set of bar categories (labels)
        const yDomain = firstSeries.map(d => d.label || '');
        
        // Create y scale (band scale for categories)
        yScale.value = createBandScale(
          yDomain,
          [0, height],
          props.barPadding
        );
        
        if (props.grouping === 'stacked') {
          // For stacked bars, x domain is [0, max sum of all series values at each point]
          const maxStackedValue = d3.max(yDomain, (label) => {
            return d3.sum(series, serie => {
              const point = serie.data.find(d => d.label === label);
              return point ? point.value : 0;
            });
          }) || 0;
          
          xScale.value = createContinuousScale(
            [0, maxStackedValue],
            [0, width]
          );
        } else {
          // For grouped bars, x domain is [0, max value across all series]
          const maxValue = d3.max(series, serie => 
            d3.max(serie.data, d => d.value)
          ) || 0;
          
          xScale.value = createContinuousScale(
            [0, maxValue],
            [0, width]
          );
        }
        
        // Color scale for series
        colorScale.value = props.colors.length > 0
          ? d3.scaleOrdinal().domain(series.map(s => s.name)).range(props.colors)
          : createColorScale(theme, 'categorical');
          
      } else if (props.data.data) {
        // Single series data
        const data = sortedData.value as DataPoint[];
        
        // Domain for y axis is the set of bar categories (labels)
        const yDomain = data.map(d => d.label || '');
        
        // Create y scale (band scale for categories)
        yScale.value = createBandScale(
          yDomain,
          [0, height],
          props.barPadding
        );
        
        // X scale based on data values
        const maxValue = d3.max(data, d => d.value) || 0;
        xScale.value = createContinuousScale(
          [0, maxValue],
          [0, width]
        );
        
        // Color scale for bars
        colorScale.value = props.colors.length > 0
          ? d3.scaleOrdinal().domain(yDomain).range(props.colors)
          : (d: DataPoint) => d.color || theme.colors.primary[0];
      }
    };
    
    // Draw axes
    const drawAxes = (
      chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
      width: number,
      height: number,
      theme: ChartTheme
    ) => {
      // Create and add axes based on orientation
      if (props.orientation === 'vertical') {
        // X Axis
        const xAxis = createAxis(xScale.value, 'bottom', props.xAxisTickCount);
        if (props.xAxisTickFormat) {
          xAxis.tickFormat(props.xAxisTickFormat);
        }
        
        const xAxisGroup = chartGroup.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0, ${height})`)
          .call(xAxis);
        
        applyThemeToAxis(xAxisGroup, theme);
        
        // Add X axis title if provided
        if (props.xAxisTitle) {
          xAxisGroup.append('text')
            .attr('class', 'axis-title')
            .attr('x', width / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .attr('fill', theme.axis.titleColor)
            .style('font-size', theme.typography.subtitleFontSize)
            .text(props.xAxisTitle);
        }
        
        // Y Axis
        const yAxis = createAxis(yScale.value, 'left', props.yAxisTickCount);
        if (props.yAxisTickFormat) {
          yAxis.tickFormat(props.yAxisTickFormat);
        }
        
        const yAxisGroup = chartGroup.append('g')
          .attr('class', 'axis y-axis')
          .call(yAxis);
        
        applyThemeToAxis(yAxisGroup, theme);
        
        // Add Y axis title if provided
        if (props.yAxisTitle) {
          yAxisGroup.append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .attr('fill', theme.axis.titleColor)
            .style('font-size', theme.typography.subtitleFontSize)
            .text(props.yAxisTitle);
        }
        
        // Add grid lines if enabled
        if (props.showGrid) {
          chartGroup.append('g')
            .attr('class', 'grid-line')
            .call(yAxis
              .tickSize(-width)
              .tickFormat('')
            )
            .call(g => {
              g.select('.domain').remove();
              g.selectAll('.tick line')
                .attr('stroke', theme.axis.gridColor)
                .attr('stroke-width', theme.axis.gridWidth)
                .attr('stroke-dasharray', '4,4');
            });
        }
      } else {
        // Horizontal orientation
        
        // Y Axis
        const yAxis = createAxis(yScale.value, 'left');
        if (props.yAxisTickFormat) {
          yAxis.tickFormat(props.yAxisTickFormat);
        }
        
        const yAxisGroup = chartGroup.append('g')
          .attr('class', 'axis y-axis')
          .call(yAxis);
        
        applyThemeToAxis(yAxisGroup, theme);
        
        // Add Y axis title if provided
        if (props.yAxisTitle) {
          yAxisGroup.append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .attr('fill', theme.axis.titleColor)
            .style('font-size', theme.typography.subtitleFontSize)
            .text(props.yAxisTitle);
        }
        
        // X Axis
        const xAxis = createAxis(xScale.value, 'bottom', props.xAxisTickCount);
        if (props.xAxisTickFormat) {
          xAxis.tickFormat(props.xAxisTickFormat);
        }
        
        const xAxisGroup = chartGroup.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0, ${height})`)
          .call(xAxis);
        
        applyThemeToAxis(xAxisGroup, theme);
        
        // Add X axis title if provided
        if (props.xAxisTitle) {
          xAxisGroup.append('text')
            .attr('class', 'axis-title')
            .attr('x', width / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .attr('fill', theme.axis.titleColor)
            .style('font-size', theme.typography.subtitleFontSize)
            .text(props.xAxisTitle);
        }
        
        // Add grid lines if enabled
        if (props.showGrid) {
          chartGroup.append('g')
            .attr('class', 'grid-line')
            .call(xAxis
              .tickSize(height)
              .tickFormat('')
            )
            .call(g => {
              g.select('.domain').remove();
              g.selectAll('.tick line')
                .attr('stroke', theme.axis.gridColor)
                .attr('stroke-width', theme.axis.gridWidth)
                .attr('stroke-dasharray', '4,4');
            });
        }
      }
    };
    
    // Draw single series bars
    const drawSingleSeriesBars = (chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>) => {
      if (!props.data.data) return;
      
      const data = sortedData.value as DataPoint[];
      const theme = getTheme(props.theme, props.customTheme);
      
      // Bar group
      const barGroup = chartGroup
        .append('g')
        .attr('class', 'bar-group');
      
      if (props.orientation === 'vertical') {
        // Vertical bars
        const bars = barGroup
          .selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', d => xScale.value(d.label || ''))
          .attr('y', height => yScale.value(0))
          .attr('width', xScale.value.bandwidth())
          .attr('height', 0)
          .attr('fill', d => typeof colorScale.value === 'function' ? colorScale.value(d) : colorScale.value(d.label || ''))
          .attr('opacity', theme.elements.barOpacity);
        
        // Add animation if enabled
        if (props.animate) {
          bars.transition()
            .duration(props.animationDuration)
            .attr('y', d => yScale.value(d.value))
            .attr('height', d => yScale.value(0) - yScale.value(d.value));
        } else {
          bars
            .attr('y', d => yScale.value(d.value))
            .attr('height', d => yScale.value(0) - yScale.value(d.value));
        }
        
        // Add labels if enabled
        if (props.enableLabels) {
          const labelGroup = chartGroup
            .append('g')
            .attr('class', 'label-group');
          
          labelGroup
            .selectAll('.bar-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', d => xScale.value(d.label || '') + xScale.value.bandwidth() / 2)
            .attr('y', d => {
              const yPos = yScale.value(d.value);
              return props.labelPosition === 'inside' ? yPos + 16 : yPos - 6;
            })
            .attr('text-anchor', 'middle')
            .attr('fill', d => props.labelPosition === 'inside' ? '#fff' : theme.axis.labelColor)
            .style('font-size', theme.typography.labelFontSize)
            .style('font-weight', theme.typography.fontWeight)
            .text(d => formatNumberAbbrev(d.value));
        }
        
        // Add tooltips if interactive
        if (props.interactive && tooltipManager.value) {
          bars
            .on('mouseenter', function(event, d) {
              d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 1);
              
              tooltipManager.value?.show(
                tooltipManager.value.formatContent(d),
                event,
                chartGroup.node()
              );
            })
            .on('mousemove', function(event) {
              tooltipManager.value?.move(event, chartGroup.node());
            })
            .on('mouseleave', function() {
              d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', theme.elements.barOpacity);
              
              tooltipManager.value?.hide();
            })
            .on('click', function(event, d) {
              emit('click', { event, data: d });
            });
        }
      } else {
        // Horizontal bars
        const bars = barGroup
          .selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', 0)
          .attr('y', d => yScale.value(d.label || ''))
          .attr('width', 0)
          .attr('height', yScale.value.bandwidth())
          .attr('fill', d => typeof colorScale.value === 'function' ? colorScale.value(d) : colorScale.value(d.label || ''))
          .attr('opacity', theme.elements.barOpacity);
        
        // Add animation if enabled
        if (props.animate) {
          bars.transition()
            .duration(props.animationDuration)
            .attr('width', d => xScale.value(d.value));
        } else {
          bars
            .attr('width', d => xScale.value(d.value));
        }
        
        // Add labels if enabled
        if (props.enableLabels) {
          const labelGroup = chartGroup
            .append('g')
            .attr('class', 'label-group');
          
          labelGroup
            .selectAll('.bar-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', d => {
              const xPos = xScale.value(d.value);
              return props.labelPosition === 'inside' ? xPos - 8 : xPos + 6;
            })
            .attr('y', d => yScale.value(d.label || '') + yScale.value.bandwidth() / 2)
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', props.labelPosition === 'inside' ? 'end' : 'start')
            .attr('fill', d => props.labelPosition === 'inside' ? '#fff' : theme.axis.labelColor)
            .style('font-size', theme.typography.labelFontSize)
            .style('font-weight', theme.typography.fontWeight)
            .text(d => formatNumberAbbrev(d.value));
        }
        
        // Add tooltips if interactive
        if (props.interactive && tooltipManager.value) {
          bars
            .on('mouseenter', function(event, d) {
              d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 1);
              
              tooltipManager.value?.show(
                tooltipManager.value.formatContent(d),
                event,
                chartGroup.node()
              );
            })
            .on('mousemove', function(event) {
              tooltipManager.value?.move(event, chartGroup.node());
            })
            .on('mouseleave', function() {
              d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', theme.elements.barOpacity);
              
              tooltipManager.value?.hide();
            })
            .on('click', function(event, d) {
              emit('click', { event, data: d });
            });
        }
      }
    };
    
    // Draw multi-series bars
    const drawSeriesBars = (chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>) => {
      if (!props.data.series) return;
      
      const series = sortedData.value as SeriesData[];
      const theme = getTheme(props.theme, props.customTheme);
      
      if (props.grouping === 'grouped') {
        drawGroupedBars(chartGroup, series, theme);
      } else {
        drawStackedBars(chartGroup, series, theme);
      }
    };
    
    // Draw grouped bars
    const drawGroupedBars = (
      chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
      series: SeriesData[],
      theme: ChartTheme
    ) => {
      if (props.orientation === 'vertical') {
        // Vertical grouped bars
        
        // Calculate inner band width for each series
        const innerBandwidth = xScale.value.bandwidth() / series.length;
        
        series.forEach((s, seriesIndex) => {
          const seriesGroup = chartGroup
            .append('g')
            .attr('class', `bar-group series-${seriesIndex}`)
            .attr('transform', `translate(${seriesIndex * innerBandwidth}, 0)`);
          
          // Create bars for this series
          const bars = seriesGroup
            .selectAll('.bar')
            .data(s.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale.value(d.label || ''))
            .attr('y', yScale.value(0))
            .attr('width', innerBandwidth)
            .attr('height', 0)
            .attr('fill', s.color || colorScale.value(s.name))
            .attr('opacity', theme.elements.barOpacity);
          
          // Add animation if enabled
          if (props.animate) {
            bars.transition()
              .duration(props.animationDuration)
              .attr('y', d => yScale.value(d.value))
              .attr('height', d => yScale.value(0) - yScale.value(d.value));
          } else {
            bars
              .attr('y', d => yScale.value(d.value))
              .attr('height', d => yScale.value(0) - yScale.value(d.value));
          }
          
          // Add tooltips if interactive
          if (props.interactive && tooltipManager.value) {
            bars
              .on('mouseenter', function(event, d) {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr('opacity', 1);
                
                tooltipManager.value?.show(
                  tooltipManager.value.formatContent(d, s),
                  event,
                  chartGroup.node()
                );
              })
              .on('mousemove', function(event) {
                tooltipManager.value?.move(event, chartGroup.node());
              })
              .on('mouseleave', function() {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr('opacity', theme.elements.barOpacity);
                
                tooltipManager.value?.hide();
              })
              .on('click', function(event, d) {
                emit('click', { event, data: d, series: s });
              });
          }
        });
      } else {
        // Horizontal grouped bars
        
        // Calculate inner band width for each series
        const innerBandwidth = yScale.value.bandwidth() / series.length;
        
        series.forEach((s, seriesIndex) => {
          const seriesGroup = chartGroup
            .append('g')
            .attr('class', `bar-group series-${seriesIndex}`)
            .attr('transform', `translate(0, ${seriesIndex * innerBandwidth})`);
          
          // Create bars for this series
          const bars = seriesGroup
            .selectAll('.bar')
            .data(s.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', d => yScale.value(d.label || ''))
            .attr('width', 0)
            .attr('height', innerBandwidth)
            .attr('fill', s.color || colorScale.value(s.name))
            .attr('opacity', theme.elements.barOpacity);
          
          // Add animation if enabled
          if (props.animate) {
            bars.transition()
              .duration(props.animationDuration)
              .attr('width', d => xScale.value(d.value));
          } else {
            bars
              .attr('width', d => xScale.value(d.value));
          }
          
          // Add tooltips if interactive
          if (props.interactive && tooltipManager.value) {
            bars
              .on('mouseenter', function(event, d) {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr('opacity', 1);
                
                tooltipManager.value?.show(
                  tooltipManager.value.formatContent(d, s),
                  event,
                  chartGroup.node()
                );
              })
              .on('mousemove', function(event) {
                tooltipManager.value?.move(event, chartGroup.node());
              })
              .on('mouseleave', function() {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr('opacity', theme.elements.barOpacity);
                
                tooltipManager.value?.hide();
              })
              .on('click', function(event, d) {
                emit('click', { event, data: d, series: s });
              });
          }
        });
      }
    };
    
    // Draw stacked bars
    const drawStackedBars = (
      chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
      series: SeriesData[],
      theme: ChartTheme
    ) => {
      if (props.orientation === 'vertical') {
        // Vertical stacked bars
        const firstSeries = series[0];
        if (!firstSeries) return;
        
        const categories = firstSeries.data.map(d => d.label || '');
        
        // Process data for d3.stack
        const stackData: any = {};
        categories.forEach(category => {
          stackData[category] = {};
          series.forEach(s => {
            const point = s.data.find(d => d.label === category);
            stackData[category][s.name] = point ? point.value : 0;
          });
        });
        
        const stackKeys = series.map(s => s.name);
        const stackedData = d3.stack()
          .keys(stackKeys)
          .value((d, key) => d[key] || 0)
          (Object.values(stackData));
        
        // Create bars for each series in the stack
        stackedData.forEach((seriesData, seriesIndex) => {
          const currentSeries = series[seriesIndex];
          const seriesGroup = chartGroup
            .append('g')
            .attr('class', `bar-group series-${seriesIndex}`);
          
          const bars = seriesGroup
            .selectAll('.bar')
            .data(seriesData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => xScale.value(categories[i]))
            .attr('y', d => yScale.value(d[1]))
            .attr('width', xScale.value.bandwidth())
            .attr('height', d => yScale.value(d[0]) - yScale.value(d[1]))
            .attr('fill', currentSeries.color || colorScale.value(currentSeries.name))
            .attr('opacity', theme.elements.barOpacity);
          
          // Add tooltips if interactive
          if (props.interactive && tooltipManager.value) {
            bars
              .on('mouseenter', function(event, d) {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr('opacity', 1);
                
                const category = categories[d.index];
                const value = d[1] - d[0];
                const dataPoint = { label: category, value };
                
                tooltipManager.value?.show(
                  tooltipManager.value.formatContent(dataPoint, currentSeries),
                  event,
                  chartGroup.node()
                );
              })
              .on('mousemove', function(event) {
                tooltipManager.value?.move(event, chartGroup.node());
              })
              .on('mouseleave', function() {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr('opacity', theme.elements.barOpacity);
                
                tooltipManager.value?.hide();
              })
              .on('click', function(event, d) {
                const category = categories[d.index];
                const value = d[1] - d[0];
                const dataPoint = { label: category, value };
                
                emit('click', { event, data: dataPoint, series: currentSeries });
              });
          }
        });
      } else {
        // Horizontal stacked bars
        const firstSeries = series[0];
        if (!firstSeries) return;
        
        const categories = firstSeries.data.map(d => d.label || '');
        
        // Process data for d3.stack
        const stackData: any = {};
        categories.forEach(category => {
          stackData[category] = {};
          series.forEach(s => {
            const point = s.data.find(d => d.label === category);
            stackData[category][s.name] = point ? point.value : 0;
          });
        });
        
        const stackKeys = series.map(s => s.name);
        const stackedData = d3.stack()
          .keys(stackKeys)
          .value((d, key) => d[key] || 0)
          (Object.values(stackData));
        
        // Create bars for each series in the stack
        stackedData.forEach((seriesData, seriesIndex) => {
          const currentSeries = series[seriesIndex];
          const seriesGroup = chartGroup
            .append('g')
            .attr('class', `bar-group series-${seriesIndex}`);
          
          const bars = seriesGroup
            .selectAll('.bar')
            .data(seriesData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale.value(d[0]))
            .attr('y', (d, i) => yScale.value(categories[i]))
            .attr('width', d => xScale.value(d[1]) - xScale.value(d[0]))
            .attr('height', yScale.value.bandwidth())
            .attr('fill', currentSeries.color || colorScale.value(currentSeries.name))
            .attr('opacity', theme.elements.barOpacity);
          
          // Add tooltips if interactive
          if (props.interactive && tooltipManager.value) {
            bars
              .on('mouseenter', function(event, d) {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr('opacity', 1);
                
                const category = categories[d.index];
                const value = d[1] - d[0];
                const dataPoint = { label: category, value };
                
                tooltipManager.value?.show(
                  tooltipManager.value.formatContent(dataPoint, currentSeries),
                  event,
                  chartGroup.node()
                );
              })
              .on('mousemove', function(event) {
                tooltipManager.value?.move(event, chartGroup.node());
              })
              .on('mouseleave', function() {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr('opacity', theme.elements.barOpacity);
                
                tooltipManager.value?.hide();
              })
              .on('click', function(event, d) {
                const category = categories[d.index];
                const value = d[1] - d[0];
                const dataPoint = { label: category, value };
                
                emit('click', { event, data: dataPoint, series: currentSeries });
              });
          }
        });
      }
    };
    
    // Draw the legend
    const drawLegend = (
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      theme: ChartTheme
    ) => {
      if (props.data.series) {
        // Multi-series data
        const series = props.data.series;
        
        // Create legend items
        const legendItems = series.map(s => ({
          label: s.name,
          color: s.color || colorScale.value(s.name)
        }));
        
        // Create legend
        const legend = new LegendBuilder(
          svg,
          theme,
          {
            show: true,
            position: props.legendPosition,
            shape: 'rect'
          }
        );
        
        legend.setItems(legendItems).render();
      }
    };
    
    // Update the sorted data based on sort options
    const updateSortedData = () => {
      if (props.data.series) {
        // Multi-series data
        const series = [...(props.data.series || [])];
        
        if (props.enableSort && props.sortBy === 'value') {
          // For multi-series, we sort by the first series values
          const firstSeries = series[0];
          if (firstSeries) {
            // Sort the data in the first series
            const sortedData = [...firstSeries.data].sort((a, b) => {
              return props.sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
            });
            
            // Get the sorted category order
            const sortedCategories = sortedData.map(d => d.label);
            
            // Reorder each series data according to this sort order
            series.forEach(s => {
              const originalData = [...s.data];
              s.data = sortedCategories.map(category => {
                return originalData.find(d => d.label === category) || 
                  { label: category, value: 0 };
              });
            });
          }
        } else if (props.enableSort && props.sortBy === 'label') {
          // Sort by label
          const firstSeries = series[0];
          if (firstSeries) {
            // Sort by label
            const sortedData = [...firstSeries.data].sort((a, b) => {
              const aLabel = a.label || '';
              const bLabel = b.label || '';
              return props.sortOrder === 'asc' 
                ? aLabel.localeCompare(bLabel) 
                : bLabel.localeCompare(aLabel);
            });
            
            // Get the sorted category order
            const sortedCategories = sortedData.map(d => d.label);
            
            // Reorder each series data according to this sort order
            series.forEach(s => {
              const originalData = [...s.data];
              s.data = sortedCategories.map(category => {
                return originalData.find(d => d.label === category) || 
                  { label: category, value: 0 };
              });
            });
          }
        }
        
        sortedData.value = series;
      } else if (props.data.data) {
        // Single series data
        let data = [...(props.data.data || [])];
        
        if (props.enableSort) {
          if (props.sortBy === 'value') {
            // Sort by value
            data = data.sort((a, b) => {
              return props.sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
            });
          } else if (props.sortBy === 'label') {
            // Sort by label
            data = data.sort((a, b) => {
              const aLabel = a.label || '';
              const bLabel = b.label || '';
              return props.sortOrder === 'asc' 
                ? aLabel.localeCompare(bLabel) 
                : bLabel.localeCompare(aLabel);
            });
          }
        }
        
        sortedData.value = data;
      }
    };
    
    // Clean up on component unmount
    onBeforeUnmount(() => {
      if (tooltipManager.value) {
        tooltipManager.value.destroy();
      }
    });
    
    // Watch for property changes and update chart
    watch([
      () => props.orientation,
      () => props.grouping,
      () => props.barPadding,
      () => props.enableLabels,
      () => props.labelPosition,
      () => props.enableSort,
      () => props.sortBy,
      () => props.sortOrder,
      () => props.showLegend,
      () => props.legendPosition,
      () => props.showTooltip,
      () => props.showGrid,
      () => props.xAxisTitle,
      () => props.yAxisTitle
    ], () => {
      if (baseChart.value) {
        drawChart();
      }
    });
    
    return {
      baseChart,
      generateAccessibleDescription,
      onChartReady
    };
  }
});
</script>