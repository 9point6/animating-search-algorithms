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

# Graph edge class
class connection
    # ### connection.constructor( )
    # Constructor for an edge
    # #### Parameters
    # * `raphael` - The current paper object. needed for drawing the line
    # * `pointa` - The first node
    # * `pointb` - The second node
    # * `[weight]` - Weight of the the edge
    # * `[direction]`` - The direction of the edge
    constructor: ( @raphael, @pointa, @pointb, @weight, @direction ) ->
        @pointa.connect @pointb, @
        @pointb.connect @pointa, @

        # Used to indicate direction for animating nodes.
        # If true point a is animated, then the connection, then potentially B
        @anim_atob = true

        # Draw line
        @r = @raphael.path( )
        @r.attr
            stroke: "#666"
        @update_path( )

        # Set event handlers
        @r.hover @hover_in, @hover_out
        @r.click @click

    # ### connection.update_path( )
    # Updates the connection path. To be used when `pointa` or `pointb` have
    # changed location.
    update_path: ->
        @r.attr
            path: "M#{@pointa.x} #{@pointa.y}L#{@pointb.x} #{@pointb.y}"

    # ### connection.remove( )
    # Removes the point from the graph
    # #### TODO
    # * Some of this might be better suited in the `app` class...
    # * Remove redundant code
    remove: =>
        @r.animate
           opacity: 0,
           50, 'linear', =>
                @r.remove( )

                # Remove from connections in `pointa`
                newcons = []
                for con in @pointa.connections
                    if con.p.id isnt @pointb.id
                        newcons.push con
                @pointa.connections = newcons

                # Remove from connections in `pointb`
                newcons = []
                for con in @pointb.connections
                    if con.p.id isnt @pointa.id
                        newcons.push con
                @pointb.connections = newcons

                # Remove from connections list in `app` object
                newcons = []
                for con in a.connections
                    if con.pointa.id isnt @pointa.id or con.pointb.id isnt @pointb.id
                        newcons.push con
                a.connections = newcons

    # ### connection.hover_in( )
    # Show hover effect
    # #### Parameters
    # * `e` - Mouse event object
    #
    # #### TODO
    # * Convert this and `hover_in` into a single method with a toggle
    hover_in: ( e ) =>
        @r.attr
            cursor: 'pointer'
        @r.animate
            "stroke-width": 3
            stroke: "#f00",

    # ### connection.hover_out( )
    # Remove hover effect
    # #### Parameters
    # * `e` - Mouse event object
    #
    # #### TODO
    # * Convert this and `hover_out` into a single method with a toggle
    hover_out: ( e ) =>
        @r.attr
            cursor: 'normal'
        @r.animate
            "stroke-width": 1
            stroke: "#666",
            100

    # ### connection.click( )
    # Connection click handler. Currently just does a spark animation.
    # #### Parameters
    # * `e` - Mouse event object
    #
    # #### TODO
    # * Bring up a context menu to edit/remove the connection
    click: ( e ) =>
        @spark( )

    # ### connection.spark( )
    # Performs an animation along the edge. To be used when demonstrating the
    # process of an algorithm, etc.
    # #### Parameters
    # * `[a2b]` - Animate from A to B?
    spark: ( a2b = true ) ->
        start_point = if a2b then @pointa else @pointb
        window.spark = @raphael.ellipse start_point.x, start_point.y, 20, 20
        window.spark.attr
            fill: "r#f00-#fff"
            stroke: "transparent"

        # Raphael does not currently support alpha gradients, but SVG and VML
        # both do. This code changes the necessary elements to do this manually
        grad = $( spark.node ).attr "fill"
        grad = grad.substring 4, grad.length - 1
        stops = $( grad ).children( )
        $( stops[0] ).attr "stop-opacity", "1"
        $( stops[1] ).attr "stop-opacity", "0"

        window.spark.animateAlong @r, 500, false, =>
            spark.remove( )

    # ### connection.update_style( )
    # Perform animatrions on the connection. Used by search algorithms.
    # #### Parameters
    # * `style_name` - Name of preset style used to update the look of the connection.
    #
    # #### TODO
    # * Add all needed animations
    # * Maybe enumerate?
    update_style: ( style_name ) ->
        anim_speed = 100
        switch style_name
            # The connection is to be reset back to 'default'
            when "normal"
                @r.animate
                    stroke: "#666"
                    "stroke-width": 1,
                    anim_speed
            # The connection is currently being 'looked at'
            when "viewing"
                @r.animate
                    stroke: "#008000"
                    "stroke-width": 10,
                    anim_speed
            # The connection is an option for later in the algorithm
            when "potential"
                @r.animate
                    stroke: "#0247FE"
                    "stroke-width": 5,
                    anim_speed
            # The connection has been visited by the algorithm
            when "visited"
                @r.animate
                    stroke: "#A40000"
                    "stroke-width": 3,
                    anim_speed
