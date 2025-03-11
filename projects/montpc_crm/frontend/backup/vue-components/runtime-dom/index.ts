// Runtime DOM proxy with direct imports
import * as RuntimeDOM from 'vue';

// Re-export initCustomFormatter and warn
export const { initCustomFormatter, warn } = RuntimeDOM;

// Re-export any other needed exports
export * from 'vue';
