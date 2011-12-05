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
class Edge
    # ### connection.constructor( )
    # Constructor for an edge
    # #### Parameters
    # * `raphael` - The current paper object. needed for drawing the line
    # * `pointa` - The first node
    # * `pointb` - The second node
    # * `[weight]` - Weight of the the edge
    # * `[direction]`` - The direction of the edge
    constructor: ( @raphael, @nodea, @nodeb, @weight, @direction ) ->
        @nodea.connect @nodeb, @
        @nodeb.connect @nodea, @

        # Sets the current style to the default state
        @style = "normal"

        # Used to indicate direction for animating nodes.
        # If true point a is animated, then the connection, then potentially B
        @anim_atob = true

        # work out the center co-ords for the line
        @update_midpoint( )

        # Draw line
        @r = @raphael.path( )
        @r.attr
            stroke: "#666"

        # draw weight text
        @wt = @raphael.text @x, @y - 20, @weight

        # direction indicator
        @di = @raphael.path( )
        @di.attr
            stroke: "#999"

        @update_path( )

        # Set event handlers
        @r.hover @hover_in, @hover_out
        @r.click @click

    update_midpoint: ->
        @x = ( @nodea.x + @nodeb.x ) / 2
        @y = ( @nodea.y + @nodeb.y ) / 2
        @m = ( @nodeb.y - @nodea.y ) / ( @nodeb.x - @nodea.x )
        console.log "#{@m} - #{@nodea.x} - #{@nodeb.x} - #{180 / Math.PI * Math.atan @m}"

    # ### connection.update_path( )
    # Updates the connection path. To be used when `pointa` or `pointb` have
    # changed location.
    update_path: ->
        @update_midpoint( )
        @r.attr
            path: "M#{@nodea.x} #{@nodea.y}L#{@nodeb.x} #{@nodeb.y}"
        @wt.attr
            x: @x
            y: @y - 20
        @di.attr
            x: @x
            y: @y
            path: [
                "M"
                @x
                @y
                "L"
                @x + 10
                @y + 10
                "L"
                @x - 10
                @y + 10
                "L"
                @x
                @y
            ]
        @di.rotate 180 / Math.PI * Math.atan( @m ) + 90

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
                new_edges = []
                for edge in @nodea.edges
                    if edge.n.id isnt @nodeb.id
                        new_edges.push edge
                @nodea.edges = new_edges

                # Remove from connections in `pointb`
                new_edges = []
                for edge in @nodeb.edges
                    if edge.n.id isnt @nodea.id
                        new_edges.push edge
                @nodeb.edges = new_edges

                # Remove from connections list in `app` object
                new_edges = []
                for edge in APP.graph.edges
                    if edge.nodea.id isnt @nodea.id or edge.nodeb.id isnt @nodeb.id
                        new_edges.push edge
                APP.graph.edges = new_edges

    # ### connection.hover_in( )
    # Show hover effect
    # #### Parameters
    # * `e` - Mouse event object
    #
    # #### TODO
    # * Convert this and `hover_in` into a single method with a toggle
    hover_in: ( e ) =>
        if APP.design_mode
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
        if APP.design_mode
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
        start_point = if a2b then @nodea else @nodeb
        @spark = @raphael.ellipse start_point.x, start_point.y, 20, 20
        @spark.attr
            fill: "r#f00-#fff"
            stroke: "transparent"

        # Raphael does not currently support alpha gradients, but SVG and VML
        # both do. This code changes the necessary elements to do this manually
        grad = $( @spark.node ).attr "fill"
        grad = grad.substring 4, grad.length - 1
        stops = $( grad ).children( )
        $( stops[0] ).attr "stop-opacity", "1"
        $( stops[1] ).attr "stop-opacity", "0"

        @spark.animateAlong @r, 500, false, ->
            @remove( )

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
                    @style = "normal"
            # The connection is currently being 'looked at'
            when "viewing"
                @r.animate
                    stroke: "#A40000"
                    "stroke-width": 10,
                    anim_speed
                    @style = "viewing"
            # The connection is an option for later in the algorithm
            when "potential"
                @r.animate
                    stroke: "#0247FE"
                    "stroke-width": 5,
                    anim_speed
                    @style = "potential"
            # The connection has been visited by the algorithm
            when "visited"
                @r.animate
                    #stroke: "#A40000"
                    stroke: "#000"
                    "stroke-width": 3,
                    anim_speed
                    @style = "visited"

this.Edge = Edge
