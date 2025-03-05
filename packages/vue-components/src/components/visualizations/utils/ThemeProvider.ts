import * as d3 from 'd3';

// Theme interface
export interface ChartTheme {
  // Color palettes
  colors: {
    primary: string[];
    categorical: string[];
    sequential: string[];
    diverging: string[];
  };
  
  // Typography
  typography: {
    fontFamily: string;
    fontSize: number;
    titleFontSize: number;
    subtitleFontSize: number;
    labelFontSize: number;
    legendFontSize: number;
    tooltipFontSize: number;
    fontWeight: number;
    titleFontWeight: number;
  };
  
  // Layout
  layout: {
    padding: number;
    margins: { top: number; right: number; bottom: number; left: number };
    borderRadius: number;
    aspectRatio: number;
  };
  
  // Axis styling
  axis: {
    strokeColor: string;
    strokeWidth: number;
    tickLength: number;
    tickColor: string;
    tickWidth: number;
    gridColor: string;
    gridWidth: number;
    labelColor: string;
    titleColor: string;
  };
  
  // Backgrounds
  backgrounds: {
    chart: string;
    tooltip: string;
    legend: string;
  };
  
  // Element styling
  elements: {
    lineWidth: number;
    pointSize: number;
    barOpacity: number;
    areaOpacity: number;
    hoverOpacity: number;
    activeOpacity: number;
    inactiveOpacity: number;
  };
  
  // Animations
  animations: {
    duration: number;
    easing: string;
  };
  
  // Shadows and effects
  effects: {
    dropShadow: string;
    hoverEffect: string;
    focusEffect: string;
  };
}

// Default light theme
export const lightTheme: ChartTheme = {
  colors: {
    primary: ['#4C78DB', '#F58518', '#60BD68', '#E45756', '#9D755D', '#AA46BE'],
    categorical: [
      '#4C78DB', '#F58518', '#60BD68', '#E45756', '#9D755D', '#AA46BE',
      '#F2BA49', '#5DB1DE', '#D57192', '#B0B0B0', '#1B1B1B'
    ],
    sequential: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    diverging: ['#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4']
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 12,
    titleFontSize: 16,
    subtitleFontSize: 14,
    labelFontSize: 11,
    legendFontSize: 12,
    tooltipFontSize: 12,
    fontWeight: 400,
    titleFontWeight: 600
  },
  layout: {
    padding: 16,
    margins: { top: 40, right: 40, bottom: 50, left: 60 },
    borderRadius: 4,
    aspectRatio: 16 / 9
  },
  axis: {
    strokeColor: '#555555',
    strokeWidth: 1,
    tickLength: 6,
    tickColor: '#555555',
    tickWidth: 1,
    gridColor: 'rgba(0, 0, 0, 0.1)',
    gridWidth: 1,
    labelColor: '#333333',
    titleColor: '#333333'
  },
  backgrounds: {
    chart: '#ffffff',
    tooltip: '#ffffff',
    legend: '#ffffff'
  },
  elements: {
    lineWidth: 2,
    pointSize: 6,
    barOpacity: 0.9,
    areaOpacity: 0.2,
    hoverOpacity: 0.8,
    activeOpacity: 1,
    inactiveOpacity: 0.3
  },
  animations: {
    duration: 400,
    easing: 'cubic-out'
  },
  effects: {
    dropShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    hoverEffect: '0 4px 8px rgba(0, 0, 0, 0.15)',
    focusEffect: '0 0 0 3px rgba(66, 153, 225, 0.5)'
  }
};

// Default dark theme
export const darkTheme: ChartTheme = {
  colors: {
    primary: ['#6E96E9', '#FFA344', '#82CF8A', '#FF7B7B', '#BF9578', '#CC77E4'],
    categorical: [
      '#6E96E9', '#FFA344', '#82CF8A', '#FF7B7B', '#BF9578', '#CC77E4',
      '#FFD875', '#7FC4ED', '#ED93B0', '#D0D0D0', '#F0F0F0'
    ],
    sequential: ['#08306b', '#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7', '#f7fbff'],
    diverging: ['#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027']
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 12,
    titleFontSize: 16,
    subtitleFontSize: 14,
    labelFontSize: 11,
    legendFontSize: 12,
    tooltipFontSize: 12,
    fontWeight: 400,
    titleFontWeight: 600
  },
  layout: {
    padding: 16,
    margins: { top: 40, right: 40, bottom: 50, left: 60 },
    borderRadius: 4,
    aspectRatio: 16 / 9
  },
  axis: {
    strokeColor: '#777777',
    strokeWidth: 1,
    tickLength: 6,
    tickColor: '#777777',
    tickWidth: 1,
    gridColor: 'rgba(255, 255, 255, 0.1)',
    gridWidth: 1,
    labelColor: '#cccccc',
    titleColor: '#eeeeee'
  },
  backgrounds: {
    chart: '#222222',
    tooltip: '#333333',
    legend: '#333333'
  },
  elements: {
    lineWidth: 2,
    pointSize: 6,
    barOpacity: 0.9,
    areaOpacity: 0.3,
    hoverOpacity: 0.85,
    activeOpacity: 1,
    inactiveOpacity: 0.3
  },
  animations: {
    duration: 400,
    easing: 'cubic-out'
  },
  effects: {
    dropShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    hoverEffect: '0 4px 8px rgba(0, 0, 0, 0.4)',
    focusEffect: '0 0 0 3px rgba(99, 179, 237, 0.5)'
  }
};

// D3 scale factories
export const createColorScale = (theme: ChartTheme, scheme: 'categorical' | 'sequential' | 'diverging' = 'categorical') => {
  return d3.scaleOrdinal(theme.colors[scheme]);
};

// Function to get the appropriate theme based on user preferences
export const getTheme = (themeName: 'light' | 'dark' | 'custom' = 'light', customTheme?: Partial<ChartTheme>): ChartTheme => {
  const baseTheme = themeName === 'dark' ? darkTheme : lightTheme;
  
  if (customTheme) {
    return mergeThemes(baseTheme, customTheme);
  }
  
  return baseTheme;
};

// Helper to deep merge themes
export const mergeThemes = (baseTheme: ChartTheme, overrides: Partial<ChartTheme>): ChartTheme => {
  const result = { ...baseTheme };
  
  // Merge each category
  Object.keys(overrides).forEach(key => {
    const k = key as keyof ChartTheme;
    if (typeof overrides[k] === 'object' && overrides[k] !== null) {
      result[k] = { ...result[k], ...overrides[k] };
    } else {
      result[k] = overrides[k] as any;
    }
  });
  
  return result;
};

// Create a scale for continuous data (numeric)
export const createContinuousScale = (
  domain: [number, number],
  range: [number, number],
  type: 'linear' | 'log' | 'sqrt' | 'pow' = 'linear'
) => {
  switch (type) {
    case 'log':
      return d3.scaleLog().domain(domain).range(range).nice();
    case 'sqrt':
      return d3.scaleSqrt().domain(domain).range(range).nice();
    case 'pow':
      return d3.scalePow().domain(domain).range(range).nice();
    case 'linear':
    default:
      return d3.scaleLinear().domain(domain).range(range).nice();
  }
};

// Create a scale for categorical data
export const createBandScale = (
  domain: string[],
  range: [number, number],
  paddingInner = 0.1,
  paddingOuter = 0.2
) => {
  return d3.scaleBand().domain(domain).range(range).paddingInner(paddingInner).paddingOuter(paddingOuter);
};

// Create a time scale
export const createTimeScale = (
  domain: [Date, Date],
  range: [number, number]
) => {
  return d3.scaleTime().domain(domain).range(range).nice();
};

// Format numbers for display
export const formatNumber = (value: number, format = ',.0f') => {
  return d3.format(format)(value);
};

// Format time/dates for display
export const formatTime = (date: Date, formatStr = '%b %d, %Y') => {
  return d3.timeFormat(formatStr)(date);
};

// Create axes
export const createAxis = (
  scale: any, 
  orientation: 'top' | 'right' | 'bottom' | 'left' = 'bottom',
  tickCount?: number
) => {
  let axis;
  
  switch (orientation) {
    case 'top':
      axis = d3.axisTop(scale);
      break;
    case 'right':
      axis = d3.axisRight(scale);
      break;
    case 'left':
      axis = d3.axisLeft(scale);
      break;
    case 'bottom':
    default:
      axis = d3.axisBottom(scale);
      break;
  }
  
  if (tickCount !== undefined) {
    axis.ticks(tickCount);
  }
  
  return axis;
};

// Generate a unique ID for SVG elements like gradients, clips, etc.
export const generateId = (prefix = 'el') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Apply theme styles to an SVG element
export const applyThemeToSvg = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, theme: ChartTheme) => {
  svg.style('font-family', theme.typography.fontFamily)
     .style('background-color', theme.backgrounds.chart)
     .style('border-radius', `${theme.layout.borderRadius}px`);
};

// Apply theme styles to axes
export const applyThemeToAxis = (
  axis: d3.Selection<SVGGElement, unknown, null, undefined>,
  theme: ChartTheme,
  showGrid = false,
  isYAxis = false
) => {
  // Style the axis line
  axis.select('.domain')
      .attr('stroke', theme.axis.strokeColor)
      .attr('stroke-width', theme.axis.strokeWidth);
  
  // Style the ticks
  axis.selectAll('.tick line')
      .attr('stroke', theme.axis.tickColor)
      .attr('stroke-width', theme.axis.tickWidth);
  
  // Style the labels
  axis.selectAll('.tick text')
      .attr('fill', theme.axis.labelColor)
      .attr('font-size', theme.typography.labelFontSize)
      .attr('font-weight', theme.typography.fontWeight);
  
  // Add grid lines if requested
  if (showGrid) {
    axis.selectAll('.tick line')
        .attr('stroke', theme.axis.gridColor)
        .attr('stroke-width', theme.axis.gridWidth)
        .attr('stroke-dasharray', '2,2')
        .attr('x2', isYAxis ? 0 : 0)
        .attr('y2', isYAxis ? 0 : 0);
  }
};

// Helper function to create SVG element with proper sizing
export const createSvg = (
  container: Element,
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number } = { top: 20, right: 20, bottom: 30, left: 40 }
) => {
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('style', 'max-width: 100%; height: auto;');
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  return { svg, g, width, height, margin };
};