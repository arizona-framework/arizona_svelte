-module(arizona_svelte).
-export([render_component/2]).

render_component(Component, Props) ->
    arizona_svelte_template:render_component(Component, Props).
