-module(arizona_svelte_counter).
-behaviour(arizona_stateful).
-compile({parse_transform, arizona_parse_transform}).

-export([mount/1]).
-export([render/1]).
-export([handle_event/3]).

-spec mount(Bindings) -> State when
    Bindings :: arizona_binder:map(),
    State :: arizona_stateful:state().
mount(Bindings) ->
    arizona_stateful:new(?MODULE, Bindings#{
        id => ~"counter",
        count => 0
    }).

-spec render(Bindings) -> Template when
    Bindings :: arizona_binder:bindings(),
    Template :: arizona_template:template().
render(Bindings) ->
    arizona_template:from_html(~"""
    <div id="{arizona_template:get_binding(id, Bindings)}">
        {arizona_svelte:render_component(~"HelloWorld", #{
            name => ~"Arizona Svelte"
        })}

        {arizona_svelte:render_component(~"Counter", #{})}

        <span>{arizona_template:get_binding(count, Bindings)}</span>
        <button
            type="button"
            onclick="{[~"arizona.sendEventTo('", arizona_template:get_binding(id, Bindings), ~"', 'incr')"]}"
        >
            Increment
        </button>
    </div>
    """).

-spec handle_event(Event, Params, State) -> Result when
    Event :: arizona_stateful:event_name(),
    Params :: arizona_stateful:event_params(),
    State :: arizona_stateful:state(),
    Result :: arizona_stateful:handle_event_result().
handle_event(~"incr", _Params, State) ->
    Count = arizona_stateful:get_binding(count, State),
    State1 = arizona_stateful:put_binding(count, Count + 1, State),
    {[], State1}.
