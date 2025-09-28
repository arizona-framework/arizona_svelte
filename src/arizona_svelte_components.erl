-module(arizona_svelte_components).
-moduledoc ~"""
Svelte component template generation for Arizona Svelte integration.

This module contains the template components used internally by the Arizona
Svelte system to generate the proper HTML structure for Svelte component
mounting. It uses Arizona's template DSL to create dynamic HTML with the
required data attributes.

## Template Structure

The `component/1` function generates a div element with three critical data attributes:

1. `data-svelte-component` - Component name from bindings
2. `data-svelte-props` - JSON-encoded props from bindings
3. `data-arizona-update="false"` - Prevents Arizona from updating this element

## JavaScript Integration

The generated HTML is monitored by the JavaScript side (`arizona-svelte.js`)
which automatically:
- Discovers new components via MutationObserver
- Mounts Svelte components into the generated divs
- Manages component lifecycle (mount/unmount)
- Handles props updates

## Internal Use Only

This module is used internally by `arizona_svelte_template:render_component/2`
and should not be called directly by user code.
""".
-compile({parse_transform, arizona_parse_transform}).

%% --------------------------------------------------------------------
%% API function exports
%% --------------------------------------------------------------------

-export([component/1]).

%% --------------------------------------------------------------------
%% Ignore xref warnings
%% --------------------------------------------------------------------

-ignore_xref([component/1]).

%% --------------------------------------------------------------------
%% API Functions
%% --------------------------------------------------------------------

-doc ~"""
Generate HTML template for Svelte component mounting.

Creates a div element with the required data attributes for JavaScript-side
component discovery and mounting. This function uses Arizona's template DSL
to dynamically inject component name and props from the provided bindings.

## Template Generation

The function generates HTML with three critical attributes:

1. `data-svelte-component` - Component name from `component` binding
2. `data-svelte-props` - JSON-encoded props from `props` binding
3. `data-arizona-update="false"` - Prevents Arizona DOM interference

## Bindings Expected

- `component` - Binary string with the Svelte component name
- `props` - Map with component properties (defaults to empty map)

## Generated HTML Example

```html
<div
  data-svelte-component="Counter"
  data-svelte-props='{"title":"My Counter","count":5}'
  data-arizona-update="false">
</div>
```

## Internal Use

This function is called by `arizona_svelte_template:render_component/2`
and should not be invoked directly by application code.
""".
-spec component(Bindings) -> Template when
    Bindings :: arizona_binder:bindings(),
    Template :: arizona_template:template().
component(Bindings) ->
    arizona_template:from_html(~"""
    <div
        data-svelte-component="{arizona_template:get_binding(component, Bindings)}"
        data-svelte-props='{iolist_to_binary(
            json:encode(arizona_template:get_binding(props, Bindings, #{}))
        )}'
        data-arizona-update="false"
    ></div>
    """).
