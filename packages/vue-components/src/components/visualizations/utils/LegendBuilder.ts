import * as d3 from 'd3';
import { LegendOptions, ChartTheme } from '@/types';
import { truncateText } from './index';

/**
 * Creates and manages legends for charts
 */
export class LegendBuilder {
  private options: LegendOptions;
  private theme: ChartTheme;
  private container: d3.Selection<any, unknown, null, undefined>;
  private items: Array<{ label: string; color: string; value?: string | number }> = [];
  private onItemClick?: (item: string, index: number) => void;
  
  constructor(
    container: d3.Selection<any, unknown, null, undefined>,
    theme: ChartTheme,
    options: LegendOptions
  ) {
    this.container = container;
    this.theme = theme;
    this.options = {
      show: true,
      position: 'bottom',
      shape: 'circle',
      itemGap: 16,
      fontSize: theme.typography.legendFontSize,
      fontFamily: theme.typography.fontFamily,
      ...options
    };
  }
  
  /**
   * Add items to the legend
   */
  setItems(items: Array<{ label: string; color: string; value?: string | number }>): LegendBuilder {
    this.items = items;
    return this;
  }
  
  /**
   * Set click handler for legend items
   */
  setClickHandler(handler: (item: string, index: number) => void): LegendBuilder {
    this.onItemClick = handler;
    return this;
  }
  
  /**
   * Update legend options
   */
  updateOptions(options: Partial<LegendOptions>): LegendBuilder {
    this.options = { ...this.options, ...options };
    return this;
  }
  
  /**
   * Render the legend to the container
   */
  render(): void {
    if (!this.options.show || this.items.length === 0) {
      return;
    }
    
    // Clear existing legend
    this.container.selectAll('.chart-legend').remove();
    
    // Create legend group
    const legend = this.container
      .append('g')
      .attr('class', 'chart-legend')
      .style('font-family', this.options.fontFamily)
      .style('font-size', `${this.options.fontSize}px`);
    
    // Create legend items
    const items = legend
      .selectAll('.legend-item')
      .data(this.items)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .style('cursor', this.onItemClick ? 'pointer' : 'default')
      .on('click', (event, d, i) => {
        if (this.onItemClick) {
          this.onItemClick(d.label, i);
        }
      });
    
    // Add shape to legend items
    switch (this.options.shape) {
      case 'circle':
        items
          .append('circle')
          .attr('r', 6)
          .attr('fill', d => d.color);
        break;
      case 'square':
        items
          .append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('x', -6)
          .attr('y', -6)
          .attr('fill', d => d.color);
        break;
      case 'line':
        items
          .append('line')
          .attr('x1', -10)
          .attr('x2', 10)
          .attr('y1', 0)
          .attr('y2', 0)
          .attr('stroke', d => d.color)
          .attr('stroke-width', 3);
        break;
    }
    
    // Add text to legend items
    items
      .append('text')
      .attr('x', this.options.shape === 'line' ? 15 : 10)
      .attr('y', 4)
      .style('fill', this.theme.axis.labelColor)
      .text(d => truncateText(d.label, 25));
    
    // Position legend items based on position option
    const isHorizontal = ['top', 'bottom'].includes(this.options.position || 'bottom');
    
    // Calculate total width and height for positioning
    let totalWidth = 0;
    let totalHeight = 0;
    let itemHeight = 0;
    
    legend.selectAll('.legend-item').each(function() {
      const bbox = this.getBBox();
      totalWidth += bbox.width + (this.options?.itemGap || 16);
      itemHeight = Math.max(itemHeight, bbox.height);
    });
    
    if (isHorizontal) {
      // Position items horizontally
      let offsetX = 0;
      
      legend.selectAll('.legend-item').each(function() {
        const bbox = this.getBBox();
        d3.select(this).attr('transform', `translate(${offsetX}, 0)`);
        offsetX += bbox.width + (this.options?.itemGap || 16);
      });
      
      totalHeight = itemHeight;
    } else {
      // Position items vertically
      let offsetY = 0;
      
      legend.selectAll('.legend-item').each(function() {
        d3.select(this).attr('transform', `translate(0, ${offsetY})`);
        offsetY += itemHeight + 8; // Add some vertical spacing
      });
      
      totalHeight = offsetY;
    }
    
    // Position the entire legend group based on the position option
    const containerWidth = this.container.node().getBBox().width;
    const containerHeight = this.container.node().getBBox().height;
    
    let legendX = 0;
    let legendY = 0;
    
    switch (this.options.position) {
      case 'top':
        legendX = (containerWidth - totalWidth) / 2;
        legendY = 0;
        break;
      case 'right':
        legendX = containerWidth - (isHorizontal ? totalWidth : 100);
        legendY = (containerHeight - totalHeight) / 2;
        break;
      case 'bottom':
        legendX = (containerWidth - totalWidth) / 2;
        legendY = containerHeight - totalHeight;
        break;
      case 'left':
        legendX = 0;
        legendY = (containerHeight - totalHeight) / 2;
        break;
    }
    
    legend.attr('transform', `translate(${legendX}, ${legendY})`);
  }
  
  /**
   * Generate a legend for a D3 color scale
   */
  static fromColorScale(
    container: d3.Selection<any, unknown, null, undefined>,
    theme: ChartTheme,
    scale: d3.ScaleOrdinal<string, unknown>,
    domain: string[],
    options: LegendOptions = {}
  ): LegendBuilder {
    const items = domain.map((label, i) => ({
      label,
      color: scale(label) as string
    }));
    
    return new LegendBuilder(container, theme, options).setItems(items);
  }
}