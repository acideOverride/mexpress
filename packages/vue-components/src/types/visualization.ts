// Common types for visualization components

// Basic data point for any chart
export type DataPoint = {
  id?: string | number;
  label?: string;
  value: number;
  color?: string;
  [key: string]: any; // Allow additional properties
};

// Series data for multi-series charts (line, area, bar)
export type SeriesData = {
  id: string | number;
  name: string;
  color?: string;
  data: DataPoint[];
};

// Position settings
export type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

// Common axis configuration
export type AxisConfig = {
  showAxis?: boolean;
  showGrid?: boolean;
  title?: string;
  titleOffset?: number;
  format?: (value: any) => string;
  tickCount?: number;
  tickValues?: any[];
  domain?: [any, any]; // Min and max bounds
};

// Color schemes
export type ColorScheme = 'categorical' | 'sequential' | 'diverging' | 'custom';

// Chart size options
export type ChartSize = {
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  margin?: Margin;
  responsive?: boolean;
};

// Animation options
export type AnimationOptions = {
  enabled?: boolean;
  duration?: number;
  easing?: string;
  delay?: number | ((d: any, i: number) => number);
};

// Generic data structure for passing to chart components
export type ChartData = {
  series?: SeriesData[]; // For multi-series charts
  data?: DataPoint[]; // For single-series charts
};

// Legend options
export type LegendOptions = {
  show?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  shape?: 'circle' | 'square' | 'line';
  itemGap?: number;
  fontSize?: number;
  fontFamily?: string;
  onClick?: (item: any, index: number) => void;
};

// Tooltip options
export type TooltipOptions = {
  show?: boolean;
  format?: (point: DataPoint, series?: SeriesData) => string;
  position?: 'pointer' | 'fixed';
  offset?: {x: number, y: number};
  followCursor?: boolean;
};

// Chart interaction options
export type InteractionOptions = {
  hoverHighlight?: boolean;
  clickHighlight?: boolean;
  zoomable?: boolean;
  pannable?: boolean;
  selectable?: boolean;
};

// Common chart configuration that applies to most chart types
export type BaseChartConfig = {
  title?: string;
  subtitle?: string;
  size?: ChartSize;
  colors?: string[] | {[key: string]: string};
  colorScheme?: ColorScheme;
  legend?: LegendOptions;
  tooltip?: TooltipOptions;
  interaction?: InteractionOptions;
  animation?: AnimationOptions;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  theme?: 'light' | 'dark' | 'custom';
  locale?: string;
  accessibility?: {
    enabled?: boolean;
    description?: string;
  };
  onChartClick?: (data: any, event: any) => void;
  onChartHover?: (data: any, event: any) => void;
};

// Bar chart specific configuration
export type BarChartConfig = BaseChartConfig & {
  orientation?: 'vertical' | 'horizontal';
  grouping?: 'grouped' | 'stacked';
  barPadding?: number;
  barWidth?: number | string;
  enableLabels?: boolean;
  labelPosition?: 'inside' | 'outside';
  enableSort?: boolean;
  sortBy?: 'value' | 'label' | 'custom';
  sortOrder?: 'asc' | 'desc';
};

// Line chart specific configuration
export type LineChartConfig = BaseChartConfig & {
  curve?: 'linear' | 'stepAfter' | 'stepBefore' | 'cardinal' | 'catmullRom' | 'monotone';
  enablePoints?: boolean;
  pointSize?: number;
  pointShape?: 'circle' | 'square' | 'diamond';
  lineWidth?: number;
  enableArea?: boolean;
  areaOpacity?: number;
  enableCrosshair?: boolean;
};

// Pie and donut chart specific configuration
export type PieChartConfig = BaseChartConfig & {
  innerRadius?: number | string; // 0 for pie, > 0 for donut
  padAngle?: number;
  cornerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  enableLabels?: boolean;
  labelType?: 'value' | 'percent' | 'name' | 'key';
  labelPosition?: 'inside' | 'outside';
  labelOffset?: number;
};

// Radar/Spider chart specific configuration
export type RadarChartConfig = BaseChartConfig & {
  levels?: number;
  enableWebsShape?: boolean; // Circular or polygon web
  enableLabels?: boolean;
  labelOffset?: number;
  fillOpacity?: number;
  areaBlendMode?: string;
  enableDots?: boolean;
  dotSize?: number;
};

// Scatter plot specific configuration
export type ScatterPlotConfig = BaseChartConfig & {
  pointSize?: number | ((d: DataPoint) => number);
  pointShape?: 'circle' | 'square' | 'triangle' | 'cross' | 'diamond';
  pointOpacity?: number;
  xScale?: 'linear' | 'log' | 'time';
  yScale?: 'linear' | 'log';
  enableTrendline?: boolean;
  trendlineType?: 'linear' | 'polynomial' | 'loess';
  trendDegree?: number;
  enableQuadrants?: boolean;
  quadrantLabels?: [string, string, string, string];
};

// Heatmap specific configuration
export type HeatmapConfig = BaseChartConfig & {
  cellPadding?: number;
  cellShape?: 'square' | 'circle' | 'rounded';
  enableLabels?: boolean;
  labelFormat?: (value: any) => string;
  emptyColor?: string;
  enableNormalize?: boolean;
  normalizeMethod?: 'minmax' | 'zscore';
};

// Common event handlers for chart components
export type ChartEventHandlers = {
  onClick?: (event: MouseEvent, data: any) => void;
  onHover?: (event: MouseEvent, data: any) => void;
  onMouseEnter?: (event: MouseEvent, data: any) => void;
  onMouseLeave?: (event: MouseEvent, data: any) => void;
  onSelectionChange?: (selectedData: any[]) => void;
};

// Export chart config by type
export type ChartConfigByType = {
  bar: BarChartConfig;
  line: LineChartConfig;
  pie: PieChartConfig;
  radar: RadarChartConfig;
  scatter: ScatterPlotConfig;
  heatmap: HeatmapConfig;
};