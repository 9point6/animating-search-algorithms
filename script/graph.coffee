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
        [@nodes,@edges] = [[],[]]
        @nodes_id_map = {}

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
        for node in @nodes
            node.update_style "normal"
        for edge in @edges
            edge.update_style "normal"

    remove_root_and_goal_nodes: ->
        for node in @nodes
            node.unsetGoalRoot( )

    # ### graph.add_point( )
    # Adds a node to the canvas.
    # #### Parameters
    # * `x`: X location of node
    # * `y`: Y location of node
    # * `[name]`: Name of node
    # * `[id]`: ID of node. Should only be used by save and restore routines
    #
    # **Return** -> new `point` object
    add_node: ( x, y, name = "", id ) ->
        newnode = new Node @paper, x, y, name
        if id?
            newnode.id = id
        @nodes_id_map[newnode.id] = newnode
        @nodes.push newnode
        newnode

    # ### graph.connect( )
    # Connects two nodes together.
    # #### Parameters
    # * `pointa` - The first node
    # * `pointb` - The second node
    # * `[weight]` - Weight of the the edge
    # * `[direction]` - The direction of the edge
    #
    # **Return** -> new `connection` object
    connect: ( nodea, nodeb, weight = 1, direction = 0 ) ->
        newedge = new Edge @paper, nodea, nodeb, weight, direction
        @edges.push newedge
        @sort_elements( )
        newedge

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
            [@edgena,@edgenb] = [{id:'0'},{id:'0'}]
            @connect_mode = true
            APP.fade_out_toolbar "Click two nodes to connect", =>
                @remove_styles( )
                @connect_mode = false
                APP.fade_in_toolbar( )
        else
            # If first point, save and contiune, else actually connect
            if @edgena.id is '0'
                @edgena = obj
            else
                if @edgena.id isnt obj.id
                    not_connected = true
                    for edge in @edges
                        a = edge.nodea.id
                        b = edge.nodeb.id
                        if ( a is @edgena.id and b is obj.id ) or ( b is @edgena.id and a is obj.id )
                            not_connected = false
                    if not_connected
                        @edgenb = obj
                        modal = new Modal
                            title: "New connection"
                            fields:
                                "weight":
                                    type: "text"
                                    label: "Edge weight"
                                    default: 1
                                "direction":
                                    type: "radio"
                                    label: "Edge Direction"
                                    values:
                                        "0": "Undirected"
                                        "-1": "'#{@edgenb.name}' to '#{@edgena.name}'"
                                        "1": "'#{@edgena.name}' to '#{@edgenb.name}'"
                            callback: ( r ) =>
                                newedge = @connect @edgena, @edgenb, r.weight, r.direction
                                @edgena.r.animate
                                    r: 5
                                    fill: "#000",
                                    100
                                @edgenb.r.animate
                                    r: 5
                                    fill: "#000",
                                    100
                                newedge.spark( )
                                @connect_mode = false
                                APP.fade_in_toolbar( )
                        modal.show( )
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
        out = '{ "nodes": ['
        comma = ""

        # Serialise points
        for node in @nodes
            node.id = if node.id? then node.id else uniqueId( )
            out += comma + " { \"id\": \"#{node.id}\", \"x\": \"#{node.x}\", \"y\": \"#{node.y}\", \"name\": \"#{node.name}\" }"
            comma = ","
        out += ' ], "edges": ['

        comma = ""

        # Serialise connections
        for edge in @edges
            out += comma + " { \"a\": \"#{edge.nodea.id}\", \"b\": \"#{edge.nodeb.id}\", \"weight\": \"#{edge.weight}\", \"direction\": \"#{edge.direction}\" }"
            comma = ","
        out += "] }"

        base64Encode out

    # ### graph.clear_graph( )
    # Clears the current graph. Used by the "New" button and the restore method
    clear_graph: ->
        for node in @nodes
            delete node
        for edge in @edges
            delete edge

        @nodes_id_map = {}
        [@nodes,@edges] = [[],[]]
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
        for node in obj.nodes
            @add_node node.x, node.y, node.name, node.id
        # Restore connections
        for edge in obj.edges
            @connect @nodes_id_map[edge.a], @nodes_id_map[edge.b], edge.weight, edge.direction

this.Graph = Graph
