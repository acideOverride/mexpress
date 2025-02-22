import { expect } from '@jest/globals';

declare global {
    const expect: typeof expect;
    
    interface Window {
        matchMedia: jest.Mock;
        scrollTo: jest.Mock;
    }
    
    class IntersectionObserver {
        constructor(...args: any[]);
        observe(...args: any[]): any;
        unobserve(...args: any[]): any;
        disconnect(...args: any[]): any;
    }
    
    class ResizeObserver {
        constructor(...args: any[]);
        observe(...args: any[]): any;
        unobserve(...args: any[]): any;
        disconnect(...args: any[]): any;
    }
}