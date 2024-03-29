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

        # Used to indicate direction for animating nodes.
        # If true point a is animated, then the connection, then potentially B
        @anim_atob = true

        # work out the center co-ords for the line
        @update_midpoint( )

        # Draw line
        @r = @raphael.path( )

        # draw weight text
        @wt = @raphael.text @x, @y - 20, @weight
        $( @wt.node ).css "cursor", "pointer"

        # direction indicator
        @di = @raphael.path( )

        # Sets the current style to the default state
        @update_style "normal", true

        @update_path( )

        # Set event handlers
        @r.hover @hover_in, @hover_out
        @di.hover @hover_in, @hover_out
        @wt.hover @hover_in, @hover_out
        @r.click @click
        @di.click @click
        @wt.click @click

    visitable: ( node, reverse = false ) ->
        if @direction is 0
            true
        else
            if @direction > 0
                ret = @nodea.id is node.id
            else
                ret = @nodeb.id is node.id

            if reverse then not ret else ret

    update_midpoint: ->
        @x = ( @nodea.x + @nodeb.x ) / 2
        @y = ( @nodea.y + @nodeb.y ) / 2
        @m = ( @nodeb.y - @nodea.y ) / ( @nodeb.x - @nodea.x )

    # ### connection.update_path( )
    # Updates the connection path. To be used when `pointa` or `pointb` have
    # changed location.
    update_path: ->
        @update_midpoint( )
        add = ( if @direction > 0 then 180 else 0 ) + ( if @nodea.x < @nodeb.x then 180 else 0 )
        angle = 180 / Math.PI * Math.atan( @m ) + 90
        if 180 > angle >= 140 then anglemod = -1
        else if 220 > angle >= 180 then anglemod = 1
        else if 360 > angle >= 320 then anglemod = 1
        else if 40 > angle >= 0 then anglemod = -1
        else anglemod = 0
        @r.attr
            path: "M#{@nodea.x} #{@nodea.y}L#{@nodeb.x} #{@nodeb.y}"
        @wt.attr
            x: @x + 20 * Math.round anglemod
            y: @y - 20
        @di.attr
            x: @x
            y: @y
            path: [
                "M"
                @x
                @y
                "L"
                @x + 5
                @y + 10
                "L"
                @x - 5
                @y + 10
                "L"
                @x
                @y
            ]
            opacity: Math.abs @direction * 100
        @di.translate 0, -5
        @di.rotate angle + add, true

    # ### connection.remove( )
    # Removes the point from the graph
    # #### TODO
    # * Some of this might be better suited in the `app` class...
    # * Remove redundant code
    remove: =>
        @di.animate
            opacity: 0,
            250, 'linear', ->
                @remove( )
        @wt.animate
            opacity: 0,
            250, 'linear', ->
                @remove( )
        @r.animate
            opacity: 0,
            250, 'linear', =>
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
            @di.attr
                cursor: 'pointer'
            @update_style "hover"

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
            @di.attr
                cursor: 'normal'
            @update_style "normal"

    # ### connection.click( )
    # Connection click handler. Currently just does a spark animation.
    # #### Parameters
    # * `e` - Mouse event object
    #
    # #### TODO
    # * Bring up a context menu to edit/remove the connection
    click: ( e ) =>
        # @spark( @direction >= 0 )
        if APP.graph.remove_mode
            APP.graph.do_mouse_removal @
        else if APP.design_mode
            if APP.context
                APP.context.destroy( )
            APP.context = new Context
                items:
                    'Edit': =>
                        @edit( )
                    'Remove': =>
                        @remove( )
                x: e.pageX
                y: e.pageY

    edit: ->
        modal = new Modal
            title: "Edit an edge"
            fields:
                "weight":
                    type: "text"
                    label: "Edge Weight"
                    default: @weight
                "direction":
                    type: "radio"
                    label: "Edge Direction"
                    values:
                        "0": "Undirected"
                        "-1": "'#{@nodeb.name}' to '#{@nodea.name}'"
                        "1": "'#{@nodea.name}' to '#{@nodeb.name}'"
                    default: @direction
            cancel: "Cancel"
            callback: ( r ) =>
                @direction = parseInt r.direction
                @weight = parseInt r.weight
                @wt.attr
                    text: @weight
                @update_path( )
        modal.show( )

    # ### connection.spark( )
    # Performs an animation along the edge. To be used when demonstrating the
    # process of an algorithm, etc.
    # #### Parameters
    # * `[a2b]` - Animate from A to B?
    spark: ( a2b = true ) ->
        start_point = if a2b then @nodea else @nodeb
        spark = @raphael.ellipse start_point.x, start_point.y, 20, 20
        spark.attr
            fill: "r#f00-#fff"
            stroke: "transparent"

        # Raphael does not currently support alpha gradients, but SVG and VML
        # both do. This code changes the necessary elements to do this manually
        grad = $( spark.node ).attr "fill"
        grad = grad.substring 4, grad.length - 1
        stops = $( grad ).children( )
        $( stops[0] ).attr "stop-opacity", "1"
        $( stops[1] ).attr "stop-opacity", "0"

        if a2b
            spark.animateAlong @r, 500, false, ->
                @remove( )
        else
            spark.animateAlongBack @r, 500, false, ->
                @remove( )

    # ### connection.update_style( )
    # Perform animatrions on the connection. Used by search algorithms.
    # #### Parameters
    # * `style_name` - Name of preset style used to update the look of the connection.
    # * `instant` - whether to smoothly animate or instantly change the style [false]
    #
    # #### TODO
    # * Add all needed animations
    # * Maybe enumerate?
    update_style: ( style_name, instant = false ) ->
        anim_speed = if instant then 0 else 100
        switch style_name
            # The connection is to be reset back to 'default'
            when "normal"
                @r.animate
                    stroke: "#666"
                    "stroke-width": 1,
                    anim_speed
                @di.animate
                    fill: "#666"
                    stroke: "#666"
                    "stroke-width": 1,
                    anim_speed
                @wt.animate
                    stroke: "#000",
                    anim_speed
                @style = "normal"
            # When the connection has mouse over
            when "hover"
                @r.animate
                    stroke: "#f00"
                    "stroke-width": 3,
                    anim_speed
                @di.animate
                    fill: "#f00"
                    stroke: "#f00",
                    anim_speed
                @wt.animate
                    stroke: "#f00",
                    anim_speed
                @style = "hover"
            # The connection is currently being 'looked at'
            when "viewing"
                colour = "#0C3"
                @r.animate
                    stroke: colour
                    "stroke-width": 10,
                    anim_speed
                @di.animate
                    fill: colour
                    stroke: colour
                    "stroke-width": 7,
                    anim_speed
                @style = "viewing"
            # The connection is an option for later in the algorithm
            when "potential"
                colour = "#0247FE"
                @r.animate
                    stroke: colour
                    "stroke-width": 5,
                    anim_speed
                @di.animate
                    fill: colour
                    stroke: colour
                    "stroke-width": 3,
                    anim_speed
                @style = "potential"
            # The connection has been visited by the algorithm
            when "visited"
                colour = "#000"
                @r.animate
                    #stroke: "#A40000"
                    stroke: colour
                    "stroke-width": 3,
                    anim_speed
                @di.animate
                    fill: colour
                    stroke: colour
                    "stroke-width": 1,
                    anim_speed
                @style = "visited"
            when "path"
                colour = "#F60"
                @r.animate
                    stroke: colour
                    "stroke-width": 5,
                    anim_speed
                @di.animate
                    fill: colour
                    stroke: colour
                    "stroke-width": 3,
                    anim_speed
                @style = "path"

this.Edge = Edge
