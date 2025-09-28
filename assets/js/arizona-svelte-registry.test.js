import { describe, it, expect, beforeEach } from 'vitest';
import { ArizonaSvelteRegistry } from './arizona-svelte-registry.js';

describe('ArizonaSvelteRegistry', () => {
  let registry;

  beforeEach(() => {
    registry = new ArizonaSvelteRegistry();
  });

  it('should create an empty registry', () => {
    expect(registry.getComponentNames()).toEqual([]);
    expect(registry.hasComponent('Test')).toBe(false);
    expect(registry.getComponent('Test')).toBe(null);
  });

  it('should register and retrieve components', () => {
    const mockComponent = class TestComponent {};

    registry.registerComponent('Test', mockComponent);

    expect(registry.hasComponent('Test')).toBe(true);
    expect(registry.getComponent('Test')).toBe(mockComponent);
    expect(registry.getComponentNames()).toEqual(['Test']);
  });

  it('should unregister components', () => {
    const mockComponent = class TestComponent {};

    registry.registerComponent('Test', mockComponent);
    expect(registry.unregisterComponent('Test')).toBe(true);
    expect(registry.hasComponent('Test')).toBe(false);
    expect(registry.unregisterComponent('NonExistent')).toBe(false);
  });

  it('should clear all components', () => {
    registry.registerComponent('Test1', class {});
    registry.registerComponent('Test2', class {});

    registry.clear();

    expect(registry.getComponentNames()).toEqual([]);
  });

  it('should register multiple components at once', () => {
    const components = {
      Counter: class Counter {},
      HelloWorld: class HelloWorld {},
      Dashboard: class Dashboard {},
    };

    const count = registry.registerComponents(components);

    expect(count).toBe(3);
    expect(registry.hasComponent('Counter')).toBe(true);
    expect(registry.hasComponent('HelloWorld')).toBe(true);
    expect(registry.hasComponent('Dashboard')).toBe(true);
    expect(registry.getComponentNames()).toEqual(['Counter', 'HelloWorld', 'Dashboard']);
  });
});
