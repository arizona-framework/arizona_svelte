/**
 * Arizona Svelte Integration
 * Main class for Svelte component management with automatic lifecycle monitoring
 *
 * @example
 * import ArizonaSvelte from '@arizona-framework/svelte';
 * import Counter from './svelte/components/Counter.svelte';
 * import HelloWorld from './svelte/components/HelloWorld.svelte';
 *
 * // Option 1: Register components in constructor
 * const arizonaSvelte = new ArizonaSvelte({
 *   components: {
 *     Counter,
 *     HelloWorld
 *   }
 * });
 *
 * // Option 2: Register components later
 * const arizonaSvelte = new ArizonaSvelte();
 * arizonaSvelte.registerComponents({ Counter, HelloWorld });
 *
 * // Start monitoring
 * arizonaSvelte.startMonitoring();
 */

import { ArizonaSvelteRegistry } from './arizona-svelte-registry.js';
import { ArizonaSvelteLifecycle } from './arizona-svelte-lifecycle.js';

/**
 * Main Arizona Svelte integration class
 */
class ArizonaSvelte {
  /**
   * Create a new ArizonaSvelte instance
   * @param {Object} [options={}] - Configuration options
   * @param {Object.<string, Function>} [options.components] - Components to register on instantiation
   */
  constructor(options = {}) {
    this.registry = new ArizonaSvelteRegistry();
    this.lifecycle = new ArizonaSvelteLifecycle(this.registry, options);

    // Register components if provided
    if (options.components) {
      this.registerComponents(options.components);
    }
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

  /**
   * Register multiple components at once
   * @param {Object.<string, Function>} components - Object mapping component names to component classes
   * @returns {number} Number of components registered
   * @example
   * arizonaSvelte.registerComponents({
   *   Counter: CounterComponent,
   *   HelloWorld: HelloWorldComponent,
   *   Dashboard: DashboardComponent
   * });
   */
  registerComponents(components) {
    return this.registry.registerComponents(components);
  }
}

export default ArizonaSvelte;
