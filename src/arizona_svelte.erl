-module(arizona_svelte).
-moduledoc ~""""
Arizona Svelte Integration - Core API for embedding Svelte components.

Provides the main API for rendering Svelte components within Arizona
templates. This module serves as the entry point for Arizona Svelte
integration, offering a clean interface for component rendering.

## Component Integration

Svelte components are rendered using data attributes that the JavaScript
side monitors for automatic mounting and lifecycle management:

- `data-svelte-component` - Component name to mount
- `data-svelte-props` - JSON-encoded props for the component
- `data-arizona-update="false"` - Prevents Arizona from updating this element

## Example

```erlang
%% In your Arizona view module:
my_page(Bindings) ->
    arizona_template:from_html(~"""
    <div>
        <h1>My App</h1>
        {arizona_svelte:render_component("Counter", #{
            title => "Page Counter",
            initialCount => arizona_template:get_binding(count, Bindings)
        })}
    </div>
    """).
```

The JavaScript side (`arizona-svelte.js`) automatically discovers and
mounts these components when the DOM updates.
"""".

%% --------------------------------------------------------------------
%% API function exports
%% --------------------------------------------------------------------

-export([render_component/2]).

%% --------------------------------------------------------------------
%% Ignore xref warnings
%% --------------------------------------------------------------------

-ignore_xref([render_component/2]).

%% --------------------------------------------------------------------
%% API Functions
%% --------------------------------------------------------------------

-doc ~"""
Render a Svelte component within an Arizona template.

Generates the appropriate HTML structure with data attributes that the
JavaScript side monitors for automatic component mounting and lifecycle
management.

## Parameters

- `Component` - Binary string identifying the Svelte component (matches .svelte filename)
- `Props` - Map of component properties with JSON-serializable values

## Returns

Arizona template render callback that generates HTML with the following structure:

```html
<div
  data-svelte-component="ComponentName"
  data-svelte-props='{"prop1":"value1","prop2":"value2"}'
  data-arizona-update="false">
</div>
```

## Example

```erlang
%% Render a Counter component with initial props
{arizona_svelte:render_component("Counter", #{
    title => "Page Counter",
    initialCount => 0,
    theme => "dark"
})}

%% Using Arizona bindings (evaluated only once at initial render)
{arizona_svelte:render_component("Counter", #{
    title => "User Counter",
    initialCount => arizona_template:get_binding(user_count, Bindings)
})}

%% Render a simple HelloWorld component
{arizona_svelte:render_component("HelloWorld", #{
    name => "Arizona"
})}
```

## Important: One-time Binding Evaluation

**Critical:** When using `arizona_template:get_binding/2` in component props,
the binding is evaluated only once during the initial component render.
Arizona will NOT track changes to these bindings for Svelte components.

```erlang
%% This binding is evaluated once and never updated
{arizona_svelte:render_component("UserProfile", #{
    userId => arizona_template:get_binding(current_user_id, Bindings),
    theme => arizona_template:get_binding(user_theme, Bindings)
})}
```

If `current_user_id` or `user_theme` change in the Arizona state, the Svelte
component will NOT automatically receive the updated values. The component
maintains its own independent state after initial mounting.

## JavaScript Integration

The generated HTML is automatically discovered by the JavaScript side
(`arizona-svelte.js`) which mounts the appropriate Svelte component
into the div element with the provided props.
""".
-spec render_component(Component, Props) -> Callback when
    Component :: arizona_svelte_template:component(),
    Props :: arizona_svelte_template:props(),
    Callback :: arizona_template:render_callback().
render_component(Component, Props) ->
    arizona_svelte_template:render_component(Component, Props).
