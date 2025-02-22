/**
 * Checks if a module is being run directly (as main module) or being imported
 * @param mod The module to check
 * @returns true if the module is the main module, false otherwise
 */
export function isMainModule(mod: NodeModule): boolean {
    return require.main === mod;
}