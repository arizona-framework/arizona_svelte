-module(arizona_svelte_template).
-export([render_component/2]).

render_component(Component, Props) ->
    arizona_template:render_stateless(arizona_svelte_components, component, #{
        component => Component,
        props => Props
    }, #{update => false}).
