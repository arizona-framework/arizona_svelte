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
-export([render_component/3]).

%% --------------------------------------------------------------------
%% Ignore xref warnings
%% --------------------------------------------------------------------

-ignore_xref([render_component/2]).
-ignore_xref([render_component/3]).

%% --------------------------------------------------------------------
%% API Functions
%% --------------------------------------------------------------------

-doc #{equiv => render_component(Component, Props, ~"")}.
-spec render_component(Component, Props) -> Callback when
    Component :: arizona_svelte_template:component(),
    Props :: arizona_svelte_template:properties(),
    Callback :: arizona_template:render_callback().
render_component(Component, Props) ->
    render_component(Component, Props, ~"").

-doc ~""""
Render a Svelte component within an Arizona template with optional custom attributes.

Generates the appropriate HTML structure with data attributes that the
JavaScript side monitors for automatic component mounting and lifecycle
management.

## Parameters

- `Component` - Binary string identifying the Svelte component (matches .svelte filename)
- `Props` - Map of component properties with JSON-serializable values
- `Attrs` - (Optional) Custom HTML attributes as Arizona template or rendered value

## Returns

Arizona template render callback that generates HTML with the following structure:

```html
<div
  data-svelte-component="ComponentName"
  data-svelte-props='{"prop1":"value1","prop2":"value2"}'
  data-arizona-update="false"
  [custom attributes here]
></div>
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

%% With custom attributes (simple string)
{arizona_svelte:render_component("Card", #{}, ~"class=\"flex-1 p-4\" id=\"main-card\"")}

%% With dynamic attributes (Arizona template)
{arizona_svelte:render_component("Widget", #{}, arizona_template:from_string(~"""
    class="widget"
    {case arizona_template:get_binding(hidden, Bindings) of
        true -> ~"hidden";
        false -> ~""
    end}
"""))}

%% For flexbox/grid layouts, use display: contents to make wrapper transparent
{arizona_svelte:render_component("Navigation", #{}, ~"style=\"display: contents\"")}
```

## Custom Attributes for Layout

The wrapper div can interfere with flexbox/grid layouts. Add custom attributes
to control styling and layout behavior:

```erlang
%% Make wrapper transparent to layout (component children become direct flex items)
{arizona_svelte:render_component("FlexItem", #{}, ~"style=\"display: contents\"")}

%% Add flex/grid classes
{arizona_svelte:render_component("Card", #{}, ~"class=\"flex-1\"")}
{arizona_svelte:render_component("GridItem", #{}, ~"class=\"col-span-2\"")}
```

**Note:** `display: contents` has accessibility limitations with buttons and
certain ARIA roles. Test with screen readers if accessibility is critical.

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
"""".
-spec render_component(Component, Props, Attrs) -> Callback when
    Component :: arizona_svelte_template:component(),
    Props :: arizona_svelte_template:properties(),
    Attrs :: arizona_svelte_template:attributes(),
    Callback :: arizona_template:render_callback().
render_component(Component, Props, Attrs) ->
    arizona_svelte_template:render_component(Component, Props, Attrs).
