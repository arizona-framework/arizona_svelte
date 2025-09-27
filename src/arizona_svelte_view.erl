-module(arizona_svelte_view).
-behaviour(arizona_view).
-compile({parse_transform, arizona_parse_transform}).
-export([mount/2]).
-export([render/1]).

mount(#{title := Title}, _Req) ->
    Bindings = #{id => ~"view"},
    Layout =
        {arizona_svelte_layout, render, main_content, #{
            title => Title
        }},
    arizona_view:new(?MODULE, Bindings, Layout).

render(Bindings) ->
    arizona_template:from_html(~""""
    <div
        id="{arizona_template:get_binding(id, Bindings)}"
        class="min-h-screen relative overflow-hidden bg-arizona-landscape"
    >
        {arizona_svelte:render_component(~"App", #{
            name => ~"Arizona Svelte"
        })}
        {arizona_svelte:render_component(~"Counter", #{
            initialCount => 0
        })}
    </div>
    """").
