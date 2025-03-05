<template>
  <div 
    ref="chartContainer"
    class="m-chart"
    :style="{ 
      width: containerWidth, 
      height: containerHeight 
    }"
    :aria-labelledby="titleId"
    :aria-describedby="descriptionId"
    role="img"
  >
    <!-- Chart title section -->
    <div v-if="title || subtitle" class="m-chart-header">
      <h3 v-if="title" :id="titleId" class="m-chart-title">{{ title }}</h3>
      <p v-if="subtitle" class="m-chart-subtitle">{{ subtitle }}</p>
    </div>
    
    <!-- Chart rendering container -->
    <div ref="renderContainer" class="m-chart-content"></div>
    
    <!-- Accessible description (for screen readers) -->
    <div :id="descriptionId" class="sr-only">{{ accessibleDescription }}</div>
    
    <!-- Responsive resizer -->
    <div ref="resizeDetector" class="m-chart-resize-detector"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, PropType, watch, computed } from 'vue';
import * as d3 from 'd3';
import { BaseChartConfig, ChartSize, ChartData, ChartTheme, ChartEventHandlers } from '@/types';
import { getTheme, lightTheme, darkTheme, createSvg, 
         addResizeListener, uniqueId, applyThemeToSvg } from '../utils';

export default defineComponent({
  name: 'BaseChart',
  props: {
    // Chart data
    data: {
      type: Object as PropType<ChartData>,
      required: true
    },
    
    // Chart config
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
      default: 0 // 0 means not used
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
    'selection-change',
    'ready'
  ],
  
  setup(props, { emit, expose }) {
    // References to DOM elements
    const chartContainer = ref<HTMLElement | null>(null);
    const renderContainer = ref<HTMLElement | null>(null);
    const resizeDetector = ref<HTMLElement | null>(null);
    
    // SVG elements
    const svg = ref<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);
    const chartGroup = ref<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
    
    // Accessibility IDs
    const titleId = uniqueId('chart-title');
    const descriptionId = uniqueId('chart-desc');
    
    // Chart dimensions
    const containerWidth = computed(() => {
      if (typeof props.width === 'number') return `${props.width}px`;
      return props.width;
    });
    
    const containerHeight = computed(() => {
      if (typeof props.height === 'number') return `${props.height}px`;
      return props.height;
    });
    
    const chartWidth = ref(0);
    const chartHeight = ref(0);
    const innerWidth = ref(0);
    const innerHeight = ref(0);
    
    // Current theme
    const currentTheme = computed(() => {
      return getTheme(props.theme, props.customTheme);
    });
    
    // Initialize the chart
    const initializeChart = () => {
      if (!renderContainer.value) return;
      
      // Clear previous chart if any
      d3.select(renderContainer.value).selectAll('*').remove();
      
      // Get container dimensions
      updateDimensions();
      
      // Create SVG
      const { svg: newSvg, g, width, height } = createSvg(
        renderContainer.value,
        chartWidth.value,
        chartHeight.value,
        props.margin
      );
      
      // Store references
      svg.value = newSvg;
      chartGroup.value = g;
      innerWidth.value = width - props.margin.left - props.margin.right;
      innerHeight.value = height - props.margin.top - props.margin.bottom;
      
      // Apply theme to SVG
      applyThemeToSvg(newSvg, currentTheme.value);
      
      // Emit ready event
      emit('ready', {
        svg: svg.value,
        chartGroup: chartGroup.value,
        width: innerWidth.value,
        height: innerHeight.value
      });
    };
    
    // Update chart dimensions based on container size
    const updateDimensions = () => {
      if (!renderContainer.value) return;
      
      const containerRect = renderContainer.value.getBoundingClientRect();
      
      // Get current width and height
      let width = Math.max(props.minWidth, containerRect.width);
      let height: number;
      
      if (props.aspectRatio > 0) {
        // If aspect ratio is specified, calculate height based on width
        height = width / props.aspectRatio;
      } else {
        // Otherwise use specified height or container height
        height = typeof props.height === 'number'
          ? props.height
          : Math.max(props.minHeight, containerRect.height);
      }
      
      chartWidth.value = width;
      chartHeight.value = height;
    };
    
    // Handle resize events
    const handleResize = () => {
      if (!renderContainer.value || !svg.value) return;
      
      updateDimensions();
      
      // Update SVG dimensions
      svg.value
        .attr('width', chartWidth.value)
        .attr('height', chartHeight.value)
        .attr('viewBox', `0 0 ${chartWidth.value} ${chartHeight.value}`);
      
      // Update chart content
      redrawChart();
    };
    
    // Redraw the chart (to be implemented by extending components)
    const redrawChart = () => {
      // This method is meant to be overridden by child components
      // It should handle redrawing the chart with current dimensions
    };
    
    // Set up resize detection
    onMounted(() => {
      // Initialize chart
      initializeChart();
      
      // Add resize listener
      const removeResizeListener = addResizeListener(handleResize);
      
      // Clean up on unmount
      onBeforeUnmount(() => {
        removeResizeListener();
      });
    });
    
    // Watch for theme changes
    watch(() => props.theme, (newTheme) => {
      if (svg.value) {
        applyThemeToSvg(svg.value, currentTheme.value);
      }
      redrawChart();
    });
    
    // Watch for data changes
    watch(() => props.data, (newData, oldData) => {
      redrawChart();
    }, { deep: true });
    
    // Watch for margin changes
    watch(() => props.margin, (newMargin) => {
      if (chartGroup.value) {
        chartGroup.value.attr('transform', `translate(${newMargin.left},${newMargin.top})`);
      }
      redrawChart();
    }, { deep: true });
    
    // Watch for size changes
    watch([() => props.width, () => props.height, () => props.aspectRatio], () => {
      handleResize();
    });
    
    // Expose useful methods to parent components
    expose({
      initializeChart,
      redrawChart,
      svg: () => svg.value,
      chartGroup: () => chartGroup.value,
      dimensions: () => ({
        width: innerWidth.value,
        height: innerHeight.value,
        margin: props.margin
      })
    });
    
    return {
      chartContainer,
      renderContainer,
      resizeDetector,
      svg,
      chartGroup,
      titleId,
      descriptionId,
      containerWidth,
      containerHeight,
      innerWidth,
      innerHeight,
      currentTheme
    };
  }
});
</script>

<style scoped>
.m-chart {
  position: relative;
  overflow: hidden;
}

.m-chart-header {
  margin-bottom: 0.5rem;
}

.m-chart-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.m-chart-subtitle {
  font-size: 0.875rem;
  font-weight: 400;
  margin: 0;
  opacity: 0.8;
}

.m-chart-content {
  width: 100%;
  height: calc(100% - 2rem);
}

.m-chart-resize-detector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>