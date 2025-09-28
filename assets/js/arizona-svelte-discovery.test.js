import { describe, it, expect, beforeEach } from 'vitest';
import { ArizonaSvelteDiscovery } from './arizona-svelte-discovery.js';
import { ArizonaSvelteRegistry } from './arizona-svelte-registry.js';

describe('ArizonaSvelteDiscovery', () => {
  let discovery;
  let registry;

  beforeEach(() => {
    registry = new ArizonaSvelteRegistry();
    discovery = new ArizonaSvelteDiscovery({ registry });
  });

  it('should create discovery instance', () => {
    expect(discovery).toBeInstanceOf(ArizonaSvelteDiscovery);
    expect(discovery.registry).toBe(registry);
  });

  it('should discover components (returns empty in test environment)', async () => {
    const modules = await discovery.discoverComponents();
    expect(modules).toEqual({});
  });

  it('should extract component name from path', () => {
    expect(discovery.extractComponentName('../components/Counter.svelte')).toBe('Counter');
    expect(discovery.extractComponentName('HelloWorld.svelte')).toBe('HelloWorld');
  });

  it('should register discovered components', () => {
    const mockModules = {
      './Counter.svelte': { default: class Counter {} },
      './HelloWorld.svelte': { default: class HelloWorld {} },
    };

    const count = discovery.registerComponents(mockModules);

    expect(count).toBe(2);
    expect(registry.hasComponent('Counter')).toBe(true);
    expect(registry.hasComponent('HelloWorld')).toBe(true);
  });
});
