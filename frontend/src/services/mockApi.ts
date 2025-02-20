import { mockMetrics, mockRecentCalls, mockActivities } from './mockData';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async getMetrics() {
    await delay(600);
    return mockMetrics;
  },

  async getRecentCalls() {
    await delay(800);
    return mockRecentCalls;
  },

  async getActivities() {
    await delay(1000);
    return mockActivities;
  }
};