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
import { defineComponent, ref, computed, PropType, onBeforeUnmount, watch } from 'vue';
import * as d3 from 'd3';
import BaseChart from './BaseChart.vue';
import { PieChartConfig, ChartData, DataPoint, ChartTheme } from '@/types';
import { 
  TooltipManager,
  LegendBuilder,
  getTheme,
  createColorScale,
  formatNumberAbbrev,
  formatPercent,
  createAccessibleDescription
} from '../utils';

export default defineComponent({
  name: 'PieChart',
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
      default: 1 // Default to 1:1 for circular charts
    },
    margin: {
      type: Object as PropType<{ top: number; right: number; bottom: number; left: number }>,
      default: () => ({ top: 30, right: 30, bottom: 30, left: 30 })
    },
    minWidth: {
      type: Number,
      default: 200
    },
    minHeight: {
      type: Number,
      default: 200
    },
    
    // Pie chart specific options
    innerRadius: {
      type: [Number, String],
      default: 0 // 0 for pie, > 0 for donut
    },
    padAngle: {
      type: Number,
      default: 0
    },
    cornerRadius: {
      type: Number,
      default: 0
    },
    startAngle: {
      type: Number,
      default: 0
    },
    endAngle: {
      type: Number,
      default: Math.PI * 2 // Full circle
    },
    enableLabels: {
      type: Boolean,
      default: true
    },
    labelType: {
      type: String as PropType<'value' | 'percent' | 'name' | 'key'>,
      default: 'percent'
    },
    labelPosition: {
      type: String as PropType<'inside' | 'outside'>,
      default: 'outside'
    },
    labelOffset: {
      type: Number,
      default: 20 // for outside labels
    },
    sortData: {
      type: Boolean,
      default: true
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
    
    // Legend
    showLegend: {
      type: Boolean,
      default: true
    },
    legendPosition: {
      type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
      default: 'right'
    },
    
    // Tooltip
    showTooltip: {
      type: Boolean,
      default: true
    },
    tooltipFormat: {
      type: Function as PropType<(point: DataPoint) => string>,
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
    },
    activeSegment: {
      type: [String, Number],
      default: null
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
    const sortedData = ref<DataPoint[]>([]);
    
    // Generate an accessible description for screen readers
    const generateAccessibleDescription = () => {
      if (!props.data || !props.data.data) return '';
      
      const chartType = props.innerRadius ? 'Donut chart' : 'Pie chart';
      
      const samplePoints = props.data.data.slice(0, 5).map(d => ({
        name: d.label || '',
        value: d.value
      }));
      
      return createAccessibleDescription(chartType, props.title, samplePoints);
    };
    
    // Calculate total for percentage calculations
    const total = computed(() => {
      if (!props.data || !props.data.data) return 0;
      return d3.sum(props.data.data, d => d.value);
    });
    
    // Handle chart ready event
    const onChartReady = (chartInfo: any) => {
      // Initialize tooltip
      tooltipManager.value = new TooltipManager({
        show: props.showTooltip,
        format: props.tooltipFormat || ((point: DataPoint) => {
          const percentage = total.value ? (point.value / total.value * 100).toFixed(1) : '0';
          return `<strong>${point.label || ''}</strong><br>${formatNumberAbbrev(point.value)} (${percentage}%)`;
        })
      });
      
      // Sort data if enabled
      updateSortedData();
      
      // Draw initial chart
      drawChart();
    };
    
    // Sort data based on sort options
    const updateSortedData = () => {
      if (!props.data || !props.data.data) {
        sortedData.value = [];
        return;
      }
      
      const data = [...props.data.data];
      
      if (props.sortData) {
        data.sort((a, b) => {
          return props.sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
        });
      }
      
      sortedData.value = data;
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
      const { width, height } = dimensions;
      
      // Get theme
      const theme = getTheme(props.theme, props.customTheme);
      
      // Clear existing chart elements
      chartGroup.selectAll('.pie-group').remove();
      chartGroup.selectAll('.label-group').remove();
      
      // Create color scale
      const colorScale = props.colors.length > 0
        ? d3.scaleOrdinal<string>().domain(sortedData.value.map(d => d.label || '')).range(props.colors)
        : createColorScale(theme, 'categorical');
      
      // Calculate radius
      const radius = Math.min(width, height) / 2;
      
      // Create pie generator
      const pie = d3.pie<DataPoint>()
        .value(d => d.value)
        .sort(null) // Don't re-sort, we've already sorted in updateSortedData
        .startAngle(props.startAngle)
        .endAngle(props.endAngle)
        .padAngle(props.padAngle);
      
      // Generate arc data
      const pieData = pie(sortedData.value);
      
      // Calculate inner radius
      const innerRadius = typeof props.innerRadius === 'number'
        ? props.innerRadius
        : typeof props.innerRadius === 'string' && props.innerRadius.endsWith('%')
          ? radius * (parseInt(props.innerRadius) / 100)
          : 0;
      
      // Create arc generator
      const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .cornerRadius(props.cornerRadius);
      
      // Create larger arc for outside label positioning
      const outerArc = d3.arc<d3.PieArcDatum<DataPoint>>()
        .innerRadius(radius + 10)
        .outerRadius(radius + 10);
      
      // Create group for pie segments
      const pieGroup = chartGroup.append('g')
        .attr('class', 'pie-group')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
      
      // Draw arcs
      const arcs = pieGroup.selectAll('.arc')
        .data(pieData)
        .enter()
        .append('path')
        .attr('class', 'arc')
        .attr('fill', d => d.data.color || colorScale(d.data.label || ''))
        .attr('stroke', theme.backgrounds.chart)
        .attr('stroke-width', 1)
        .style('opacity', d => 
          props.activeSegment !== null && d.data.id !== props.activeSegment && d.data.label !== props.activeSegment
            ? theme.elements.inactiveOpacity
            : theme.elements.barOpacity
        )
        .each(function(d) {
          // Store original angles for animation
          (d as any)._current = d;
        });
      
      // Add animation if enabled
      if (props.animate) {
        arcs
          .attr('d', function(d) {
            const startArc = {
              ...d,
              startAngle: d.startAngle,
              endAngle: d.startAngle
            };
            return arc(startArc);
          })
          .transition()
          .duration(props.animationDuration)
          .attrTween('d', function(d) {
            const interpolate = d3.interpolate(
              { startAngle: d.startAngle, endAngle: d.startAngle },
              { startAngle: d.startAngle, endAngle: d.endAngle }
            );
            return function(t) {
              return arc(interpolate(t) as any);
            };
          });
      } else {
        arcs.attr('d', arc);
      }
      
      // Add labels if enabled
      if (props.enableLabels) {
        const labelGroup = chartGroup.append('g')
          .attr('class', 'label-group')
          .attr('transform', `translate(${width / 2}, ${height / 2})`);
        
        if (props.labelPosition === 'inside') {
          // Inside labels
          const labels = labelGroup.selectAll('.label')
            .data(pieData)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .style('fill', d => {
              const color = d.data.color || colorScale(d.data.label || '');
              const luminance = d3.lab(color).l;
              return luminance > 50 ? '#333333' : '#ffffff';
            })
            .style('font-size', theme.typography.labelFontSize)
            .style('pointer-events', 'none')
            .style('opacity', 0);
          
          // Format labels based on label type
          labels.text(d => {
            switch (props.labelType) {
              case 'value':
                return formatNumberAbbrev(d.data.value);
              case 'percent':
                return total.value ? formatPercent(d.data.value / total.value) : '0%';
              case 'name':
              case 'key':
                return d.data.label || '';
              default:
                return '';
            }
          });
          
          if (props.animate) {
            labels
              .transition()
              .delay(props.animationDuration * 0.5)
              .duration(props.animationDuration * 0.5)
              .style('opacity', 1);
          } else {
            labels.style('opacity', 1);
          }
        } else {
          // Outside labels with connecting lines
          const labels = labelGroup.selectAll('.label')
            .data(pieData)
            .enter()
            .append('g')
            .attr('class', 'label')
            .style('opacity', 0);
          
          // Add connecting lines
          labels.append('polyline')
            .attr('points', d => {
              const pos = outerArc.centroid(d);
              const midAngle = (d.startAngle + d.endAngle) / 2;
              pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
              return [arc.centroid(d), outerArc.centroid(d), pos];
            })
            .style('fill', 'none')
            .style('stroke', theme.axis.strokeColor)
            .style('stroke-width', 1);
          
          // Add the text labels
          labels.append('text')
            .attr('transform', d => {
              const pos = outerArc.centroid(d);
              const midAngle = (d.startAngle + d.endAngle) / 2;
              pos[0] = radius * 1.05 * (midAngle < Math.PI ? 1 : -1);
              return `translate(${pos})`;
            })
            .attr('dy', '0.35em')
            .attr('text-anchor', d => {
              const midAngle = (d.startAngle + d.endAngle) / 2;
              return midAngle < Math.PI ? 'start' : 'end';
            })
            .style('fill', theme.axis.labelColor)
            .style('font-size', theme.typography.labelFontSize)
            .text(d => {
              switch (props.labelType) {
                case 'value':
                  return formatNumberAbbrev(d.data.value);
                case 'percent':
                  return total.value ? formatPercent(d.data.value / total.value) : '0%';
                case 'name':
                case 'key':
                  return d.data.label || '';
                default:
                  return '';
              }
            });
          
          if (props.animate) {
            labels
              .transition()
              .delay(props.animationDuration * 0.5)
              .duration(props.animationDuration * 0.5)
              .style('opacity', 1);
          } else {
            labels.style('opacity', 1);
          }
        }
      }
      
      // Add interactivity
      if (props.interactive) {
        arcs
          .on('mouseenter', function(event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('transform', function() {
                const centroid = arc.centroid(d);
                const x = centroid[0] * 0.1;
                const y = centroid[1] * 0.1;
                return `translate(${x},${y})`;
              })
              .style('opacity', 1);
            
            tooltipManager.value?.show(
              tooltipManager.value.formatContent(d.data),
              event,
              chartGroup.node()
            );
            
            emit('hover', { event, data: d.data });
            emit('mouseenter', { event, data: d.data });
          })
          .on('mousemove', function(event) {
            tooltipManager.value?.move(event, chartGroup.node());
          })
          .on('mouseleave', function(event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('transform', 'translate(0,0)')
              .style('opacity', props.activeSegment !== null && 
                     d.data.id !== props.activeSegment && 
                     d.data.label !== props.activeSegment
                ? theme.elements.inactiveOpacity
                : theme.elements.barOpacity
              );
            
            tooltipManager.value?.hide();
            
            emit('mouseleave', { event, data: d.data });
          })
          .on('click', function(event, d) {
            emit('click', { event, data: d.data });
            emit('selection-change', d.data);
          });
      }
      
      // Draw legend if enabled
      if (props.showLegend) {
        const legendItems = sortedData.value.map(d => ({
          label: d.label || '',
          color: d.color || colorScale(d.label || '')
        }));
        
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
    
    // Update chart when props change
    watch([
      () => props.data,
      () => props.innerRadius,
      () => props.padAngle,
      () => props.cornerRadius,
      () => props.startAngle,
      () => props.endAngle,
      () => props.enableLabels,
      () => props.labelType,
      () => props.labelPosition,
      () => props.sortData,
      () => props.sortOrder,
      () => props.showLegend,
      () => props.legendPosition,
      () => props.activeSegment
    ], () => {
      updateSortedData();
      if (baseChart.value) {
        drawChart();
      }
    }, { deep: true });
    
    // Clean up on unmount
    onBeforeUnmount(() => {
      if (tooltipManager.value) {
        tooltipManager.value.destroy();
      }
    });
    
    return {
      baseChart,
      sortedData,
      total,
      generateAccessibleDescription,
      onChartReady
    };
  }
});
</script>