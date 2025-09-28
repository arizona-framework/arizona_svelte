import { describe, it, expect, beforeEach } from 'vitest';
import ArizonaSvelte from './arizona-svelte.js';

describe('ArizonaSvelte', () => {
  let arizonaSvelte;

  beforeEach(() => {
    arizonaSvelte = new ArizonaSvelte();
  });

  it('should create an instance', () => {
    expect(arizonaSvelte).toBeInstanceOf(ArizonaSvelte);
  });

  it('should have registry and lifecycle properties', () => {
    expect(arizonaSvelte.getRegistry()).toBeDefined();
    expect(arizonaSvelte.getLifecycle()).toBeDefined();
  });

  it('should register components', () => {
    const mockComponent = class MockComponent {};

    arizonaSvelte.getRegistry().registerComponent('TestComponent', mockComponent);
    expect(arizonaSvelte.getRegistry().hasComponent('TestComponent')).toBe(true);
    expect(arizonaSvelte.getRegistry().getComponent('TestComponent')).toBe(mockComponent);
  });

  it('should return false for monitoring initially', () => {
    expect(arizonaSvelte.isMonitoring()).toBe(false);
  });

  it('should handle component registry operations', () => {
    const registry = arizonaSvelte.getRegistry();

    // Initially empty
    expect(registry.getComponentNames()).toEqual([]);
    expect(registry.hasComponent('NonExistent')).toBe(false);
    expect(registry.getComponent('NonExistent')).toBe(null);

    // After registration
    const mockComponent = class TestComponent {};
    registry.registerComponent('Test', mockComponent);
    expect(registry.getComponentNames()).toEqual(['Test']);
  });

  it('should start with no components registered', () => {
    const newInstance = new ArizonaSvelte();
    expect(newInstance.getRegistry().getComponentNames()).toEqual([]);
  });

  it('should register multiple components at once', () => {
    const components = {
      Counter: class Counter {},
      HelloWorld: class HelloWorld {},
    };

    const count = arizonaSvelte.registerComponents(components);

    expect(count).toBe(2);
    expect(arizonaSvelte.hasComponent('Counter')).toBe(true);
    expect(arizonaSvelte.hasComponent('HelloWorld')).toBe(true);
  });

  it('should register components in constructor', () => {
    const components = {
      Test1: class Test1 {},
      Test2: class Test2 {},
    };

    const instance = new ArizonaSvelte({ components });

    expect(instance.hasComponent('Test1')).toBe(true);
    expect(instance.hasComponent('Test2')).toBe(true);
    expect(instance.getComponentNames()).toEqual(['Test1', 'Test2']);
  });
});
