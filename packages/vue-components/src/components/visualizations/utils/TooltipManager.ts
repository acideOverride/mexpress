import * as d3 from 'd3';
import { TooltipOptions, DataPoint, SeriesData } from '@/types';

// Default tooltip configuration
const defaultTooltipOptions: TooltipOptions = {
  show: true,
  format: (point: DataPoint, series?: SeriesData) => {
    if (series) {
      return `<div><strong>${series.name}</strong>: ${point.value}</div>`;
    }
    return `<div><strong>${point.label || ''}</strong>: ${point.value}</div>`;
  },
  position: 'pointer',
  offset: { x: 10, y: 10 },
  followCursor: true
};

/**
 * TooltipManager
 * 
 * Creates and manages tooltips for charts
 */
export class TooltipManager {
  private tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private options: TooltipOptions;
  private visible = false;
  
  constructor(options: Partial<TooltipOptions> = {}) {
    // Merge default options with provided options
    this.options = { ...defaultTooltipOptions, ...options };
    
    // Create the tooltip element if it doesn't exist
    this.tooltip = d3.select(document.body)
      .selectAll<HTMLDivElement, unknown>('.m-chart-tooltip')
      .data([null])
      .join('div')
      .attr('class', 'm-chart-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', '#fff')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif')
      .style('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.1)')
      .style('z-index', '9999')
      .style('max-width', '200px')
      .style('opacity', '0')
      .style('transition', 'opacity 0.15s ease-in-out');
  }
  
  /**
   * Show the tooltip
   */
  show(
    content: string | Node, 
    event: MouseEvent | { x: number; y: number }, 
    container?: Element
  ): void {
    // Update tooltip content
    if (typeof content === 'string') {
      this.tooltip.html(content);
    } else {
      this.tooltip.html('').append(() => content);
    }
    
    // Calculate position
    let x: number, y: number;
    
    if ('clientX' in event) {
      // Event is a MouseEvent
      const rect = container ? container.getBoundingClientRect() : null;
      x = rect ? event.clientX - rect.left : event.clientX;
      y = rect ? event.clientY - rect.top : event.clientY;
    } else {
      // Event is a position object
      x = event.x;
      y = event.y;
    }
    
    // Apply offset
    const { offset } = this.options;
    if (offset) {
      x += offset.x || 0;
      y += offset.y || 0;
    }
    
    // Position tooltip
    const tooltipElement = this.tooltip.node();
    if (tooltipElement) {
      // Make sure tooltip doesn't go outside window
      const tooltipRect = tooltipElement.getBoundingClientRect();
      const documentWidth = document.documentElement.clientWidth;
      const documentHeight = document.documentElement.clientHeight;
      
      // Check if tooltip would go outside right edge
      if (x + tooltipRect.width > documentWidth) {
        x = documentWidth - tooltipRect.width - 10;
      }
      
      // Check if tooltip would go outside bottom edge
      if (y + tooltipRect.height > documentHeight) {
        y = documentHeight - tooltipRect.height - 10;
      }
    }
    
    this.tooltip
      .style('left', `${x}px`)
      .style('top', `${y}px`)
      .style('opacity', '1');
    
    this.visible = true;
  }
  
  /**
   * Hide the tooltip
   */
  hide(): void {
    this.tooltip.style('opacity', '0');
    this.visible = false;
  }
  
  /**
   * Update the tooltip position
   */
  move(
    event: MouseEvent | { x: number; y: number },
    container?: Element
  ): void {
    if (!this.visible || !this.options.followCursor) return;
    
    // Calculate position
    let x: number, y: number;
    
    if ('clientX' in event) {
      // Event is a MouseEvent
      const rect = container ? container.getBoundingClientRect() : null;
      x = rect ? event.clientX - rect.left : event.clientX;
      y = rect ? event.clientY - rect.top : event.clientY;
    } else {
      // Event is a position object
      x = event.x;
      y = event.y;
    }
    
    // Apply offset
    const { offset } = this.options;
    if (offset) {
      x += offset.x || 0;
      y += offset.y || 0;
    }
    
    // Position tooltip
    const tooltipElement = this.tooltip.node();
    if (tooltipElement) {
      // Make sure tooltip doesn't go outside window
      const tooltipRect = tooltipElement.getBoundingClientRect();
      const documentWidth = document.documentElement.clientWidth;
      const documentHeight = document.documentElement.clientHeight;
      
      // Check if tooltip would go outside right edge
      if (x + tooltipRect.width > documentWidth) {
        x = documentWidth - tooltipRect.width - 10;
      }
      
      // Check if tooltip would go outside bottom edge
      if (y + tooltipRect.height > documentHeight) {
        y = documentHeight - tooltipRect.height - 10;
      }
    }
    
    this.tooltip
      .style('left', `${x}px`)
      .style('top', `${y}px`);
  }
  
  /**
   * Update tooltip options
   */
  updateOptions(options: Partial<TooltipOptions>): void {
    this.options = { ...this.options, ...options };
  }
  
  /**
   * Format tooltip content
   */
  formatContent(point: DataPoint, series?: SeriesData): string {
    if (this.options.format) {
      return this.options.format(point, series);
    }
    
    if (series) {
      return `<div><strong>${series.name}</strong>: ${point.value}</div>`;
    }
    return `<div><strong>${point.label || ''}</strong>: ${point.value}</div>`;
  }
  
  /**
   * Create a simple tooltip handler for chart elements
   */
  createHandler(
    getDataFromEvent: (event: MouseEvent) => { point: DataPoint; series?: SeriesData } | null,
    container?: Element
  ) {
    return {
      mouseenter: (event: MouseEvent) => {
        if (!this.options.show) return;
        
        const data = getDataFromEvent(event);
        if (!data) return;
        
        const content = this.formatContent(data.point, data.series);
        this.show(content, event, container);
      },
      mousemove: (event: MouseEvent) => {
        if (!this.options.show || !this.visible) return;
        this.move(event, container);
      },
      mouseleave: () => {
        this.hide();
      }
    };
  }
  
  /**
   * Destroy the tooltip manager and clean up DOM elements
   */
  destroy(): void {
    this.tooltip.remove();
  }
}