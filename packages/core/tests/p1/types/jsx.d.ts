/**
 * JSX type definitions for React testing
 * 
 * @file jsx.d.ts
 * @BRQ MEXP-2025-005-FE UI Architecture
 */

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}