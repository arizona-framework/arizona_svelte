/**
 * Arizona Svelte Integration
 * Main class for Svelte component management with automatic lifecycle monitoring
 *
 * @example
 * import ArizonaSvelte from '@arizona-framework/svelte';
 *
 * const arizonaSvelte = new ArizonaSvelte();
 * arizonaSvelte.startMonitoring();
 */

import { ArizonaSvelteRegistry } from './arizona-svelte-registry.js';
import { ArizonaSvelteDiscovery } from './arizona-svelte-discovery.js';
import { ArizonaSvelteLifecycle } from './arizona-svelte-lifecycle.js';

/**
 * Main Arizona Svelte integration class
 */
class ArizonaSvelte {
  /**
   * Create a new ArizonaSvelte instance
   * @param {Object} [options={}] - Configuration options
   * @param {string} [options.componentsDir] - Directory to search for Svelte components
   * @param {string} [options.pattern] - File pattern for component discovery
   */
  constructor(options = {}) {
    this.registry = new ArizonaSvelteRegistry();
    this.discovery = new ArizonaSvelteDiscovery({
      registry: this.registry,
      componentsDir: options.componentsDir,
      pattern: options.pattern,
    });
    this.lifecycle = new ArizonaSvelteLifecycle(this.registry);
  }

  /**
   * Initialize component discovery and registration
   * @returns {Promise<number>} Number of components registered
   */
  async init() {
    return await this.discovery.discoverAndRegister();
  }

  /**
   * Get a component by name
   * @param {string} name - Component name
   * @returns {Function|null} Svelte component class or null if not found
   */
  getComponent(name) {
    return this.registry.getComponent(name);
  }

  /**
   * Check if a component is registered
   * @param {string} name - Component name
   * @returns {boolean}
   */
  hasComponent(name) {
    return this.registry.hasComponent(name);
  }

  /**
   * Get all registered component names
   * @returns {string[]}
   */
  getComponentNames() {
    return this.registry.getComponentNames();
  }

  /**
   * Get the registry instance
   * @returns {ArizonaSvelteRegistry}
   */
  getRegistry() {
    return this.registry;
  }

  /**
   * Get the discovery instance
   * @returns {ArizonaSvelteDiscovery}
   */
  getDiscovery() {
    return this.discovery;
  }

  /**
   * Get the lifecycle instance
   * @returns {ArizonaSvelteLifecycle}
   */
  getLifecycle() {
    return this.lifecycle;
  }

  /**
   * Mount Svelte components from DOM
   * @returns {Promise<number>} Number of components mounted
   */
  async mountComponents() {
    await this.init(); // Ensure components are discovered
    return await this.lifecycle.mountComponents();
  }

  /**
   * Start automatic monitoring for component lifecycle
   * This will automatically mount/unmount components when DOM changes
   * @param {Object} [options={}] - Monitoring options
   * @param {boolean} [options.autoMount=true] - Automatically mount new components
   * @param {boolean} [options.autoUnmount=true] - Automatically unmount removed components
   * @param {boolean} [options.observeSubtree=true] - Monitor entire DOM tree
   * @param {number} [options.debounceMs=0] - Debounce delay in milliseconds
   * @returns {Promise<void>}
   * @example
   * arizonaSvelte.startMonitoring({
   *   autoMount: true,
   *   autoUnmount: true,
   *   debounceMs: 0
   * });
   */
  async startMonitoring(options = {}) {
    await this.init(); // Ensure components are discovered
    this.lifecycle.updateMonitoringOptions(options);
    this.lifecycle.startMonitoring();
  }

  /**
   * Stop automatic monitoring
   * @returns {void}
   */
  stopMonitoring() {
    this.lifecycle.stopMonitoring();
  }

  /**
   * Check if monitoring is active
   * @returns {boolean}
   */
  isMonitoring() {
    return this.lifecycle.isMonitoringActive();
  }
}

export default ArizonaSvelte;
