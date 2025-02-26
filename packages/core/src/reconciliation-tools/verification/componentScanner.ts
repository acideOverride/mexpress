import fs from 'fs';
import path from 'path';
import { ScannerOptions, ScanResult, ComponentStatusType } from '../types';

/**
 * Component Scanner for analyzing codebase and verifying component implementation
 */
export class ComponentScanner {
  /**
   * Scan a directory for a specific component
   * @param componentName Component name to scan for
   * @param options Scanner options
   * @returns Scan results
   */
  public async scanComponent(componentName: string, options: ScannerOptions): Promise<ScanResult> {
    const result: ScanResult = {
      name: componentName,
      files: [],
      linesOfCode: 0,
      testFiles: [],
      testLinesOfCode: 0,
      evidence: [],
      suggestedStatus: 'MISSING',
      confidence: 0
    };
    
    // Normalize component name for searching
    const normalizedComponentName = this.normalizeComponentName(componentName);
    
    try {
      await this.scanDirectory(
        options.directory,
        normalizedComponentName,
        options.include,
        options.exclude,
        result,
        options.depth || 5,
        options.includeTests || true
      );
      
      // Determine suggested status based on evidence
      this.determineSuggestedStatus(result);
      
      return result;
    } catch (error) {
      console.error(`Error scanning for component ${componentName}:`, error);
      return result;
    }
  }
  
  /**
   * Normalize component name for searching
   * @param componentName Component name
   * @returns Normalized component name
   */
  private normalizeComponentName(componentName: string): string {
    // Convert to lowercase and remove special characters
    return componentName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }
  
  /**
   * Check if a filename matches any of the patterns
   * @param filename Filename to check
   * @param patterns Array of glob patterns
   * @returns true if matches, false otherwise
   */
  private matchesPatterns(filename: string, patterns: string[]): boolean {
    // Simple pattern matching (can be replaced with a more robust glob matcher)
    return patterns.some(pattern => {
      // Convert glob pattern to regex
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(filename);
    });
  }
  
  /**
   * Check if file is a test file
   * @param filePath File path
   * @returns true if test file, false otherwise
   */
  private isTestFile(filePath: string): boolean {
    return (
      filePath.includes('/__tests__/') ||
      filePath.includes('/tests/') ||
      filePath.includes('.test.') ||
      filePath.includes('.spec.')
    );
  }
  
  /**
   * Scan a directory recursively for component evidence
   * @param directory Directory to scan
   * @param normalizedComponentName Normalized component name
   * @param includePatterns Patterns to include
   * @param excludePatterns Patterns to exclude
   * @param result Scan result to update
   * @param depth Maximum recursion depth
   * @param includeTests Whether to include test files
   */
  private async scanDirectory(
    directory: string,
    normalizedComponentName: string,
    includePatterns: string[],
    excludePatterns: string[],
    result: ScanResult,
    depth: number,
    includeTests: boolean
  ): Promise<void> {
    if (depth <= 0) return;
    
    try {
      const entries = fs.readdirSync(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        
        // Skip excluded patterns
        if (this.matchesPatterns(entry.name, excludePatterns)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this.scanDirectory(
            entryPath,
            normalizedComponentName,
            includePatterns,
            excludePatterns,
            result,
            depth - 1,
            includeTests
          );
        } else if (entry.isFile()) {
          // Skip files that don't match include patterns
          if (!this.matchesPatterns(entry.name, includePatterns)) {
            continue;
          }
          
          // Check if this is a test file
          const isTest = this.isTestFile(entryPath);
          
          // Skip test files if they should be excluded
          if (isTest && !includeTests) {
            continue;
          }
          
          try {
            // Read file content
            const content = fs.readFileSync(entryPath, 'utf8');
            const lines = content.split('\n');
            const normalizedContent = content.toLowerCase();
            
            // Check if the file contains the component name
            if (normalizedContent.includes(normalizedComponentName)) {
              // Add to relevant arrays and count lines
              if (isTest) {
                result.testFiles.push(entryPath);
                result.testLinesOfCode += lines.length;
                
                // Add as test evidence
                result.evidence.push({
                  type: 'TEST',
                  path: entryPath,
                  description: `Test file for ${normalizedComponentName} with ${lines.length} lines of code`
                });
              } else {
                result.files.push(entryPath);
                result.linesOfCode += lines.length;
                
                // Add as code evidence
                result.evidence.push({
                  type: 'CODE',
                  path: entryPath,
                  description: `Implementation file for ${normalizedComponentName} with ${lines.length} lines of code`
                });
              }
            }
          } catch (error) {
            console.error(`Error reading file ${entryPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${directory}:`, error);
    }
  }
  
  /**
   * Determine suggested status based on evidence
   * @param result Scan result to update
   */
  private determineSuggestedStatus(result: ScanResult): void {
    // No evidence found
    if (result.files.length === 0 && result.testFiles.length === 0) {
      result.suggestedStatus = 'MISSING';
      result.confidence = 100;
      return;
    }
    
    // We have implementation files but no tests
    if (result.files.length > 0 && result.testFiles.length === 0) {
      if (result.linesOfCode < 50) {
        result.suggestedStatus = 'MINIMAL';
        result.confidence = 70;
      } else if (result.linesOfCode < 200) {
        result.suggestedStatus = 'PARTIAL';
        result.confidence = 70;
      } else {
        result.suggestedStatus = 'PARTIAL';
        result.confidence = 60;
      }
      return;
    }
    
    // We have tests but no implementation files (unlikely but possible)
    if (result.files.length === 0 && result.testFiles.length > 0) {
      result.suggestedStatus = 'PLANNED';
      result.confidence = 60;
      return;
    }
    
    // We have both implementation and tests
    const testCoverageRatio = result.testLinesOfCode / result.linesOfCode;
    
    if (testCoverageRatio < 0.2) {
      // Very little testing relative to code
      if (result.linesOfCode < 100) {
        result.suggestedStatus = 'MINIMAL';
        result.confidence = 80;
      } else {
        result.suggestedStatus = 'PARTIAL';
        result.confidence = 70;
      }
    } else if (testCoverageRatio < 0.5) {
      // Moderate testing
      if (result.linesOfCode < 100) {
        result.suggestedStatus = 'PARTIAL';
        result.confidence = 70;
      } else {
        result.suggestedStatus = 'PARTIAL';
        result.confidence = 80;
      }
    } else {
      // Substantial testing
      if (result.linesOfCode < 50) {
        result.suggestedStatus = 'PARTIAL';
        result.confidence = 70;
      } else if (result.linesOfCode < 200) {
        result.suggestedStatus = 'PARTIAL';
        result.confidence = 80;
      } else {
        result.suggestedStatus = 'COMPLETE';
        result.confidence = 80;
      }
    }
    
    // Adjust confidence based on number of files
    if (result.files.length + result.testFiles.length > 10) {
      result.confidence = Math.min(result.confidence + 10, 100);
    }
  }
  
  /**
   * Scan for all components in the codebase matching a pattern
   * @param pattern Component name pattern
   * @param options Scanner options
   * @returns Map of component names to scan results
   */
  public async discoverComponents(pattern: string, options: ScannerOptions): Promise<Map<string, ScanResult>> {
    const results = new Map<string, ScanResult>();
    const componentNames = new Set<string>();
    
    try {
      await this.findComponentNames(
        options.directory,
        pattern,
        options.include,
        options.exclude,
        componentNames,
        options.depth || 5
      );
      
      // Scan each discovered component
      for (const componentName of componentNames) {
        const result = await this.scanComponent(componentName, options);
        results.set(componentName, result);
      }
      
      return results;
    } catch (error) {
      console.error(`Error discovering components with pattern ${pattern}:`, error);
      return results;
    }
  }
  
  /**
   * Find component names in the codebase
   * @param directory Directory to scan
   * @param pattern Component name pattern
   * @param includePatterns Patterns to include
   * @param excludePatterns Patterns to exclude
   * @param componentNames Set to update with found component names
   * @param depth Maximum recursion depth
   */
  private async findComponentNames(
    directory: string,
    pattern: string,
    includePatterns: string[],
    excludePatterns: string[],
    componentNames: Set<string>,
    depth: number
  ): Promise<void> {
    if (depth <= 0) return;
    
    try {
      const entries = fs.readdirSync(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        
        // Skip excluded patterns
        if (this.matchesPatterns(entry.name, excludePatterns)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this.findComponentNames(
            entryPath,
            pattern,
            includePatterns,
            excludePatterns,
            componentNames,
            depth - 1
          );
        } else if (entry.isFile()) {
          // Skip files that don't match include patterns
          if (!this.matchesPatterns(entry.name, includePatterns)) {
            continue;
          }
          
          try {
            // Read file content
            const content = fs.readFileSync(entryPath, 'utf8');
            
            // Use regex to find component names
            const regex = new RegExp(pattern, 'g');
            const matches = content.match(regex);
            
            if (matches) {
              matches.forEach(match => {
                // Clean up the match as needed
                const componentName = match.trim();
                componentNames.add(componentName);
              });
            }
          } catch (error) {
            console.error(`Error reading file ${entryPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error finding component names in ${directory}:`, error);
    }
  }
  
  /**
   * Analyze documentation files to extract component claims
   * @param docsDirectory Documentation directory
   * @param filePattern Pattern for documentation files
   * @returns Map of component names to claimed status
   */
  public async analyzeDocumentation(
    docsDirectory: string,
    filePattern: string
  ): Promise<Map<string, ComponentStatusType>> {
    const results = new Map<string, ComponentStatusType>();
    
    try {
      await this.scanDocumentation(
        docsDirectory,
        filePattern,
        results,
        5 // Max depth
      );
      
      return results;
    } catch (error) {
      console.error(`Error analyzing documentation in ${docsDirectory}:`, error);
      return results;
    }
  }
  
  /**
   * Scan documentation files recursively
   * @param directory Directory to scan
   * @param filePattern Pattern for documentation files
   * @param results Map to update with results
   * @param depth Maximum recursion depth
   */
  private async scanDocumentation(
    directory: string,
    filePattern: string,
    results: Map<string, ComponentStatusType>,
    depth: number
  ): Promise<void> {
    if (depth <= 0) return;
    
    try {
      const entries = fs.readdirSync(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this.scanDocumentation(
            entryPath,
            filePattern,
            results,
            depth - 1
          );
        } else if (entry.isFile() && this.matchesPatterns(entry.name, [filePattern])) {
          try {
            // Read file content
            const content = fs.readFileSync(entryPath, 'utf8');
            
            // Extract component status claims
            // This is a simplistic approach - a real implementation would be more sophisticated
            
            // Look for component names and status indicators
            const completeMatch = /([A-Za-z0-9_]+)(?:.*?)(?:COMPLETE|COMPLETED|IMPLEMENTED|DONE)/g;
            const partialMatch = /([A-Za-z0-9_]+)(?:.*?)(?:PARTIAL|PARTIALLY|IN PROGRESS)/g;
            const minimalMatch = /([A-Za-z0-9_]+)(?:.*?)(?:MINIMAL|STARTED|BEGINNING)/g;
            const plannedMatch = /([A-Za-z0-9_]+)(?:.*?)(?:PLANNED|PLAN|TODO|SCHEDULED)/g;
            
            // Find all matches
            let match;
            
            // Check for COMPLETE components
            while ((match = completeMatch.exec(content)) !== null) {
              const componentName = match[1].trim();
              results.set(componentName, 'COMPLETE');
            }
            
            // Check for PARTIAL components
            while ((match = partialMatch.exec(content)) !== null) {
              const componentName = match[1].trim();
              if (!results.has(componentName)) {
                results.set(componentName, 'PARTIAL');
              }
            }
            
            // Check for MINIMAL components
            while ((match = minimalMatch.exec(content)) !== null) {
              const componentName = match[1].trim();
              if (!results.has(componentName)) {
                results.set(componentName, 'MINIMAL');
              }
            }
            
            // Check for PLANNED components
            while ((match = plannedMatch.exec(content)) !== null) {
              const componentName = match[1].trim();
              if (!results.has(componentName)) {
                results.set(componentName, 'PLANNED');
              }
            }
          } catch (error) {
            console.error(`Error reading documentation file ${entryPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning documentation in ${directory}:`, error);
    }
  }
  
  /**
   * Compare documentation claims with actual implementation
   * @param documentedComponents Map of component names to claimed status
   * @param scanResults Map of component names to scan results
   * @returns Map of component names to discrepancy details
   */
  public compareDocumentationWithImplementation(
    documentedComponents: Map<string, ComponentStatusType>,
    scanResults: Map<string, ScanResult>
  ): Map<string, { documented: ComponentStatusType, actual: ComponentStatusType, match: boolean }> {
    const results = new Map<string, { documented: ComponentStatusType, actual: ComponentStatusType, match: boolean }>();
    
    // Check all documented components
    for (const [componentName, documentedStatus] of documentedComponents.entries()) {
      const scanResult = scanResults.get(componentName);
      
      if (scanResult) {
        // Component exists in both documentation and implementation
        const actualStatus = scanResult.suggestedStatus;
        results.set(componentName, {
          documented: documentedStatus,
          actual: actualStatus,
          match: documentedStatus === actualStatus
        });
      } else {
        // Component exists in documentation but not in implementation
        results.set(componentName, {
          documented: documentedStatus,
          actual: 'MISSING',
          match: false
        });
      }
    }
    
    // Check for components that exist in implementation but not in documentation
    for (const [componentName, scanResult] of scanResults.entries()) {
      if (!documentedComponents.has(componentName)) {
        results.set(componentName, {
          documented: 'MISSING',
          actual: scanResult.suggestedStatus,
          match: false
        });
      }
    }
    
    return results;
  }
}

// Export default instance
export const componentScanner = new ComponentScanner();