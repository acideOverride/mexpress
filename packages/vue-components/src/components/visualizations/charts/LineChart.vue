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
  name: 'LineChart',
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
    
    // Line chart specific options
    curve: {
      type: String as PropType<'linear' | 'stepAfter' | 'stepBefore' | 'cardinal' | 'catmullRom' | 'monotone'>,
      default: 'linear'
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
    lineWidth: {
      type: Number,
      default: 2
    },
    enableArea: {
      type: Boolean,
      default: false
    },
    areaOpacity: {
      type: Number,
      default: 0.2
    },
    enableCrosshair: {
      type: Boolean,
      default: false
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
      
      const chartType = 'Line chart';
      
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
      chartGroup.selectAll('.line-group').remove();
      chartGroup.selectAll('.area-group').remove();
      chartGroup.selectAll('.point-group').remove();
      chartGroup.selectAll('.axis').remove();
      chartGroup.selectAll('.grid-line').remove();
      if (crosshair.value) crosshair.value.remove();
      
      // Draw axes
      drawAxes(chartGroup, width, height, theme);
      
      // Draw lines and areas
      if (props.data.series) {
        drawMultiSeriesLines(chartGroup);
      } else if (props.data.data) {
        drawSingleSeriesLine(chartGroup);
      }
      
      // Draw crosshair if enabled
      if (props.enableCrosshair && props.interactive) {
        createCrosshair(chartGroup, width, height);
      }
      
      // Draw legend
      if (props.showLegend) {
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
      const yExtent = d3.extent(allPoints, d => d.value) as [number, number];
      // Add slight padding to y scale to prevent lines from hitting edges
      const yPadding = (yExtent[1] - yExtent[0]) * 0.05;
      yScale.value = createContinuousScale(
        [yExtent[0] - yPadding, yExtent[1] + yPadding], 
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
    
    // Draw single series line
    const drawSingleSeriesLine = (chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>) => {
      if (!props.data.data) return;
      
      const data = props.data.data;
      const theme = getTheme(props.theme, props.customTheme);
      const color = typeof colorScale.value === 'string' ? colorScale.value : theme.colors.primary[0];
      
      // Create line generator
      const lineGenerator = d3.line<DataPoint>()
        .x((d, i) => xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i)))
        .y(d => yScale.value(d.value))
        .curve(getCurveFunction());
      
      // If enabling area, create area generator
      if (props.enableArea) {
        const areaGenerator = d3.area<DataPoint>()
          .x((d, i) => xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i)))
          .y0(yScale.value(yScale.value.domain()[0]))
          .y1(d => yScale.value(d.value))
          .curve(getCurveFunction());
        
        // Add area path
        const areaGroup = chartGroup.append('g')
          .attr('class', 'area-group');
        
        areaGroup.append('path')
          .datum(data)
          .attr('class', 'area')
          .attr('fill', color)
          .attr('fill-opacity', 0)
          .attr('d', areaGenerator);
        
        if (props.animate) {
          areaGroup.select('.area')
            .transition()
            .duration(props.animationDuration)
            .attr('fill-opacity', props.areaOpacity);
        } else {
          areaGroup.select('.area')
            .attr('fill-opacity', props.areaOpacity);
        }
      }
      
      // Add line path
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
      
      // Animate the line drawing
      if (props.animate) {
        linePath
          .transition()
          .duration(props.animationDuration)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);
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
                .attr(props.pointShape === 'diamond' ? 'd' : null, d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8 * 1.5));
              
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
                .attr(props.pointShape === 'diamond' ? 'd' : null, d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8));
              
              tooltipManager.value?.hide();
            })
            .on('click', function(event, d) {
              emit('click', { event, data: d });
            });
        }
      }
    };
    
    // Draw multi-series lines
    const drawMultiSeriesLines = (chartGroup: d3.Selection<SVGGElement, unknown, null, undefined>) => {
      if (!props.data.series) return;
      
      const series = props.data.series;
      const theme = getTheme(props.theme, props.customTheme);
      
      // If enabling area, create area generator
      const areaGenerator = d3.area<DataPoint>()
        .x((d, i) => xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i)))
        .y0(yScale.value(yScale.value.domain()[0]))
        .y1(d => yScale.value(d.value))
        .curve(getCurveFunction());
      
      // Create line generator
      const lineGenerator = d3.line<DataPoint>()
        .x((d, i) => xScale.value(d.x !== undefined ? d.x : (props.xScale === 'time' ? new Date(d.label || '') : i)))
        .y(d => yScale.value(d.value))
        .curve(getCurveFunction());
      
      // Add area paths if enabled
      if (props.enableArea) {
        const areaGroup = chartGroup.append('g')
          .attr('class', 'area-group');
        
        series.forEach(s => {
          areaGroup.append('path')
            .datum(s.data)
            .attr('class', `area series-${s.id}`)
            .attr('fill', s.color || colorScale.value(s.name))
            .attr('fill-opacity', 0)
            .attr('d', areaGenerator);
        });
        
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
      
      // Add lines
      const lineGroup = chartGroup.append('g')
        .attr('class', 'line-group');
      
      series.forEach(s => {
        const linePath = lineGroup.append('path')
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
        
        // Animate the line drawing
        if (props.animate) {
          linePath
            .transition()
            .duration(props.animationDuration)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);
        }
      });
      
      // Add points if enabled
      if (props.enablePoints) {
        const pointGroup = chartGroup.append('g')
          .attr('class', 'point-group');
        
        series.forEach(s => {
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
                  .attr(props.pointShape === 'diamond' ? 'd' : null, d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8 * 1.5));
                
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
                  .attr(props.pointShape === 'diamond' ? 'd' : null, d3.symbol().type(d3.symbolDiamond).size(props.pointSize * 8));
                
                tooltipManager.value?.hide();
              })
              .on('click', function(event, d) {
                emit('click', { event, data: d, series: s });
              });
          }
        });
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
      () => props.curve,
      () => props.enablePoints,
      () => props.pointSize,
      () => props.pointShape,
      () => props.lineWidth,
      () => props.enableArea,
      () => props.areaOpacity,
      () => props.enableCrosshair,
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
    });
    
    return {
      baseChart,
      generateAccessibleDescription,
      onChartReady
    };
  }
});
</script>