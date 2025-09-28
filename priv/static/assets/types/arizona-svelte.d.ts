import { ArizonaSvelteRegistry } from './arizona-svelte-registry.js';
import { ArizonaSvelteDiscovery } from './arizona-svelte-discovery.js';
import { ArizonaSvelteLifecycle } from './arizona-svelte-lifecycle.js';
export default ArizonaSvelte;
/**
 * Main Arizona Svelte integration class
 */
declare class ArizonaSvelte {
    /**
     * Create a new ArizonaSvelte instance
     * @param {Object} [options={}] - Configuration options
     * @param {string} [options.componentsDir] - Directory to search for Svelte components
     * @param {string} [options.pattern] - File pattern for component discovery
     */
    constructor(options?: {
        componentsDir?: string | undefined;
        pattern?: string | undefined;
    });
    registry: ArizonaSvelteRegistry;
    discovery: ArizonaSvelteDiscovery;
    lifecycle: ArizonaSvelteLifecycle;
    /**
     * Initialize component discovery and registration
     * @returns {Promise<number>} Number of components registered
     */
    init(): Promise<number>;
    /**
     * Get a component by name
     * @param {string} name - Component name
     * @returns {Function|null} Svelte component class or null if not found
     */
    getComponent(name: string): Function | null;
    /**
     * Check if a component is registered
     * @param {string} name - Component name
     * @returns {boolean}
     */
    hasComponent(name: string): boolean;
    /**
     * Get all registered component names
     * @returns {string[]}
     */
    getComponentNames(): string[];
    /**
     * Get the registry instance
     * @returns {ArizonaSvelteRegistry}
     */
    getRegistry(): ArizonaSvelteRegistry;
    /**
     * Get the discovery instance
     * @returns {ArizonaSvelteDiscovery}
     */
    getDiscovery(): ArizonaSvelteDiscovery;
    /**
     * Get the lifecycle instance
     * @returns {ArizonaSvelteLifecycle}
     */
    getLifecycle(): ArizonaSvelteLifecycle;
    /**
     * Mount Svelte components from DOM
     * @returns {Promise<number>} Number of components mounted
     */
    mountComponents(): Promise<number>;
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
    startMonitoring(options?: {
        autoMount?: boolean | undefined;
        autoUnmount?: boolean | undefined;
        observeSubtree?: boolean | undefined;
        debounceMs?: number | undefined;
    }): Promise<void>;
    /**
     * Stop automatic monitoring
     * @returns {void}
     */
    stopMonitoring(): void;
    /**
     * Check if monitoring is active
     * @returns {boolean}
     */
    isMonitoring(): boolean;
}
