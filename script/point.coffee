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
class point
    # ### point.constructor( )
    # Constructor for a node
    # #### Parameters
    # * `raphael` - The current paper object. needed for drawing the point
    # * `x` - X position of the node
    # * `y` - Y position of the node
    # * `[name]` - Name of the node
    constructor: ( @raphael, @x, @y, @name = "" ) ->
        @move_mode = false
        @connections = []

        # Fixes a weird issue on reloading from JSON
        @x = parseInt @x
        @y = parseInt @y

        # Assign point an ID. Used for connections and save/restore
        @id = uniqueId( )
        app.points_id_map

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

    # ### point.connect( )
    # Connect this `point` to another. Connections should be made from the main
    # app object. Used to allow easy navigation of connections from each node.
    # #### Parameters
    # * `other_point` - Other `point` object to connect to
    # * `connection` - `connection` object of the connection
    connect: ( other_point, connection ) ->
        @connections.push
            p: other_point
            c: connection

    # ### point.remove( )
    # Removes the `point` from the graph
    # #### TODO
    # * Some of this might be better suited in the `app` class...
    remove: =>
        # Remove all connections involving the point first
        for con in @connections
            con.c.remove( )

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
                newpoints = []
                for point in a.points
                    if point.id isnt @id
                        newpoints.push point
                a.points = newpoints

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
        if a.connect_mode is true
            @r.animate
                r: 10
                fill: "#f00",
                100
            a.do_mouse_connection @
        else if a.remove_mode is true
            a.do_mouse_removal @
        else
            false

    # ### point.drag_start( )
    # Drag start handler. Sets the object into move mode.
    drag_start: =>
        if @move_mode is false
            @move_mode = true
            # Needed because the drag events work in relative co-ordinates
            [@startx, @starty] = [0 + @x, 0 + @y]
        else
            false

    # ### point.drag_move( )
    # Drag move handler. Performs movement on the node.
    # #### Parameters
    # * `dx` - Difference in X co-ordinates
    # * `dy` - Difference in Y co-ordinates
    drag_move: ( dx, dy ) =>
        @move @startx + dx, @starty + dy
        for connection in @connections
            do ( connection ) ->
                connection.c.update_path( )

    # ### point.drag_up( )
    # Drag finish handler. Takes the object out of move mode.
    drag_up: =>
        @move_mode = false

    # ### point.move*_*with_mouse( )
    # Mostly for the old move method. (click to pick up, click to drop). Kept
    # because it's used in the new `point` method to allow the user to drop it
    move_with_mouse: =>
        if @drag_start( )
            [@startx, @starty] = [0, 0]
            $( @raphael.canvas ).mousemove ( e ) =>
                @drag_move e.pageX, e.pageY
                $( @raphael.canvas ).click ( e ) =>
                    @drag_up( )
                    $( @raphael.canvas ).unbind( 'mousemove' )
                    $( @raphael.canvas ).unbind( 'click' )

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

    # ### point.animate( )
    # Perform animations on the node. Used by search algorithms.
    # #### Parameters
    # * `ani_name` - Name of animation
    #
    # #### TODO
    # * Add all needed animations
    # * Maybe enumerate?
    animate: ( ani_name ) ->
        switch ani_name
            # The node is currently being 'looked at'
            when "working"
                @r.animate
                    color: "#00f",
                    100
            # The node has been visited by the algorithm
            when "visited"
                @r.animate
                    color: "#999",
                    100
