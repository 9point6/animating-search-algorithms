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

# Main app class
class app
    # ### Class properties

    # Flag for if the user is connecting two points
    connect_mode: false
    # Flag for if the user is removing a point
    remove_mode: false

    # ### app.constructor( )
    # Constructor for the app.
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

        # Build toolbar, etc
        $( 'body' ).append ( '''
        <div id="toolbar">
            <h1>search<span>r</span></h1>
            <ul id="designmode">
                <li id="new" title="New Graph" />
                <li id="save" title="Save Graph" />
                <li id="load" title="Load Graph" />
                <li id="add" title="Add a node" />
                <li id="remove" title="Remove a node" />
                <li id="connect" title="Connect two nodes" />
                <li id="search" title="Switch to search mode" />
            </ul>
            <div id="helptext" />
        </div>
        <div id="copyright">
            <a href="doc">Project Home</a>
        <div>
        ''' );

        # Set the helptext div to be invisible for animation.
        $( '#helptext' ).prop
            opacity: 0

        # Set click events for toolbar buttons
        $( '#new' ).click ( e ) =>
            @clear_graph( )
        $( '#save' ).click ( e ) =>
            prompt "Copy this string to save the graph", @serialise_graph( )
        $( '#load' ).click ( e ) =>
            @parse_string prompt "Paste a saved graph string here"
        $( '#add' ).click ( e ) =>
            pnt = @add_point 1, 1, prompt "What will this point be named?"
            pnt.move_with_mouse( )
        $( '#remove' ).click ( e ) =>
            @do_mouse_removal( )
        $( '#connect' ).click ( e ) =>
            @do_mouse_connection( )
        $( '#search' ).click ( e ) =>
            alert "Function not added yet!"

        # Preset test data
        @add_point 224, 118, "Alan"
        @add_point 208, 356, "Beth"
        @add_point 259, 204, "Carl"
        @add_point 363, 283, "Dave"
        @add_point 110, 85, "Elle"

        @connect @points[2], @points[1]
        @connect @points[2], @points[3]
        @connect @points[0], @points[2]
        @connect @points[4], @points[0]
        @connect @points[3], @points[1]

        # Rearranges points so that they are above the connections in the canvas
        @sort_elements( )

    # ### app.sort_elements( )
    # Sorts elements so that the points are above everything else in the SVG
    # canvas element.
    #
    # This solves the connection lines being drawn over the nodes and causing
    # buggy hover behaviour.
    sort_elements: ->
        for elem in $( 'svg circle' )
            $( elem ).appendTo $( 'svg' )[0]

    # ### app.canvas_dimensions( )
    # Gets new dimensions for what the canvas should be. The canvas should be
    # resized after this or buggy behaviour will occur.
    # #### TODO
    # * Maybe move canvas resizing behaviour into this method.
    canvas_dimensions: ->
        @wx = $( window ).width( )
        @wy = $( window ).height( )

    # ### app.add_point( )
    # Adds a node to the canvas.
    # #### Parameters
    # * `x`: X location of node
    # * `y`: Y location of node
    # * `[name]`: Name of node
    # * `[id]`: ID of node. Should only be used by save and restore routines
    #
    # **Return** -> new `point` object
    add_point: ( x, y, name = "", id ) ->
        newpoint = new point @paper, x, y, name
        if id?
            newpoint.id = id
        @points_id_map[newpoint.id] = newpoint
        @points.push newpoint
        newpoint

    # ### app.connect( )
    # Connects two nodes together.
    # #### Parameters
    # * `pointa` - The first node
    # * `pointb` - The second node
    # * `[weight]` - Weight of the the edge
    # * `[direction]` - The direction of the edge
    #
    # **Return** -> new `connection` object
    connect: ( pointa, pointb, weight = 0, direction = 0 ) ->
        newcon = new connection @paper, pointa, pointb, weight, direction
        @connections.push newcon
        @sort_elements( )
        newcon

    # ### app.do*_*mouse_connection( )
    # Handle the connection of two nodes together. Called with no parameters
    # to start the process and the subsequent objects to be connected are fed
    # as the parameter from each nodes on-click handler.
    # #### Parameters
    # * `[obj]` - A `point` object to connect
    #
    # #### TODO
    # * See if insantiation of `@connectpointa` and `@connectpointb` is
    # actually necessary
    # * Test if two points are already connected
    do_mouse_connection: ( obj ) =>
        # If not yet connecting, change state
        if @connect_mode is false
            [@connectpointa,@connectpointb] = [{id:'0'},{id:'0'}]
            @connect_mode = true
            @fade_out_toolbar "Click two nodes to connect them"
        else
            # If first point, save and contiune, else actually connect
            if @connectpointa.id is '0'
                @connectpointa = obj
            else
                @connectpointb = obj
                newcon = @connect @connectpointa, @connectpointb
                @connectpointa.r.animate
                    r: 5
                    fill: "#000",
                    100
                @connectpointb.r.animate
                    r: 5
                    fill: "#000",
                    100
                newcon.spark( )
                @connect_mode = false
                @fade_in_toolbar( )

    # ### app.do*_*mouse_removal( )
    # Handle the removal of a node. Called with no parameters to start the
    # process and when a `point` object is clicked it calls this method back
    # to perform the actual removal
    # #### Parameters
    # * `[obj]` - The `point` to remove
    do_mouse_removal: ( obj ) =>
        if @remove_mode is false
            @remove_mode = true
            @fade_out_toolbar "Click a node to remove it"
        else
            obj.remove( )
            @remove_mode = false
            @fade_in_toolbar( )

    # ### app.fade*_*out_toolbar( )
    # Fades out toolbar and shows help text for the user when necessary.
    # #### Parameters
    # * `text` - Text to display
    #
    # #### TODO
    # * Convert these two methods to a single method and toggle.
    fade_out_toolbar: ( text ) ->
        $( '#designmode' ).animate
            opacity: 0,
                complete: ->
                    $( @ ).css
                        height: 1
                    $( '#helptext' ).text( text ).animate
                        opacity: 100

    # ### app.fade*_*in_toolbar( )
    # Fades toolbar back in when it's hidden.
    # #### TODO
    # * Convert these two methods to a single method and toggle.
    fade_in_toolbar: ->
        $( '#helptext' ).animate
            opacity: 0,
                complete: ->
                    $( @ ).text ""
                    $( '#designmode' ).css( 'height', '' ).animate
                        opacity: 100

    # ### app.serialise_graph( )
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

    # ### app.clear_graph( )
    # Clears the current graph. Used by the "New" button and the restore method
    clear_graph: ->
        @points_id_map = {}
        [@points,@connections] = [[],[]]
        @paper.clear( )

    # ### app.parse_string( )
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
