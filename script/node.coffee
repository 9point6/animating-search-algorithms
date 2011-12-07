# Part of the **Animating Search Algorithms** project
#
# ## Developers
# * [Ian Brown](http://www.csc.liv.ac.uk/~cs8ib/)
# * [Jack Histon](http://www.csc.liv.ac.uk/~cs8jrh/)
# * [Colin Jackson](http://www.csc.liv.ac.uk/~cs8cj/)
# * [Jennifer Jones](http://www.csc.liv.ac.uk/~cs8jlj/)
# * [John Sanderson](http://www.csc.liv.ac.uk/~cs8js/)
#
# Do not modify or distribute without permission.

# ## Main Documentation

# Graph node class
class Node
    # ### point.constructor( )
    # Constructor for a node
    # #### Parameters
    # * `raphael` - The current paper object. needed for drawing the point
    # * `x` - X position of the node
    # * `y` - Y position of the node
    # * `[name]` - Name of the node
    constructor: ( @raphael, @x, @y, @name = "" ) ->
        @move_mode = false
        @edges = []

        # Fixes a weird issue on reloading from JSON
        @x = parseInt @x
        @y = parseInt @y

        # Assign point an ID. Used for connections and save/restore
        @id = uniqueId( )

        # Draw circle and label
        @r = @raphael.circle @x, @y, 5
        @label = @raphael.text @x, @y - 20, @name
        @label.attr
            opacity: 0
        @r.attr
            fill: "#000"
            stroke: "transparent"

        # Set event handlers
        @r.hover @hover_in, @hover_out
        @r.click @click
        @r.drag @drag_move, @drag_start, @drag_up

    setRoot: ->
        if not @goal and not @root
            @root = true
            @emph = @raphael.circle @x, @y, 10
            @emph.attr
                stroke: "#f00"
                "stroke-width": 2
        @

    setGoal: ->
        if not @goal and not @root
            @goal = true
            @emph = @raphael.circle @x, @y, 10
            @emph.attr
                fill: "#0f0"
                stroke: "#0f0"
                "stroke-width": 2
            $( @emph.node ).prependTo $( 'svg' )[0]
        @

    unsetGoalRoot: ( root = true, goal = true ) ->
        if @goal or @root
            if @root and root
                @emph.remove( )
                APP.current_algo.root_node = null
                @root = false
            if @goal and goal
                @emph.remove( )
                APP.current_algo.goal_node = null
                @goal = false

    weight_to_travel: ( other_node ) ->
        for e in @edges
            if e.n.id is other_node.id
                return e.e.weight
        APP.graph.edgewavg

    # ### point.connect( )
    # Connect this `point` to another. Connections should be made from the main
    # app object. Used to allow easy navigation of connections from each node.
    # #### Parameters
    # * `other_point` - Other `point` object to connect to
    # * `connection` - `connection` object of the connection
    connect: ( other_node, edge ) ->
        @edges.push
            n: other_node
            e: edge

    # ### point.remove( )
    # Removes the `point` from the graph
    # #### TODO
    # * Some of this might be better suited in the `app` class...
    remove: =>
        # Remove all connections involving the point first
        for edge in @edges
            edge.e.remove( )

        # Animate the point disappearing
        @r.animate
            r: 0
            opacity: 0,
            200, 'linear', =>
                # When finished animating, remove all the drawing elements on
                # the canvas.
                @label.remove( )
                @r.remove( )

                # Remove point from `app` class's list
                newnodes = []
                for node in APP.graph.nodes
                    if node.id isnt @id
                        newnodes.push node
                APP.graph.nodes = newnodes
        if @goal or @root
            @emph.animate
                r: 0
                opacity: 0,
                200, 'linear'

    # ### point.move( )
    # Moves a node.
    # #### Parameters
    # * `x` - The new X co-ordinate of the point
    # * `y` - The new Y co-ordinate of the point
    move: ( @x, @y ) ->
        @r.attr
            cx: @x
            cy: @y
        @label.attr
            x: @x
            y: @y - 20
        if @goal or @root
            @emph.attr
                cx: @x
                cy: @y

    # ### point.click( )
    # Node click handler. What it does depends on the current state of the
    # `app` object's flag booleans.
    # #### Parameters
    # * `e` - Mouse event object
    #
    # #### TODO
    # * Bring up a context menu to edit/remove the node
    # * Check if returning false is required
    click: ( e ) =>
        if APP.graph.connect_mode
            @r.animate
                r: 10
                fill: "#f00",
                100
            APP.graph.do_mouse_connection @
        else if APP.graph.remove_mode
            APP.graph.do_mouse_removal @
        else if APP.root_select_mode
            APP.current_algo.root_node = @setRoot( )
            APP.root_select_mode = false
            APP.goal_select_mode = true
            APP.change_help_text "Select goal node"
        else if APP.goal_select_mode
            APP.current_algo.goal_node = @setGoal( )
            APP.goal_select_mode = false
            APP.fade_in_toolbar( )
        else
            if not @move_mode
                if APP.context
                    APP.context.destroy( )
                if APP.design_mode
                    APP.context = new Context
                        items:
                            'Remove': =>
                                @remove( )
                        x: e.pageX
                        y: e.pageY
                else
                    APP.context = new Context
                        items:
                            'Set as Root Node': =>
                                APP.graph.remove_root_and_goal_nodes( true, false )
                                APP.current_algo.root_node = @setRoot( )
                            'Set as Goal Node': =>
                                APP.graph.remove_root_and_goal_nodes( false, true )
                                APP.current_algo.goal_node = @setGoal( )
                        x: e.pageX
                        y: e.pageY
            @move_mode = false

    # ### point.drag_start( )
    # Drag start handler. Sets the object into move mode.
    drag_start: =>
        if APP.design_mode
            # Needed because the drag events work in relative co-ordinates
            [@startx, @starty] = [0 + @x, 0 + @y]

    # ### point.drag_move( )
    # Drag move handler. Performs movement on the node.
    # #### Parameters
    # * `dx` - Difference in X co-ordinates
    # * `dy` - Difference in Y co-ordinates
    drag_move: ( dx, dy ) =>
        if APP.design_mode
            @move_mode = true
            @move @startx + dx, @starty + dy
            for edge in @edges
                do ( edge ) ->
                    edge.e.update_path( )

    # ### point.drag_up( )
    # Drag finish handler. Takes the object out of move mode.
    drag_up: =>
        #if APP.design_mode
            # @move_mode = false

    # ### point.move*_*with_mouse( )
    # Mostly for the old move method. (click to pick up, click to drop). Kept
    # because it's used in the new `point` method to allow the user to drop it
    move_with_mouse: =>
        if @drag_start( )
            [@startx, @starty] = [0, 0]
            console.log "derp"
            $( @raphael.canvas ).mousemove ( e ) =>
                console.log "df"
                @drag_move e.pageX, e.pageY
                $( @raphael.canvas ).click ( e ) =>
                    @drag_up( )
                    $( @raphael.canvas ).unbind( 'mousemove' )
                    $( @raphael.canvas ).unbind( 'click' )
            console.log "herp"

    # ### point.hover_in( )
    # Show hover effect
    # #### Parameters
    # * `e` - Mouse event object
    #
    # #### TODO
    # * Convert this and `hover_out` into a single method with a toggle
    hover_in: ( e ) =>
        @r.attr
            cursor: 'pointer'
        @r.animate
            r: 10,
            100
        @label.animate
            opacity: 1,
            100

    # ### point.hover_out( )
    # Remove hover effect
    # #### Parameters
    # * `e` - Mouse event object
    #
    # #### TODO
    # * Convert this and `hover_in` into a single method with a toggle
    hover_out: ( e ) =>
        @r.attr
            cursor: 'normal'
        @r.animate
            r: 5,
            100
        @label.animate
            opacity: 0,
            100

    # ### point.update_style( )
    # Changes the look of the node. Used by search algorithms.
    # #### Parameters
    # * `style_name` - Style from presets ('visited,'viewing',etc) to change the point properties to.
    #
    # #### TODO
    # * Add all needed animations
    # * Maybe enumerate?
    update_style: ( style_name ) ->
        anim_speed = 100
        switch style_name
            when "normal"
                @r.animate
                    fill: "#000",
                    anim_speed
                    @style = "normal"
            # The node is currently being 'looked at'
            when "viewing"
                @r.animate
                    fill: "#A40000",
                    anim_speed
                    @style = "viewing"
            # The node has been visited by the algorithm
            when "visited"
                @r.animate
                    fill: "#999",
                    anim_speed
                    @style = "visited"
            # The node is the goal node
            when "goal"
                @r.animate
                    fill: "#FFFF00"
                    anim_speed
                    @style = "goal"

this.Node = Node
