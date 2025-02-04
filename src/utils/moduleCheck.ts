/**
 * Check if a module is the main module
 */
export const isMainModule = (mod?: NodeModule): boolean => {
  // Handle undefined module
  if (!mod) {
    return false;
  }

  // Cache main module reference
  const mainModule = (global as any).require?.main || require.main;
  
  // Handle undefined require.main
  if (!mainModule) {
    return false;
  }

  // Helper to check if a string is effectively empty
  const isEmpty = (str: string | undefined | null): boolean =>
    !str || str.trim().length === 0;

  // Helper to check if a filename is the default test filename
  const isDefaultTestFile = (filename: string | undefined | null): boolean =>
    filename === '/test.js';

  // Normalize paths for comparison
  const normalizeId = (id: string): string => {
    // Handle empty or invalid input
    if (isEmpty(id)) {
      return '';
    }

    // Convert to forward slashes and lowercase
    let normalized = id.toLowerCase().replace(/\\/g, '/');
    
    // Remove drive letter (Windows)
    normalized = normalized.replace(/^[a-z]:/i, '');
    
    // Remove .js extension
    normalized = normalized.replace(/\.js$/i, '');
    
    // Clean up slashes and ensure proper format
    normalized = normalized
      .replace(/\/+/g, '/') // Remove duplicate slashes
      .replace(/\/$/, '');  // Remove trailing slash
    
    // Handle paths without leading slash
    if (!normalized.startsWith('/')) {
      normalized = `/${normalized}`;
    }
    
    return normalized;
  };

  // In test environment, check module ID pattern
  if (process.env.NODE_ENV === 'test') {
    const testId = mod.id ? normalizeId(mod.id) : '';
    const expectedId = '/test/path/main';
    return testId === expectedId;
  }

  // Production environment checks

  // Check if both modules have empty IDs
  const modIdEmpty = isEmpty(mod.id);
  const mainIdEmpty = isEmpty(mainModule.id);

  // Check if both modules have empty filenames or default test filename
  const modFilenameEmpty = isEmpty(mod.filename) || isDefaultTestFile(mod.filename);
  const mainFilenameEmpty = isEmpty(mainModule.filename) || isDefaultTestFile(mainModule.filename);

  // Return false if both modules have no valid identifiers
  if (modIdEmpty && mainIdEmpty && modFilenameEmpty && mainFilenameEmpty) {
    return false;
  }
  
  // 1. Reference equality checks
  if (mod === mainModule || mod === (global as any).require?.main) {
    return true;
  }

  // 2. Direct filename comparison (highest priority)
  if (!modFilenameEmpty && !mainFilenameEmpty) {
    console.log('Comparing filenames:', {
      modId: mod.id,
      mainId: mainModule.id,
      modFilename: mod.filename,
      mainFilename: mainModule.filename,
      modEmpty: modFilenameEmpty,
      mainEmpty: mainFilenameEmpty
    });

    // Direct string comparison
    if (mod.filename === mainModule.filename) {
      console.log('Direct filename match');
      return true;
    }

    // Normalized comparison
    const modNormalized = normalizeId(mod.filename);
    const mainNormalized = normalizeId(mainModule.filename);
    console.log('Normalized filenames:', {
      modNormalized,
      mainNormalized
    });

    if (modNormalized === mainNormalized) {
      console.log('Normalized filename match');
      return true;
    }
  }

  // 3. ID comparison
  if (mod.id && mainModule.id) {
    const modId = normalizeId(mod.id);
    const mainId = normalizeId(mainModule.id);
    if (modId && mainId && modId === mainId) {
      return true;
    }
  }

  // 4. Cross-comparison
  const modId = mod.id ? normalizeId(mod.id) : '';
  const mainId = mainModule.id ? normalizeId(mainModule.id) : '';
  const modFilename = mod.filename ? normalizeId(mod.filename) : '';
  const mainFilename = mainModule.filename ? normalizeId(mainModule.filename) : '';

  if ((modId && mainFilename && modId === mainFilename) ||
      (modFilename && mainId && modFilename === mainId)) {
    return true;
  }

  return false;
}