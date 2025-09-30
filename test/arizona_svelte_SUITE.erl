-module(arizona_svelte_SUITE).
-behaviour(ct_suite).
-include_lib("stdlib/include/assert.hrl").
-compile([export_all, nowarn_export_all]).

%% --------------------------------------------------------------------
%% Behaviour (ct_suite) callbacks
%% --------------------------------------------------------------------

all() ->
    [
        {group, basic_rendering},
        {group, custom_attributes}
    ].

groups() ->
    [
        {basic_rendering, [parallel], [
            render_component_test
        ]},
        {custom_attributes, [parallel], [
            render_component_with_static_attributes_test,
            render_component_with_dynamic_attributes_test
        ]}
    ].

%% --------------------------------------------------------------------
%% Basic rendering tests
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
                ~"'\n    data-arizona-update=\"false\"\n    ",
                ~"",
                ~"\n></div>"
            ],
            _View
        },
        Result
    ),

    % Test diff mode returns nodiff
    ?assertMatch({nodiff, _}, Callback(diff, ~"parent", 1, MockView)).

%% --------------------------------------------------------------------
%% Custom attributes tests
%% --------------------------------------------------------------------

render_component_with_static_attributes_test(Config) when is_list(Config) ->
    ct:comment("arizona_svelte:render_component/3 should include static custom attributes"),
    Component = ~"Counter",
    Props = #{count => 5},
    Attrs = ~"class=\"flex-1\" id=\"main-counter\"",

    MockView = arizona_view:new(test_module, #{}, none),
    Callback = arizona_svelte:render_component(Component, Props, Attrs),
    ?assert(is_function(Callback, 4)),

    % Test html mode includes custom attributes
    Result = Callback(render, ~"parent", 1, MockView),
    ?assertMatch(
        {
            [
                ~"<div\n    data-svelte-component=\"",
                ~"Counter",
                ~"\"\n    data-svelte-props='",
                ~"{\"count\":5}",
                ~"'\n    data-arizona-update=\"false\"\n    ",
                ~"class=\"flex-1\" id=\"main-counter\"",
                ~"\n></div>"
            ],
            _View
        },
        Result
    ),

    % Test diff mode returns nodiff
    ?assertMatch({nodiff, _}, Callback(diff, ~"parent", 1, MockView)).

render_component_with_dynamic_attributes_test(Config) when is_list(Config) ->
    ct:comment("arizona_svelte:render_component/3 should support dynamic attributes"),
    Component = ~"Widget",
    Props = #{},

    % Create a dynamic attribute template using from_html
    Attrs = arizona_template:from_html(~"""
    class="widget" data-testid="my-widget"
    """),

    MockView = arizona_view:new(test_module, #{}, none),
    Callback = arizona_svelte:render_component(Component, Props, Attrs),
    ?assert(is_function(Callback, 4)),

    % Test html mode includes dynamic attributes
    Result = Callback(render, ~"parent", 1, MockView),
    {Html, _View} = Result,

    % Verify the HTML contains the component and attributes
    HtmlBinary = iolist_to_binary(Html),
    ?assert(binary:match(HtmlBinary, ~"data-svelte-component=\"Widget\"") =/= nomatch),
    ?assert(binary:match(HtmlBinary, ~"class=\"widget\"") =/= nomatch),
    ?assert(binary:match(HtmlBinary, ~"data-testid=\"my-widget\"") =/= nomatch),
    ?assert(binary:match(HtmlBinary, ~"data-arizona-update=\"false\"") =/= nomatch),

    % Test diff mode returns nodiff
    ?assertMatch({nodiff, _}, Callback(diff, ~"parent", 1, MockView)).
