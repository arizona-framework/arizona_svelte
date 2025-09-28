/**
 * Svelte Components Auto-Discovery
 * Automatically discovers and registers Svelte components using Vite's import.meta.glob
 *
 * @example
 * const discovery = new ArizonaSvelteDiscovery({ registry });
 * await discovery.discoverAndRegister();
 */

/**
 * Component discovery system for Svelte components
 */
class ArizonaSvelteDiscovery {
  /**
   * Create a new discovery instance
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.componentsDir] - Directory to search for components
   * @param {string} [options.pattern] - File pattern for component discovery
   * @param {ArizonaSvelteRegistry} options.registry - Registry instance for component registration
   */
  constructor(options = {}) {
    this.componentsDir = options.componentsDir || '../svelte/components';
    this.pattern = options.pattern || '*.svelte';
    this.registry = options.registry;
    this.componentModules = null;
  }

  /**
   * Discover components using import.meta.glob
   * @returns {Promise<Object>} Map of component paths to modules
   */
  async discoverComponents() {
    // Use static glob pattern for Vite compatibility
    this.componentModules = import.meta.glob('../svelte/components/*.svelte', { eager: true });

    return this.componentModules;
  }

  /**
   * Register all discovered components with the registry
   * @param {Object|null} [componentModules=null] - Optional modules object, uses discovered if not provided
   * @returns {number} Number of components registered
   * @throws {Error} If no components have been discovered
   */
  registerComponents(componentModules = null) {
    const modules = componentModules || this.componentModules;

    if (!modules) {
      throw new Error('No components discovered. Run discoverComponents() first.');
    }

    Object.entries(modules).forEach(([path, module]) => {
      // Extract component name from file path
      const componentName = this.extractComponentName(path);

      // Register the component (module.default contains the Svelte component)
      this.registry.registerComponent(componentName, module.default);
    });

    console.log(
      `[Arizona Svelte] Auto-discovered and registered ${Object.keys(modules).length} components`
    );
    return Object.keys(modules).length;
  }

  /**
   * Extract component name from file path
   * @param {string} path - File path
   * @returns {string} Component name
   */
  extractComponentName(path) {
    return path.split('/').pop().replace('.svelte', '');
  }

  /**
   * Discover and register components in one call
   * @returns {Promise<number>} Number of components registered
   */
  async discoverAndRegister() {
    await this.discoverComponents();
    return this.registerComponents();
  }

  /**
   * Get discovered component modules
   * @returns {Object|null} Component modules or null if not discovered
   */
  getComponentModules() {
    return this.componentModules;
  }
}

// Export the class only
export { ArizonaSvelteDiscovery };
