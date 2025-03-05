export * from './ThemeProvider';
export * from './TooltipManager';
export * from './LegendBuilder';

// Utility functions for D3 visualization components

/**
 * Determine if we're in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Safely access window object (only in browser environments)
 */
export const getWindow = () => (isBrowser ? window : undefined);

/**
 * Safely access document object (only in browser environments)
 */
export const getDocument = () => (isBrowser ? document : undefined);

/**
 * Add resize listener safely
 */
export const addResizeListener = (callback: () => void): (() => void) => {
  if (!isBrowser) return () => {};
  
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

/**
 * Measure text width using canvas
 */
export const getTextWidth = (text: string, font: string): number => {
  if (!isBrowser) return 0;
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 0;
  
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

/**
 * Generate a unique ID
 */
export const uniqueId = (prefix = 'chart'): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format number with abbreviations (K, M, B)
 */
export const formatNumberAbbrev = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
  return `${(num / 1000000000).toFixed(1)}B`;
};

/**
 * Format percentage
 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Get optimal tick count based on container width
 */
export const getOptimalTickCount = (width: number, minPixelsPerTick = 50): number => {
  return Math.max(2, Math.floor(width / minPixelsPerTick));
};

/**
 * Get max value from an array with a safety margin
 */
export const getMaxValueWithMargin = (values: number[], margin = 0.1): number => {
  const max = Math.max(...values);
  return max + max * margin;
};

/**
 * Get default animation duration based on data size
 */
export const getDefaultAnimationDuration = (dataLength: number): number => {
  // Shorter duration for larger datasets
  return Math.min(1000, 300 + (dataLength * 10));
};

/**
 * Get contrasting text color for a background color
 */
export const getContrastingTextColor = (bgColor: string): 'black' | 'white' => {
  // Simple function to determine if text should be white or black based on background
  // Convert hex to RGB
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate YIQ value - formula determines brightness
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  return yiq >= 128 ? 'black' : 'white';
};

/**
 * Create string dimensions for chart responsive sizing
 */
export const getDimension = (value: number | string | undefined, fallback: number): string => {
  if (value === undefined) return `${fallback}px`;
  if (typeof value === 'number') return `${value}px`;
  return value;
};

/**
 * Get contrasting color index for alternating patterns
 */
export const getContrastIndex = (index: number, total: number): number => {
  // Good for getting contrasting indexes from color palettes
  const half = Math.ceil(total / 2);
  return (index % half) + (Math.floor(index / half) * half);
};

/**
 * Create accessible description for chart for screen readers
 */
export const createAccessibleDescription = (
  chartType: string,
  title: string,
  data: Array<{ name: string; value: number }>
): string => {
  const dataDescription = data.map(d => `${d.name}: ${d.value}`).join(', ');
  return `${chartType} chart titled "${title}" with data points: ${dataDescription}.`;
};

/**
 * Calculate luminance of a color for contrast
 */
export const getLuminance = (color: string): number => {
  // Uses relative luminance formula
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Generate a lighter or darker version of a color
 */
export const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  
  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust color
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};