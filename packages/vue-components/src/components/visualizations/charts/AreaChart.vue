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
import { LineChartConfig, ChartData, DataPoint, SeriesData, ChartTheme } from '@/types';
import { 
  TooltipManager,
  LegendBuilder,
  getTheme,
  createColorScale,
  createContinuousScale,
  createTimeScale,
  createAxis,
  applyThemeToAxis,
  formatNumberAbbrev,
  createAccessibleDescription
} from '../utils';

export default defineComponent({
  name: 'AreaChart',
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
    
    // Area chart specific options
    curve: {
      type: String as PropType<'linear' | 'stepAfter' | 'stepBefore' | 'cardinal' | 'catmullRom' | 'monotone'>,
      default: 'monotone'
    },
    enablePoints: {
      type: Boolean,
      default: true
    },
    pointSize: {
      type: Number,
      default: 4
    },
    pointShape: {
      type: String as PropType<'circle' | 'square' | 'diamond'>,
      default: 'circle'
    },
    showLine: {
      type: Boolean,
      default: true
    },
    lineWidth: {
      type: Number,
      default: 2
    },
    areaOpacity: {
      type: Number,
      default: 0.2
    },
    enableCrosshair: {
      type: Boolean,
      default: false
    },
    areaBlendMode: {
      type: String as PropType<'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten'>,
      default: 'normal'
    },
    stackOffset: {
      type: String as PropType<'none' | 'expand' | 'diverging' | 'silhouette' | 'wiggle'>,
      default: 'none'
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
    xScale: {
      type: String as PropType<'linear' | 'time'>,
      default: 'linear'
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
    const crosshair = ref<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
    
    // Scales
    const xScale = ref<any>(null);
    const yScale = ref<any>(null);
    const colorScale = ref<any>(null);
    
    // Generate an accessible description for screen readers
    const generateAccessibleDescription = () => {
      if (!props.data) return '';
      
      const chartType = 'Area chart';
      
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
      
      // Create scales
      createScales(width, height);
      
      // Clear existing chart elements
      chartGroup.selectAll('.area-group').remove();
      chartGroup.selectAll('.line-group').remove();
      chartGroup.selectAll('.point-group').remove();
      chartGroup.selectAll('.axis').remove();
      chartGroup.selectAll('.grid-line').remove();
      if (crosshair.value) crosshair.value.remove();
      
      // Draw axes
      drawAxes(chartGroup, width, height, theme);
      
      // Draw areas and lines
      if (props.data.series) {
        if (props.stackOffset === 'none') {
          drawMultiSeriesAreas(chartGroup);
        } else {
          drawStackedAreas(chartGroup, width, height);
        }
      } else if (props.data.data) {
        drawSingleSeriesArea(chartGroup);
      }
      
      // Draw crosshair if enabled
      if (props.enableCrosshair && props.interactive) {
        createCrosshair(chartGroup, width, height);
      }
      
      // Draw legend
      if (props.showLegend && props.data.series) {
        drawLegend(svg, theme);
      }
    };
    
    // Create scales for the chart
    const createScales = (width: number, height: number) => {
      // Get data depending on whether it's single or multi series
      let allPoints: DataPoint[] = [];
      
      if (props.data.series) {
        // Multi-series data
        props.data.series.forEach(series => {
          allPoints = [...allPoints, ...series.data];
        });
      } else if (props.data.data) {
        // Single series data
        allPoints = props.data.data;
      }
      
      // X scale
      if (props.xScale === 'time') {
        // Handle time scale (assuming label is ISO date string)
        const timeExtent = d3.extent(allPoints, d => {
          const date = d.label ? new Date(d.label) : null;
          return date && !isNaN(date.getTime()) ? date : null;
        }) as [Date, Date];
        
        if (timeExtent[0] && timeExtent[1]) {
          xScale.value = createTimeScale(timeExtent, [0, width]);
        } else {
          // Fallback to linear if dates are invalid
          const xExtent = d3.extent(allPoints, (d, i) => d.x !== undefined ? d.x : i) as [number, number];
          xScale.value = createContinuousScale(xExtent, [0, width]);
        }
      } else {
        // Linear scale - use x property if available, otherwise use index
        const xExtent = d3.extent(allPoints, (d, i) => d.x !== undefined ? d.x : i) as [number, number];
        xScale.value = createContinuousScale(xExtent, [0, width]);
      }
      
      // Y scale (always numeric)
      let yExtent: [number, number];
      
      if (props.data.series && props.stackOffset !== 'none') {
        // For stacked areas, we need to calculate the sum for each x position
        const stackedExtent = calculateStackedExtent();
        yExtent = stackedExtent;
      } else {
        yExtent = d3.extent(allPoints, d => d.value) as [number, number];
      }
      
      // Make sure y axis starts from 0 for area charts unless using special stack offset
      if (props.stackOffset === 'none' || props.stackOffset === 'expand') {
        yExtent[0] = 0;
      }
      
      // Add slight padding to y scale to prevent areas from hitting top edge
      const yPadding = (yExtent[1] - yExtent[0]) * 0.05;
      yScale.value = createContinuousScale(
        [yExtent[0], yExtent[1] + yPadding], 
        [height, 0]
      );
      
      // Color scale for series
      if (props.data.series) {
        colorScale.value = props.colors.length > 0
          ? d3.scaleOrdinal().domain(props.data.series.map(s => s.name)).range(props.colors)
          : createColorScale(theme, 'categorical');
      } else {
        colorScale.value = props.colors.length > 0
          ? props.colors[0]
          : theme.colors.primary[0];
      }
    };
    
    // Calculate stacked data extent
    const calculateStackedExtent = (): [number, number] => {
      if (!props.data.series) return [0, 0];
      
      const series = props.data.series;
      const stackedData: { [key: string]: number } = {};
      
      // Group by x position (or index if x is not available)
      series.forEach(s => {
        s.data.forEach((d, i) => {
          const key = d.x !== undefined 
            ? d.x.toString() 
            : props.xScale === 'time' && d.label 
              ? d.label 
              : i.toString();
          
          if (!stackedData[key]) {
            stackedData[key] = 0;
          }
          
          stackedData[key] += d.value;
        });
      });
      
      // Get min/max of stacked values
      const stackedValues = Object.values(stackedData);
      if (stackedValues.length === 0) return [0, 0];
      
      const minValue = Math.min(...stackedValues);
      const maxValue = Math.max(...stackedValues);
      
      return [minValue, maxValue];
    };
    
    // Draw axes
    const drawAxes = (
      chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
      width: number,
      height: number,
      theme: ChartTheme
    ) => {
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
    };
    
    // Map curve type to D3 curve function
    const getCurveFunction = () => {
      switch (props.curve) {
        case 'stepAfter':
          return d3.curveStepAfter;
        case 'stepBefore':
          return d3.curveStepBefore;
        case 'cardinal':
          return d3.curveCardinal;
        case 'catmullRom':
          return d3.curveCatmullRom;
        case 'monotone':
          return d3.curveMonotoneX;
        case 'linear':
        default:
          return d3.curveLinear;
      }
    };
    
    // Draw single series area
    const drawSingleSeriesArea = (chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>) => {
      if (!props.data.data) return;
      
      const data = props.data.data;
      const theme = getTheme(props.theme, props.customTheme);
      const color = typeof colorScale.value === 'string' ? colorScale.value : theme.colors.primary[0];
      
      // Create area generator
      const areaGenerator = d3.area<DataPoint>()
        .x((d, i) => xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i)))
        .y0(yScale.value(0))
        .y1(d => yScale.value(d.value))
        .curve(getCurveFunction());
      
      // Create line generator (for top edge)
      const lineGenerator = d3.line<DataPoint>()
        .x((d, i) => xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i)))
        .y(d => yScale.value(d.value))
        .curve(getCurveFunction());
      
      // Add area
      const areaGroup = chartGroup.append('g')
        .attr('class', 'area-group');
      
      const areaPath = areaGroup.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('fill', color)
        .attr('fill-opacity', 0)
        .style('mix-blend-mode', props.areaBlendMode)
        .attr('d', areaGenerator);
      
      // Add line if enabled
      if (props.showLine) {
        const lineGroup = chartGroup.append('g')
          .attr('class', 'line-group');
        
        const linePath = lineGroup.append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', props.lineWidth)
          .attr('stroke-dasharray', function() {
            if (!props.animate) return null;
            const totalLength = (this as SVGPathElement).getTotalLength();
            return `${totalLength} ${totalLength}`;
          })
          .attr('stroke-dashoffset', function() {
            if (!props.animate) return null;
            return (this as SVGPathElement).getTotalLength();
          })
          .attr('d', lineGenerator);
          
        // Animate line and area
        if (props.animate) {
          // Animate the line
          linePath
            .transition()
            .duration(props.animationDuration)
            .attr('stroke-dashoffset', 0);
          
          // Animate the area fill
          areaPath
            .transition()
            .duration(props.animationDuration)
            .attr('fill-opacity', props.areaOpacity);
        } else {
          areaPath.attr('fill-opacity', props.areaOpacity);
        }
      } else {
        // Just animate the area if no line
        if (props.animate) {
          areaPath
            .transition()
            .duration(props.animationDuration)
            .attr('fill-opacity', props.areaOpacity);
        } else {
          areaPath.attr('fill-opacity', props.areaOpacity);
        }
      }
      
      // Add points if enabled
      if (props.enablePoints) {
        const pointGroup = chartGroup.append('g')
          .attr('class', 'point-group');
        
        const points = pointGroup.selectAll('.point')
          .data(data)
          .enter()
          .append('g')
          .attr('class', 'point')
          .attr('transform', (d, i) => {
            const x = xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i));
            const y = yScale.value(d.value);
            return `translate(${x}, ${y})`;
          });
        
        // Add point shapes based on pointShape prop
        if (props.pointShape === 'circle') {
          points.append('circle')
            .attr('r', props.animate ? 0 : props.pointSize)
            .attr('fill', color);
            
          if (props.animate) {
            points.selectAll('circle')
              .transition()
              .delay((d, i) => i * (props.animationDuration / data.length))
              .duration(200)
              .attr('r', props.pointSize);
          }
        } else if (props.pointShape === 'square') {
          points.append('rect')
            .attr('x', -props.pointSize)
            .attr('y', -props.pointSize)
            .attr('width', props.animate ? 0 : props.pointSize * 2)
            .attr('height', props.animate ? 0 : props.pointSize * 2)
            .attr('fill', color);
            
          if (props.animate) {
            points.selectAll('rect')
              .transition()
              .delay((d, i) => i * (props.animationDuration / data.length))
              .duration(200)
              .attr('width', props.pointSize * 2)
              .attr('height', props.pointSize * 2);
          }
        } else if (props.pointShape === 'diamond') {
          points.append('path')
            .attr('d', d3.symbol().type(d3.symbolDiamond).size(props.animate ? 0 : props.pointSize * 8))
            .attr('fill', color);
            
          if (props.animate) {
            points.selectAll('path')
              .transition()
              .delay((d, i) => i * (props.animationDuration / data.length))
              .duration(200)
              .attr('d', d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8));
          }
        }
        
        // Add tooltip and interactivity to points
        if (props.interactive && tooltipManager.value) {
          points
            .on('mouseenter', function(event, d) {
              d3.select(this).raise().select('*')
                .transition()
                .duration(200)
                .attr(props.pointShape === 'circle' ? 'r' : 'width', props.pointSize * 1.5)
                .attr(props.pointShape === 'square' ? 'height' : null, props.pointSize * 1.5 * 2)
                .attr(props.pointShape === 'diamond' ? 'd' : null, 
                  d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8 * 1.5));
              
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
              d3.select(this).select('*')
                .transition()
                .duration(200)
                .attr(props.pointShape === 'circle' ? 'r' : 'width', props.pointSize)
                .attr(props.pointShape === 'square' ? 'height' : null, props.pointSize * 2)
                .attr(props.pointShape === 'diamond' ? 'd' : null, 
                  d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8));
              
              tooltipManager.value?.hide();
            })
            .on('click', function(event, d) {
              emit('click', { event, data: d });
            });
        }
      }
    };
    
    // Draw multi-series areas (unstacked)
    const drawMultiSeriesAreas = (chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>) => {
      if (!props.data.series) return;
      
      const series = props.data.series;
      const theme = getTheme(props.theme, props.customTheme);
      
      // Create area generator
      const areaGenerator = d3.area<DataPoint>()
        .x((d, i) => xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i)))
        .y0(yScale.value(0))
        .y1(d => yScale.value(d.value))
        .curve(getCurveFunction());
      
      // Create line generator
      const lineGenerator = d3.line<DataPoint>()
        .x((d, i) => xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i)))
        .y(d => yScale.value(d.value))
        .curve(getCurveFunction());
      
      // Create area and line elements
      const areaGroup = chartGroup.append('g')
        .attr('class', 'area-group');
      
      // Sort series to draw smaller areas in front
      const sortedSeries = [...series].sort((a, b) => {
        const aMax = d3.max(a.data, d => d.value) || 0;
        const bMax = d3.max(b.data, d => d.value) || 0;
        return bMax - aMax; // Larger areas go first (behind smaller ones)
      });
      
      // Add area paths
      sortedSeries.forEach(s => {
        areaGroup.append('path')
          .datum(s.data)
          .attr('class', `area series-${s.id}`)
          .attr('fill', s.color || colorScale.value(s.name))
          .attr('fill-opacity', 0)
          .style('mix-blend-mode', props.areaBlendMode)
          .attr('d', areaGenerator);
      });
      
      // Add lines if enabled
      if (props.showLine) {
        const lineGroup = chartGroup.append('g')
          .attr('class', 'line-group');
        
        sortedSeries.forEach(s => {
          lineGroup.append('path')
            .datum(s.data)
            .attr('class', `line series-${s.id}`)
            .attr('fill', 'none')
            .attr('stroke', s.color || colorScale.value(s.name))
            .attr('stroke-width', props.lineWidth)
            .attr('stroke-dasharray', function() {
              if (!props.animate) return null;
              const totalLength = (this as SVGPathElement).getTotalLength();
              return `${totalLength} ${totalLength}`;
            })
            .attr('stroke-dashoffset', function() {
              if (!props.animate) return null;
              return (this as SVGPathElement).getTotalLength();
            })
            .attr('d', lineGenerator);
        });
        
        // Animate lines
        if (props.animate) {
          lineGroup.selectAll('.line')
            .transition()
            .duration(props.animationDuration)
            .attr('stroke-dashoffset', 0);
          
          // Animate areas
          areaGroup.selectAll('.area')
            .transition()
            .duration(props.animationDuration)
            .attr('fill-opacity', props.areaOpacity);
        } else {
          areaGroup.selectAll('.area')
            .attr('fill-opacity', props.areaOpacity);
        }
      } else {
        // Just animate areas
        if (props.animate) {
          areaGroup.selectAll('.area')
            .transition()
            .duration(props.animationDuration)
            .attr('fill-opacity', props.areaOpacity);
        } else {
          areaGroup.selectAll('.area')
            .attr('fill-opacity', props.areaOpacity);
        }
      }
      
      // Add points if enabled
      if (props.enablePoints) {
        const pointGroup = chartGroup.append('g')
          .attr('class', 'point-group');
        
        sortedSeries.forEach(s => {
          const color = s.color || colorScale.value(s.name);
          
          const points = pointGroup.selectAll(`.point-series-${s.id}`)
            .data(s.data)
            .enter()
            .append('g')
            .attr('class', `point point-series-${s.id}`)
            .attr('transform', (d, i) => {
              const x = xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i));
              const y = yScale.value(d.value);
              return `translate(${x}, ${y})`;
            });
          
          // Add point shapes based on pointShape prop
          if (props.pointShape === 'circle') {
            points.append('circle')
              .attr('r', props.animate ? 0 : props.pointSize)
              .attr('fill', color);
              
            if (props.animate) {
              points.selectAll('circle')
                .transition()
                .delay((d, i) => i * (props.animationDuration / s.data.length))
                .duration(200)
                .attr('r', props.pointSize);
            }
          } else if (props.pointShape === 'square') {
            points.append('rect')
              .attr('x', -props.pointSize)
              .attr('y', -props.pointSize)
              .attr('width', props.animate ? 0 : props.pointSize * 2)
              .attr('height', props.animate ? 0 : props.pointSize * 2)
              .attr('fill', color);
              
            if (props.animate) {
              points.selectAll('rect')
                .transition()
                .delay((d, i) => i * (props.animationDuration / s.data.length))
                .duration(200)
                .attr('width', props.pointSize * 2)
                .attr('height', props.pointSize * 2);
            }
          } else if (props.pointShape === 'diamond') {
            points.append('path')
              .attr('d', d3.symbol().type(d3.symbolDiamond).size(props.animate ? 0 : props.pointSize * 8))
              .attr('fill', color);
              
            if (props.animate) {
              points.selectAll('path')
                .transition()
                .delay((d, i) => i * (props.animationDuration / s.data.length))
                .duration(200)
                .attr('d', d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8));
            }
          }
          
          // Add tooltip and interactivity to points
          if (props.interactive && tooltipManager.value) {
            points
              .on('mouseenter', function(event, d) {
                d3.select(this).raise().select('*')
                  .transition()
                  .duration(200)
                  .attr(props.pointShape === 'circle' ? 'r' : 'width', props.pointSize * 1.5)
                  .attr(props.pointShape === 'square' ? 'height' : null, props.pointSize * 1.5 * 2)
                  .attr(props.pointShape === 'diamond' ? 'd' : null, 
                    d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8 * 1.5));
                
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
                d3.select(this).select('*')
                  .transition()
                  .duration(200)
                  .attr(props.pointShape === 'circle' ? 'r' : 'width', props.pointSize)
                  .attr(props.pointShape === 'square' ? 'height' : null, props.pointSize * 2)
                  .attr(props.pointShape === 'diamond' ? 'd' : null, 
                    d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8));
                
                tooltipManager.value?.hide();
              })
              .on('click', function(event, d) {
                emit('click', { event, data: d, series: s });
              });
          }
        });
      }
    };
    
    // Draw stacked areas
    const drawStackedAreas = (
      chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
      width: number,
      height: number
    ) => {
      if (!props.data.series) return;
      
      const series = props.data.series;
      const theme = getTheme(props.theme, props.customTheme);
      
      // Prepare data for d3.stack
      // First, we need a unified set of x values across all series
      const allXValues = new Set<string | number>();
      series.forEach(s => {
        s.data.forEach((d, i) => {
          const xVal = d.x !== undefined ? d.x : (props.xScale === 'time' && d.label ? d.label : i);
          allXValues.add(xVal);
        });
      });
      
      // Sort x values for proper ordering
      const sortedXValues = Array.from(allXValues).sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
          return a - b;
        }
        return String(a).localeCompare(String(b));
      });
      
      // Create an array of data points for each x value
      const stackedData: { [key: string]: { [key: string]: number } } = {};
      
      sortedXValues.forEach(x => {
        stackedData[String(x)] = {
          x: x
        };
        
        series.forEach(s => {
          // Find the data point with this x value
          const found = s.data.find((d, i) => {
            const dX = d.x !== undefined ? d.x : (props.xScale === 'time' && d.label ? d.label : i);
            return dX === x;
          });
          
          // Add the series value, or 0 if not found
          stackedData[String(x)][s.name] = found ? found.value : 0;
        });
      });
      
      // Convert to array format for d3.stack
      const stackData = Object.values(stackedData);
      
      // Get series names for stack keys
      const keys = series.map(s => s.name);
      
      // Create stack generator with appropriate offset
      const stackGenerator = d3.stack<any>()
        .keys(keys)
        .offset(getStackOffset());
      
      // Generate stacked data
      const stackedSeries = stackGenerator(stackData);
      
      // Create area generator
      const areaGenerator = d3.area<d3.SeriesPoint<any>>()
        .x(d => {
          const dataObj = stackData[d.index];
          const xVal = dataObj.x;
          
          if (props.xScale === 'time' && typeof xVal === 'string') {
            return xScale.value(new Date(xVal));
          }
          
          return xScale.value(xVal);
        })
        .y0(d => yScale.value(d[0]))
        .y1(d => yScale.value(d[1]))
        .curve(getCurveFunction());
      
      // Create line generator for the top edge (if showing lines)
      const lineGenerator = d3.line<d3.SeriesPoint<any>>()
        .x(d => {
          const dataObj = stackData[d.index];
          const xVal = dataObj.x;
          
          if (props.xScale === 'time' && typeof xVal === 'string') {
            return xScale.value(new Date(xVal));
          }
          
          return xScale.value(xVal);
        })
        .y(d => yScale.value(d[1])) // Only the top edge
        .curve(getCurveFunction());
      
      // Draw areas
      const areaGroup = chartGroup.append('g')
        .attr('class', 'area-group');
      
      stackedSeries.forEach((d, i) => {
        const currentSeries = series[i];
        
        areaGroup.append('path')
          .datum(d)
          .attr('class', `area series-${currentSeries.id}`)
          .attr('fill', currentSeries.color || colorScale.value(currentSeries.name))
          .attr('fill-opacity', 0)
          .style('mix-blend-mode', props.areaBlendMode)
          .attr('d', areaGenerator);
      });
      
      // Draw lines if enabled
      if (props.showLine) {
        const lineGroup = chartGroup.append('g')
          .attr('class', 'line-group');
        
        stackedSeries.forEach((d, i) => {
          const currentSeries = series[i];
          
          lineGroup.append('path')
            .datum(d)
            .attr('class', `line series-${currentSeries.id}`)
            .attr('fill', 'none')
            .attr('stroke', currentSeries.color || colorScale.value(currentSeries.name))
            .attr('stroke-width', props.lineWidth)
            .attr('stroke-dasharray', function() {
              if (!props.animate) return null;
              const totalLength = (this as SVGPathElement).getTotalLength();
              return `${totalLength} ${totalLength}`;
            })
            .attr('stroke-dashoffset', function() {
              if (!props.animate) return null;
              return (this as SVGPathElement).getTotalLength();
            })
            .attr('d', lineGenerator);
        });
      }
      
      // Add animation
      if (props.animate) {
        if (props.showLine) {
          // Animate lines
          chartGroup.selectAll('.line')
            .transition()
            .duration(props.animationDuration)
            .attr('stroke-dashoffset', 0);
        }
        
        // Animate areas
        chartGroup.selectAll('.area')
          .transition()
          .duration(props.animationDuration)
          .attr('fill-opacity', props.areaOpacity);
      } else {
        chartGroup.selectAll('.area')
          .attr('fill-opacity', props.areaOpacity);
      }
      
      // Add points if enabled
      if (props.enablePoints) {
        const pointGroup = chartGroup.append('g')
          .attr('class', 'point-group');
        
        stackedSeries.forEach((seriesData, seriesIndex) => {
          const currentSeries = series[seriesIndex];
          const color = currentSeries.color || colorScale.value(currentSeries.name);
          
          seriesData.forEach((d, i) => {
            if (d[0] === d[1]) return; // Skip points with zero height
            
            const dataObj = stackData[i];
            const xVal = dataObj.x;
            let xPos;
            
            if (props.xScale === 'time' && typeof xVal === 'string') {
              xPos = xScale.value(new Date(xVal));
            } else {
              xPos = xScale.value(xVal);
            }
            
            const yPos = yScale.value(d[1]); // Top edge
            
            const point = pointGroup.append('g')
              .attr('class', `point point-series-${currentSeries.id}`)
              .attr('transform', `translate(${xPos}, ${yPos})`)
              .datum(() => {
                // Create a datum for tooltip
                return {
                  x: xVal,
                  label: typeof xVal === 'string' ? xVal : '',
                  value: d[1] - d[0], // The height of this segment
                  total: d[1], // The cumulative value (for normalized or stacked displays)
                  stackIndex: seriesIndex,
                  series: currentSeries
                };
              });
            
            // Add appropriate shape
            if (props.pointShape === 'circle') {
              point.append('circle')
                .attr('r', props.animate ? 0 : props.pointSize)
                .attr('fill', color);
                
              if (props.animate) {
                point.select('circle')
                  .transition()
                  .delay(seriesIndex * 100 + i * (props.animationDuration / stackData.length))
                  .duration(200)
                  .attr('r', props.pointSize);
              }
            } else if (props.pointShape === 'square') {
              point.append('rect')
                .attr('x', -props.pointSize)
                .attr('y', -props.pointSize)
                .attr('width', props.animate ? 0 : props.pointSize * 2)
                .attr('height', props.animate ? 0 : props.pointSize * 2)
                .attr('fill', color);
                
              if (props.animate) {
                point.select('rect')
                  .transition()
                  .delay(seriesIndex * 100 + i * (props.animationDuration / stackData.length))
                  .duration(200)
                  .attr('width', props.pointSize * 2)
                  .attr('height', props.pointSize * 2);
              }
            } else if (props.pointShape === 'diamond') {
              point.append('path')
                .attr('d', d3.symbol().type(d3.symbolDiamond).size(props.animate ? 0 : props.pointSize * 8))
                .attr('fill', color);
                
              if (props.animate) {
                point.select('path')
                  .transition()
                  .delay(seriesIndex * 100 + i * (props.animationDuration / stackData.length))
                  .duration(200)
                  .attr('d', d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8));
              }
            }
            
            // Add interactivity
            if (props.interactive && tooltipManager.value) {
              point
                .on('mouseenter', function(event, d: any) {
                  d3.select(this).raise().select('*')
                    .transition()
                    .duration(200)
                    .attr(props.pointShape === 'circle' ? 'r' : 'width', props.pointSize * 1.5)
                    .attr(props.pointShape === 'square' ? 'height' : null, props.pointSize * 1.5 * 2)
                    .attr(props.pointShape === 'diamond' ? 'd' : null, 
                      d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8 * 1.5));
                  
                  tooltipManager.value?.show(
                    tooltipManager.value.formatContent(
                      { 
                        label: d.label,
                        value: d.value
                      },
                      d.series
                    ),
                    event,
                    chartGroup.node()
                  );
                })
                .on('mousemove', function(event) {
                  tooltipManager.value?.move(event, chartGroup.node());
                })
                .on('mouseleave', function() {
                  d3.select(this).select('*')
                    .transition()
                    .duration(200)
                    .attr(props.pointShape === 'circle' ? 'r' : 'width', props.pointSize)
                    .attr(props.pointShape === 'square' ? 'height' : null, props.pointSize * 2)
                    .attr(props.pointShape === 'diamond' ? 'd' : null, 
                      d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8));
                  
                  tooltipManager.value?.hide();
                })
                .on('click', function(event, d: any) {
                  emit('click', { 
                    event, 
                    data: { 
                      label: d.label,
                      value: d.value
                    }, 
                    series: d.series 
                  });
                });
            }
          });
        });
      }
    };
    
    // Get the appropriate d3 stack offset function
    const getStackOffset = () => {
      switch (props.stackOffset) {
        case 'expand':
          return d3.stackOffsetExpand; // Normalized to show percentages (0-100%)
        case 'diverging':
          return d3.stackOffsetDiverging; // Negative values below axis, positive above
        case 'silhouette':
          return d3.stackOffsetSilhouette; // Stream graph centered around y=0
        case 'wiggle':
          return d3.stackOffsetWiggle; // Stream graph minimizing wiggle
        default:
          return d3.stackOffsetNone; // Regular stacking
      }
    };
    
    // Create crosshair for better data exploration
    const createCrosshair = (
      chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
      width: number,
      height: number
    ) => {
      const theme = getTheme(props.theme, props.customTheme);
      
      crosshair.value = chartGroup.append('g')
        .attr('class', 'crosshair')
        .style('display', 'none');
      
      // Vertical line
      crosshair.value.append('line')
        .attr('class', 'crosshair-vertical')
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', theme.axis.tickColor)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5');
      
      // Horizontal line  
      crosshair.value.append('line')
        .attr('class', 'crosshair-horizontal')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('stroke', theme.axis.tickColor)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5');
      
      // Create overlay to detect mouse movement
      chartGroup.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseenter', () => {
          if (crosshair.value) crosshair.value.style('display', null);
        })
        .on('mousemove', (event) => {
          if (!crosshair.value) return;
          
          const [x, y] = d3.pointer(event);
          
          crosshair.value.select('.crosshair-vertical')
            .attr('x1', x)
            .attr('x2', x);
          
          crosshair.value.select('.crosshair-horizontal')
            .attr('y1', y)
            .attr('y2', y);
          
          // Find closest data point for tooltip
          if (props.data.series && tooltipManager.value) {
            let closestPoint: { point: DataPoint, series: SeriesData, distance: number } | null = null;
            
            props.data.series.forEach(s => {
              s.data.forEach((d, i) => {
                const px = xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i));
                const py = yScale.value(d.value);
                const distance = Math.sqrt(Math.pow(px - x, 2) + Math.pow(py - y, 2));
                
                if (!closestPoint || distance < closestPoint.distance) {
                  closestPoint = { point: d, series: s, distance };
                }
              });
            });
            
            if (closestPoint && closestPoint.distance < 50) {
              // Show tooltip for closest point
              tooltipManager.value.show(
                tooltipManager.value.formatContent(closestPoint.point, closestPoint.series),
                event,
                chartGroup.node()
              );
            } else {
              tooltipManager.value.hide();
            }
          } else if (props.data.data && tooltipManager.value) {
            // Single series data
            let closestPoint: { point: DataPoint, distance: number } | null = null;
            
            props.data.data.forEach((d, i) => {
              const px = xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i));
              const py = yScale.value(d.value);
              const distance = Math.sqrt(Math.pow(px - x, 2) + Math.pow(py - y, 2));
              
              if (!closestPoint || distance < closestPoint.distance) {
                closestPoint = { point: d, distance };
              }
            });
            
            if (closestPoint && closestPoint.distance < 50) {
              // Show tooltip for closest point
              tooltipManager.value.show(
                tooltipManager.value.formatContent(closestPoint.point),
                event,
                chartGroup.node()
              );
            } else {
              tooltipManager.value.hide();
            }
          }
        })
        .on('mouseleave', () => {
          if (crosshair.value) crosshair.value.style('display', 'none');
          if (tooltipManager.value) tooltipManager.value.hide();
        });
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
            shape: 'line'
          }
        );
        
        legend.setItems(legendItems).render();
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
      () => props.data,
      () => props.curve,
      () => props.enablePoints,
      () => props.pointSize,
      () => props.pointShape,
      () => props.showLine,
      () => props.lineWidth,
      () => props.areaOpacity,
      () => props.enableCrosshair,
      () => props.areaBlendMode,
      () => props.stackOffset,
      () => props.showLegend,
      () => props.legendPosition,
      () => props.showTooltip,
      () => props.showGrid,
      () => props.xAxisTitle,
      () => props.yAxisTitle,
      () => props.xScale
    ], () => {
      if (baseChart.value) {
        drawChart();
      }
    }, { deep: true });
    
    return {
      baseChart,
      generateAccessibleDescription,
      onChartReady
    };
  }
});
</script>