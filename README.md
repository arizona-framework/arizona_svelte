# Arizona Svelte

Svelte integration library for the Arizona Framework - seamlessly embed Svelte
components in Arizona applications with automatic lifecycle management.

## Installation

### Erlang (Hex Package)

Add to your `rebar.config`:

```erlang
{deps, [
    arizona,
    arizona_svelte
]}.
```

### JavaScript (NPM Package)

```bash
npm install @arizona-framework/svelte svelte
```

## Creating a New Arizona Svelte App

The easiest way to get started is using the `rebar3_arizona` plugin to
create a new app with Svelte template:

### Option 1: Interactive CLI

```bash
rebar3 arizona
# Choose "Create new app"
# Enter an app name
# Select the "Svelte template"
```

### Option 2: Direct Command

```bash
rebar3 new arizona.svelte my_svelte_app
```

### Setup and Run

```bash
cd my_svelte_app
npm install    # Install dependencies
npm run build  # Build CSS and JS
rebar3 shell   # Start the Arizona server
```

Your app will be available at <http://localhost:1912> with hot-reloading
for both CSS and Svelte components.

The Svelte template includes:

- Svelte 5 with modern `$state` and `$effect` runes
- Vite build system and Tailwind CSS
- Example HelloWorld and Counter components
- Full integration with Arizona's real-time WebSocket updates

## Manual Integration (Existing Projects)

If you want to add Svelte to an existing Arizona project, follow the
installation and quick start sections below.

## Quick Start

### 1. Erlang Side - Render Components

```erlang
% In your Arizona view module
-module(my_view).
-export([render/1, my_page/1]).

my_page(_Bindings) ->
    arizona_template:from_html(~"""
    <div>
        <h1>My Arizona + Svelte App</h1>

        {% Render a Svelte component }
        {arizona_svelte:render_component("Counter", #{
            title => "My Counter",
            initialCount => 5
        })}

        {% Render another component with Arizona bindings }
        {arizona_svelte:render_component("HelloWorld", #{
            name => arizona_template:get_binding(user_name, Bindings)
        })}
    </div>
    """).
```

### 2. JavaScript Side - Register Components and Initialize

```javascript
// assets/js/main.js
import ArizonaSvelte from '@arizona-framework/svelte';
import Counter from '../svelte/components/Counter.svelte';
import HelloWorld from '../svelte/components/HelloWorld.svelte';

// Option 1: Register components in constructor (recommended)
const arizonaSvelte = new ArizonaSvelte({
  components: {
    Counter,
    HelloWorld
  }
});

// Option 2: Register components manually
// const arizonaSvelte = new ArizonaSvelte();
// arizonaSvelte.registerComponents({
//   Counter,
//   HelloWorld
// });

// Start automatic component lifecycle monitoring
arizonaSvelte.startMonitoring({
    autoMount: true,      // Automatically mount components found in DOM
    autoUnmount: true,    // Automatically unmount removed components
    observeSubtree: true, // Monitor entire DOM tree
    debounceMs: 0         // No delay for immediate responsiveness
});

// Make available globally for debugging
globalThis.arizonaSvelte = arizonaSvelte;
```

### Alternative: Using an Index File

Create a centralized component index:

```javascript
// svelte/components/index.js
export { default as Counter } from './Counter.svelte';
export { default as HelloWorld } from './HelloWorld.svelte';
export { default as Dashboard } from './Dashboard.svelte';
```

Then import all at once:

```javascript
// assets/js/main.js
import ArizonaSvelte from '@arizona-framework/svelte';
import * as components from '../svelte/components/index.js';

const arizonaSvelte = new ArizonaSvelte({ components });
arizonaSvelte.startMonitoring();
```

### 3. Create Your Svelte Components

```svelte
<!-- assets/svelte/components/Counter.svelte -->
<script>
  let { title, initialCount = 0 } = $props();
  let count = $state(initialCount);
</script>

<div class="counter">
  <h2>{title}</h2>
  <p>Count: {count}</p>
  <button onclick={() => count++}>+</button>
  <button onclick={() => count--}>-</button>
</div>
```

## Understanding Wrapper Elements

Components are rendered inside a wrapper `<div>` element that serves as the mount
target for Svelte components. This wrapper is necessary for the JavaScript side
to discover and manage component lifecycle.

### DOM Structure Example

When you render a component:

```erlang
arizona_svelte:render_component("Counter", #{initialCount => 5})
```

The resulting DOM structure is:

```html
<!-- Wrapper element (created by Arizona) -->
<div
  data-svelte-component="Counter"
  data-svelte-props='{"initialCount":5}'
  data-arizona-update="false"
>
  <!-- Component content (rendered by Svelte) -->
  <div class="counter">
    <h2>Count: 5</h2>
    <button>Increment</button>
  </div>
</div>
```

**Why the wrapper exists:**

- `data-svelte-component` - JavaScript identifies which component to mount
- `data-svelte-props` - Props are passed to the component
- `data-arizona-update="false"` - Prevents Arizona from interfering with Svelte's
  DOM management
- Provides a stable mount target for component lifecycle management

### Customizing Wrapper Elements

You can add custom HTML attributes to the wrapper for styling and layout control.

### Basic Usage

```erlang
% Simple string attributes
arizona_svelte:render_component("Card", #{}, ~"class=\"flex-1 p-4\" id=\"main-card\"")
```

### Dynamic Attributes with Arizona Templates

```erlang
% Conditional attributes based on bindings
arizona_svelte:render_component("Widget", #{}, arizona_template:from_string(~"""
    class="widget"
    {case arizona_template:get_binding(hidden, Bindings) of
        true -> ~"hidden";
        false -> ~""
    end}
"""))
```

### Layout: Making Wrappers Transparent

The wrapper div can interfere with flexbox/grid layouts:

```erlang
% Without custom attributes - wrapper breaks layout
<div class="flex gap-4">
  {arizona_svelte:render_component("Card", #{})}
  {arizona_svelte:render_component("Card", #{})}
</div>
```

**Problem:** The wrapper `<div>` becomes the flex child, not the Card component itself.

```html
<!-- Resulting DOM - wrapper is the flex child -->
<div class="flex gap-4">
  <div data-svelte-component="Card">  <!-- This is the flex child -->
    <div class="card">...</div>       <!-- Card content is nested -->
  </div>
  <div data-svelte-component="Card">
    <div class="card">...</div>
  </div>
</div>
```

**Solution:** Use `display: contents` to make the wrapper transparent to layout:

```erlang
% Wrapper becomes invisible - parent sees Card's children directly
<div class="flex gap-4">
  {arizona_svelte:render_component("Card", #{}, ~"style=\"display: contents\"")}
  {arizona_svelte:render_component("Card", #{}, ~"style=\"display: contents\"")}
</div>
```

```html
<!-- Resulting behavior - Card's root is the flex child -->
<div class="flex gap-4">
  <div data-svelte-component="Card" style="display: contents">
    <div class="card">...</div>  <!-- This behaves as the flex child -->
  </div>
  <div data-svelte-component="Card" style="display: contents">
    <div class="card">...</div>
  </div>
</div>
```

**Other layout options:**

```erlang
% Add flex/grid classes to the wrapper itself
arizona_svelte:render_component("Card", #{}, ~"class=\"flex-1\"")
arizona_svelte:render_component("GridItem", #{}, ~"class=\"col-span-2\"")
```

**Note:** `display: contents` has
[accessibility limitations](https://caniuse.com/css-display-contents) with
buttons and certain ARIA roles. Test with screen readers if accessibility is
critical.

## Features

- **🔄 Automatic Lifecycle Management**: Components mount/unmount automatically
when DOM changes
- **🏗️ Flexible Component Registration**: Register components via constructor or batch methods
- **📡 Real-time Integration**: Works seamlessly with Arizona's WebSocket updates
- **🎯 Simple Setup**: Register components and start monitoring in a few lines
- **🧪 Development Friendly**: Built-in logging and debugging support
- **⚡ High Performance**: Zero-debounce monitoring for immediate responsiveness
- **🎨 Customizable Wrappers**: Add classes, IDs, styles, and dynamic attributes

## Important: State Independence

**Critical Behavior:** Svelte components rendered via `arizona_svelte:render_component/2`
maintain independent state from Arizona. Arizona bindings in component props are
evaluated only once during initial render and are NOT tracked for changes.

```erlang
%% This binding is evaluated once and never updated
{arizona_svelte:render_component("UserDashboard", #{
    userId => arizona_template:get_binding(current_user, Bindings)
})}
```

If `current_user` changes in Arizona state, the Svelte component will NOT automatically
receive the new value. The component maintains its own reactive state using Svelte's
`$state` runes.

## API Reference

### Erlang API

#### `arizona_svelte:render_component/2`

Renders a Svelte component with props.

```erlang
arizona_svelte:render_component(Component, Props) -> Template.
```

- `Component :: binary()` - Name of the Svelte component
- `Props :: #{atom() | binary() => json:encode_value()}` - Component props
- Returns: `arizona_template:render_callback()`

### JavaScript API

#### `new ArizonaSvelte(options?)`

Creates a new Arizona Svelte instance.

**Options:**

- `components: Object` - Components to register on instantiation

```javascript
const arizonaSvelte = new ArizonaSvelte({
  components: {
    Counter: CounterComponent,
    HelloWorld: HelloWorldComponent
  }
});
```

#### `arizonaSvelte.registerComponents(components)`

Register multiple components at once.

```javascript
arizonaSvelte.registerComponents({
  Dashboard: DashboardComponent,
  Modal: ModalComponent
});
```

#### `arizonaSvelte.startMonitoring(options?)`

Starts automatic component lifecycle monitoring.

**Options:**

- `autoMount: boolean` - Auto-mount new components (default: true)
- `autoUnmount: boolean` - Auto-unmount removed components (default: true)
- `observeSubtree: boolean` - Monitor entire DOM tree (default: true)
- `debounceMs: number` - Debounce delay in milliseconds (default: 0)

#### Other Methods

- `arizonaSvelte.stopMonitoring()` - Stop monitoring
- `arizonaSvelte.isMonitoring()` - Check if monitoring is active
- `arizonaSvelte.getRegistry()` - Get component registry
- `arizonaSvelte.getLifecycle()` - Get lifecycle manager
- `arizonaSvelte.getComponent(name)` - Get a specific component
- `arizonaSvelte.hasComponent(name)` - Check if component is registered
- `arizonaSvelte.getComponentNames()` - Get all registered component names

## Requirements

- **Erlang/OTP**: 28+
- **Arizona Framework**
- **Svelte**
- **Node.js**: 18.0.0+

## Sponsors

If you like this tool, please consider [sponsoring me](https://github.com/sponsors/williamthome).
I'm thankful for your never-ending support :heart:

I also accept coffees :coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/williamthome)

## License

Copyright (c) 2025 [William Fank Thomé](https://github.com/williamthome)

Arizona Svelte is 100% open-source and community-driven. All components are
available under the Apache 2 License on [GitHub](https://github.com/arizona-framework/arizona_svelte).

See [LICENSE.md](LICENSE.md) for more information.
