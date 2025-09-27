import Arizona from '@arizona-framework/client';
import App from '../svelte/App.svelte';
import Counter from '../svelte/Counter.svelte';
import { mount } from 'svelte';

const arizona = new Arizona({ logLevel: 'debug' });
arizona.connect({ wsPath: '/live' });

function mountSvelteComponents() {
  const svelteTargets = document.querySelectorAll('[data-svelte-component]');
  svelteTargets.forEach(target => {
    const componentName = target.dataset.svelteComponent;
    const props = target.dataset.svelteProps ? JSON.parse(target.dataset.svelteProps) : {};

    if (componentName === 'App') {
      mount(App, { target, props });
    } else if (componentName === 'Counter') {
      mount(Counter, { target, props });
    }
  });
}

mountSvelteComponents();
