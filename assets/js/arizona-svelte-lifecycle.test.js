import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArizonaSvelteLifecycle } from './arizona-svelte-lifecycle.js';
import { ArizonaSvelteRegistry } from './arizona-svelte-registry.js';

// Mock DOM globals
global.document = {
  querySelectorAll: vi.fn(() => {
    return [];
  }),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

global.MutationObserver = vi.fn(() => {
  return {
    observe: vi.fn(),
    disconnect: vi.fn(),
  };
});

describe('ArizonaSvelteLifecycle', () => {
  let lifecycle;
  let registry;

  beforeEach(() => {
    registry = new ArizonaSvelteRegistry();
    lifecycle = new ArizonaSvelteLifecycle(registry);
  });

  it('should create lifecycle instance', () => {
    expect(lifecycle).toBeInstanceOf(ArizonaSvelteLifecycle);
    expect(lifecycle.registry).toBe(registry);
  });

  it('should have default options', () => {
    expect(lifecycle.options.autoMount).toBe(true);
    expect(lifecycle.options.autoUnmount).toBe(true);
    expect(lifecycle.options.observeSubtree).toBe(true);
    expect(lifecycle.options.debounceMs).toBe(0);
  });

  it('should track monitoring state', () => {
    expect(lifecycle.isMonitoringActive()).toBe(false);
  });

  it('should have scan and mount method', () => {
    expect(typeof lifecycle.scanAndMount).toBe('function');
  });

  it('should unmount all components', () => {
    const result = lifecycle.unmountAllComponents();
    expect(typeof result).toBe('number');
  });
});
