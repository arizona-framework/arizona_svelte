-module(arizona_svelte_SUITE).
-behaviour(ct_suite).
-include_lib("stdlib/include/assert.hrl").
-compile([export_all, nowarn_export_all]).

%% --------------------------------------------------------------------
%% Behaviour (ct_suite) callbacks
%% --------------------------------------------------------------------

all() -> [render_component_test].

%% --------------------------------------------------------------------
%% Tests
%% --------------------------------------------------------------------

render_component_test(Config) when is_list(Config) ->
    ct:comment("arizona_svelte:render_component/2 should return render callback"),
    Component = ~"Counter",
    Props = #{title => ~"Test", count => 0},

    MockView = arizona_view:new(test_module, #{}, none),
    Callback = arizona_svelte:render_component(Component, Props),
    ?assert(is_function(Callback, 4)),

    % Test html mode
    Result = Callback(render, ~"parent", 1, MockView),
    ?assertMatch(
        {
            [
                ~"<div\n    data-svelte-component=\"",
                ~"Counter",
                ~"\"\n    data-svelte-props='",
                ~"{\"count\":0,\"title\":\"Test\"}",
                ~"'\n    data-arizona-update=\"false\"\n></div>"
            ],
            _View
        },
        Result
    ),

    % Test diff mode returns nodiff
    ?assertMatch({nodiff, _}, Callback(diff, ~"parent", 1, MockView)).
