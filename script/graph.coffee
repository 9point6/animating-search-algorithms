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

# Graph class
class Graph
    # ### Class properties

    # Flag for if the user is connecting two points
    connect_mode: false
    # Flag for if the user is removing a point
    remove_mode: false

    # ### graph.constructor( )
    # Constructor for the graph.
    # #### TODO
    # * Add cancel button to helptext mode
    # * Write a better system for preset data
    # * Replace JS prompt dialogs with nice modal ones
    constructor: ->
        [@points,@connections] = [[],[]]
        @points_id_map = {}

        # Store the window height and width. `@` is an alias for `this.`
        @canvas_dimensions( )

        # Resize canvas if window resizes
        $( window ).resize ( e ) =>
            @canvas_dimensions( )
            @paper.setSize @wx, @wy

        # Instantiate a Raphael canvas, if there are multiple method parameters,
        # coffeescript lets you leave out the brackets
        @paper = Raphael 0, 0, @wx, @wy

    # ### graph.sort_elements( )
    # Sorts elements so that the points are above everything else in the SVG
    # canvas element.
    #
    # This solves the connection lines being drawn over the nodes and causing
    # buggy hover behaviour.
    sort_elements: ->
        for elem in $( 'svg circle' )
            $( elem ).appendTo $( 'svg' )[0]

    # ### graph.canvas_dimensions( )
    # Gets new dimensions for what the canvas should be. The canvas should be
    # resized after this or buggy behaviour will occur.
    # #### TODO
    # * Maybe move canvas resizing behaviour into this method.
    canvas_dimensions: ->
        @wx = $( window ).width( )
        @wy = $( window ).height( )

    # ### graph.remove_styles( )
    # Removes any styles set to any graph elements during the animation of an
    # algorithm.
    remove_styles: ->
        for point in @points
            point.update_style "normal"
        for connection in @connections
            connection.update_style "normal"

    # ### graph.add_point( )
    # Adds a node to the canvas.
    # #### Parameters
    # * `x`: X location of node
    # * `y`: Y location of node
    # * `[name]`: Name of node
    # * `[id]`: ID of node. Should only be used by save and restore routines
    #
    # **Return** -> new `point` object
    add_point: ( x, y, name = "", id ) ->
        newpoint = new Point @paper, x, y, name
        if id?
            newpoint.id = id
        @points_id_map[newpoint.id] = newpoint
        @points.push newpoint
        newpoint

    # ### graph.connect( )
    # Connects two nodes together.
    # #### Parameters
    # * `pointa` - The first node
    # * `pointb` - The second node
    # * `[weight]` - Weight of the the edge
    # * `[direction]` - The direction of the edge
    #
    # **Return** -> new `connection` object
    connect: ( pointa, pointb, weight = 0, direction = 0 ) ->
        newcon = new Connection @paper, pointa, pointb, weight, direction
        @connections.push newcon
        @sort_elements( )
        newcon

    # ### graph.do*_*mouse_connection( )
    # Handle the connection of two nodes together. Called with no parameters
    # to start the process and the subsequent objects to be connected are fed
    # as the parameter from each nodes on-click handler.
    # #### Parameters
    # * `[obj]` - A `point` object to connect
    #
    # #### TODO
    # * See if insantiation of `@connectpointa` and `@connectpointb` is
    # actually necessary
    do_mouse_connection: ( obj ) =>
        # If not yet connecting, change state
        if @connect_mode is false
            [@conpa,@conpb] = [{id:'0'},{id:'0'}]
            @connect_mode = true
            APP.fade_out_toolbar "Click two nodes to connect", =>
                @remove_styles( )
                @connect_mode = false
                APP.fade_in_toolbar( )
        else
            # If first point, save and contiune, else actually connect
            if @conpa.id is '0'
                @conpa = obj
            else
                if @conpa.id isnt obj.id
                    not_connected = true
                    for con in @connections
                        a = con.pointa.id
                        b = con.pointb.id
                        if ( a is @conpa.id and b is obj.id ) or ( b is @conpa.id and a is obj.id )
                            not_connected = false
                    if not_connected
                        @conpb = obj
                        newcon = @connect @conpa, @conpb
                        @conpa.r.animate
                            r: 5
                            fill: "#000",
                            100
                        @conpb.r.animate
                            r: 5
                            fill: "#000",
                            100
                        newcon.spark( )
                        @connect_mode = false
                        APP.fade_in_toolbar( )
                    else
                        obj.update_style "normal"

    # ### graph.do*_*mouse_removal( )
    # Handle the removal of a node. Called with no parameters to start the
    # process and when a `point` object is clicked it calls this method back
    # to perform the actual removal
    # #### Parameters
    # * `[obj]` - The `point` to remove
    do_mouse_removal: ( obj ) =>
        if @remove_mode is false
            @remove_mode = true
            APP.fade_out_toolbar "Click a node to remove it", =>
                @remove_mode = false
                APP.fade_in_toolbar( )
        else
            obj.remove( )
            @remove_mode = false
            APP.fade_in_toolbar( )

    # ### graph.serialise_graph( )
    # Takes the current state of the graph and serialises it into a JSON string
    # and then Base64 encodes it. This has the primary purpose of making the
    # current state "save-able"
    #
    # **Return** -> Base64 encoded JSON string of graph state
    serialise_graph: ->
        out = '{ "points": ['
        comma = ""

        # Serialise points
        for point in @points
            point.id = if point.id? then point.id else uniqueId( )
            out += comma + " { \"id\": \"#{point.id}\", \"x\": \"#{point.x}\", \"y\": \"#{point.y}\", \"name\": \"#{point.name}\" }"
            comma = ","
        out += ' ], "connections": ['

        comma = ""

        # Serialise connections
        for con in @connections
            out += comma + " { \"a\": \"#{con.pointa.id}\", \"b\": \"#{con.pointb.id}\", \"weight\": \"#{con.weight}\", \"direction\": \"#{con.direction}\" }"
            comma = ","
        out += "] }"

        base64Encode out

    # ### graph.clear_graph( )
    # Clears the current graph. Used by the "New" button and the restore method
    clear_graph: ->
        for points in @points
            delete point
        for connection in @connections
            delete connection

        @points_id_map = {}
        [@points,@connections] = [[],[]]
        @paper.clear( )

    # ### graph.parse_string( )
    # Parses a saved graph state and restores it to the current session.
    # #### Parameters
    # * `str` - Base64 encoded JSON string of graph state
    parse_string: ( str ) ->
        @clear_graph( )
        # Decode string to an object
        json = base64Decode str
        obj = $.parseJSON json
        # Restore points
        for point in obj.points
            @add_point point.x, point.y, point.name, point.id
        # Restore connections
        for con in obj.connections
            @connect @points_id_map[con.a], @points_id_map[con.b], con.weight, con.direction

this.Graph = Graph
