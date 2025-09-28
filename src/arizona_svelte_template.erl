-module(arizona_svelte_template).
-moduledoc ~"""
Svelte component template rendering implementation.

Handles the core logic for rendering Svelte components as Arizona templates.
This module generates the appropriate HTML structure with data attributes
that the JavaScript side uses for component mounting and lifecycle management.

## Component Rendering Process

1. Accept component name and props from `arizona_svelte:render_component/2`
2. Generate HTML div with required data attributes:
   - `data-svelte-component` - Component name for JavaScript discovery
   - `data-svelte-props` - JSON-encoded props (evaluated once only)
   - `data-arizona-update="false"` - Prevents Arizona DOM updates
3. Return Arizona template callback for rendering

## Critical: One-time Property Evaluation

Properties containing `arizona_template:get_binding/2` calls are evaluated
only once during the initial render. Arizona will NOT track binding changes
for Svelte components due to `data-arizona-update="false"`.

## Type Definitions

- `component/0` - Binary string identifying the Svelte component
- `props/0` - Map of component properties with JSON-serializable values

## Example Generated HTML

```html
<div
  data-svelte-component="Counter"
  data-svelte-props='{"title":"My Counter","initialCount":5}'
  data-arizona-update="false"
></div>
```
""".

%% --------------------------------------------------------------------
%% API function exports
%% --------------------------------------------------------------------

-export([render_component/2]).

%% --------------------------------------------------------------------
%% Types exports
%% --------------------------------------------------------------------

-export_type([component/0, props/0]).

%% --------------------------------------------------------------------
%% Types definitions
%% --------------------------------------------------------------------

-doc ~"""
Svelte component identifier.

Binary string that matches the filename of a Svelte component (without .svelte extension).
For example: `<<"Counter">>` for `Counter.svelte`.
""".
-nominal component() :: binary().

-doc ~"""
Component properties for Svelte component.

Map of properties passed to the Svelte component. Keys can be atoms or binaries,
values must be JSON-serializable. These props become available in the Svelte
component via the `$props()` rune.
""".
-nominal props() :: #{atom() | binary() => json:encode_value()}.

%% --------------------------------------------------------------------
%% API Functions
%% --------------------------------------------------------------------

-doc ~"""
Internal implementation for rendering Svelte components as Arizona templates.

This function handles the core logic of component rendering by delegating to
the `arizona_svelte_components` module to generate the appropriate HTML structure.
It ensures that the generated element has the `update => false` option to prevent
Arizona from interfering with Svelte's DOM management.

## Implementation Details

1. Calls `arizona_template:render_stateless/4` with the component template
2. Passes component name and props as bindings to the template
3. Sets `#{update => false}` to prevent Arizona DOM updates
4. Returns Arizona template callback for rendering

## Parameters

- `Component` - Svelte component identifier (binary)
- `Props` - Component properties map with JSON-serializable values

## Returns

Arizona template render callback that generates the component HTML structure.

## Note

This function is called internally by `arizona_svelte:render_component/2`
and should not be used directly by application code.
""".
-spec render_component(Component, Props) -> Callback when
    Component :: component(),
    Props :: props(),
    Callback :: arizona_template:render_callback().
render_component(Component, Props) ->
    arizona_template:render_stateless(
        arizona_svelte_components,
        component,
        #{
            component => Component,
            props => Props
        },
        #{update => false}
    ).
