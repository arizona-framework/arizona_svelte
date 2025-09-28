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

### 2. JavaScript Side - Initialize Svelte Integration

```javascript
// assets/js/main.js
import ArizonaSvelte from '@arizona-framework/svelte';

// Initialize Arizona Svelte
const arizonaSvelte = new ArizonaSvelte();

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

## Features

- **🔄 Automatic Lifecycle Management**: Components mount/unmount automatically
when DOM changes
- **🏗️ Component Discovery**: Auto-discovers and registers Svelte components
- **📡 Real-time Integration**: Works seamlessly with Arizona's WebSocket updates
- **🎯 Minimal Configuration**: Just install and start monitoring
- **🧪 Development Friendly**: Built-in logging and debugging support
- **⚡ High Performance**: Zero-debounce monitoring for immediate responsiveness

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
