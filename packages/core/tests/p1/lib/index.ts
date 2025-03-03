/**
 * Coverage merge utilities 
 * Implementation for the test coverage tools
 * Based on the v8 coverage format
 * 
 * @file index.ts
 * @BRQ MEXP-2025-018-FE Frontend Test Architecture
 */

/**
 * Range represents a coverage range in a function
 */
export interface Range {
  startOffset: number;
  endOffset: number;
  count: number;
}

/**
 * FunctionCov represents the coverage for a specific function
 */
export interface FunctionCov {
  functionName: string;
  ranges: Range[];
  isBlockCoverage: boolean;
}

/**
 * ScriptCov represents the coverage for a specific script
 */
export interface ScriptCov {
  scriptId: string;
  url: string;
  functions: FunctionCov[];
}

/**
 * ProcessCov represents the coverage for a process
 */
export interface ProcessCov {
  result: ScriptCov[];
}

/**
 * Merges ranges that overlap or are adjacent
 * @param ranges The ranges to merge
 * @returns Merged ranges
 */
function mergeRanges(ranges: Range[]): Range[] {
  if (ranges.length <= 1) {
    return ranges;
  }

  // Sort ranges by startOffset, then by endOffset
  const sortedRanges = [...ranges].sort((a, b) => {
    if (a.startOffset !== b.startOffset) {
      return a.startOffset - b.startOffset;
    }
    return a.endOffset - b.endOffset;
  });

  const result: Range[] = [];
  let current = sortedRanges[0];

  for (let i = 1; i < sortedRanges.length; i++) {
    const next = sortedRanges[i];
    
    // If ranges overlap or are adjacent
    if (current.endOffset >= next.startOffset) {
      // If the next range is contained within the current range
      if (current.endOffset >= next.endOffset) {
        continue;
      }
      
      // Merge ranges
      current = {
        startOffset: current.startOffset,
        endOffset: next.endOffset,
        count: Math.max(current.count, next.count),
      };
    } else {
      // No overlap, add current to result and move to next
      result.push(current);
      current = next;
    }
  }
  
  // Add the last range
  result.push(current);
  
  return result;
}

/**
 * Merges function coverage data
 * @param functionCovs Array of function coverage data to merge
 * @returns Merged function coverage, or undefined if input is empty
 */
export function mergeFunctionCovs(functionCovs: FunctionCov[]): FunctionCov | undefined {
  if (functionCovs.length === 0) {
    return undefined;
  }

  if (functionCovs.length === 1) {
    const funcCov = functionCovs[0];
    return {
      ...funcCov,
      ranges: mergeRanges(funcCov.ranges),
    };
  }

  // Merge all function coverage
  const allRanges: Range[] = [];
  const isBlockCoverage = functionCovs.some(fc => fc.isBlockCoverage);

  for (const funcCov of functionCovs) {
    allRanges.push(...funcCov.ranges);
  }

  return {
    functionName: functionCovs[0].functionName,
    isBlockCoverage,
    ranges: mergeRanges(allRanges),
  };
}

/**
 * Merges script coverage data
 * @param scriptCovs Array of script coverage data to merge
 * @returns Merged script coverage, or undefined if input is empty
 */
export function mergeScriptCovs(scriptCovs: ScriptCov[]): ScriptCov | undefined {
  if (scriptCovs.length === 0) {
    return undefined;
  }

  if (scriptCovs.length === 1) {
    const scriptCov = scriptCovs[0];
    return {
      ...scriptCov,
      functions: scriptCov.functions.map(funcCov => ({
        ...funcCov,
        ranges: mergeRanges(funcCov.ranges),
      })),
    };
  }

  // Group function coverage by name
  const functionsByName = new Map<string, FunctionCov[]>();

  for (const scriptCov of scriptCovs) {
    for (const funcCov of scriptCov.functions) {
      const existing = functionsByName.get(funcCov.functionName) || [];
      existing.push(funcCov);
      functionsByName.set(funcCov.functionName, existing);
    }
  }

  // Merge functions with the same name
  const mergedFunctions: FunctionCov[] = [];
  for (const [, funcs] of functionsByName) {
    const merged = mergeFunctionCovs(funcs);
    if (merged) {
      mergedFunctions.push(merged);
    }
  }

  return {
    scriptId: scriptCovs[0].scriptId,
    url: scriptCovs[0].url,
    functions: mergedFunctions,
  };
}

/**
 * Merges process coverage data
 * @param processCovs Array of process coverage data to merge
 * @returns Merged process coverage
 */
export function mergeProcessCovs(processCovs: ProcessCov[]): ProcessCov {
  if (processCovs.length === 0) {
    return { result: [] };
  }

  // Group script coverage by URL
  const scriptsByUrl = new Map<string, ScriptCov[]>();

  for (const processCov of processCovs) {
    for (const scriptCov of processCov.result) {
      const existing = scriptsByUrl.get(scriptCov.url) || [];
      existing.push(scriptCov);
      scriptsByUrl.set(scriptCov.url, existing);
    }
  }

  // Merge scripts with the same URL
  const mergedScripts: ScriptCov[] = [];
  for (const [, scripts] of scriptsByUrl) {
    const merged = mergeScriptCovs(scripts);
    if (merged) {
      // For merged scripts, use a consistent scriptId
      merged.scriptId = "0";
      mergedScripts.push(merged);
    }
  }

  return { result: mergedScripts };
}