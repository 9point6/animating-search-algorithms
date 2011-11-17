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

    # ### app.constructor( )
    # Constructor for the app.
    # #### TODO
    # * Add cancel button to helptext mode
    # * Write a better system for preset data
    # * Replace JS prompt dialogs with nice modal ones
    constructor: ->
        @graph = new graph( )

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
            <ul id="runmode">
                <li id="process" title="Process Graph" />
                <li id="run" title="Run Animation" />
                <li id="design" title="Switch to design mode" />
            </ul>
            <div id="helptext" />
        </div>
        <div id="copyright">
            <a href="doc">Project Home</a>
        <div>
        ''' );

        # Set the helptext div to be invisible for animation.
        $( '#helptext' ).css
            opacity: 0
        $( '#runmode' ).css
            opacity: 0
            display: "none"

        # Set click events for toolbar buttons
        $( '#new' ).click ( e ) =>
            @graph.clear_graph( )
        $( '#save' ).click ( e ) =>
            prompt "Copy this string to save the graph", @graph.serialise_graph( )
        $( '#load' ).click ( e ) =>
            @graph.parse_string prompt "Paste a saved graph string here"
        $( '#add' ).click ( e ) =>
            pnt = @graph.add_point 1, 1, prompt "What will this point be named?"
            pnt.move_with_mouse( )
        $( '#remove' ).click ( e ) =>
            @graph.do_mouse_removal( )
        $( '#connect' ).click ( e ) =>
            @graph.do_mouse_connection( )
        $( '#search' ).click ( e ) =>
            $( '#designmode' ).animate
                opacity: 0,
                    complete: ->
                        $( @ ).css
                            display: 'none'
                        $( '#runmode' ).css( 'display', 'block' ).animate
                            opacity: 100
        $( '#process' ).click ( e ) =>
            @current_algo = new algorithms[1]
            @current_algo.search( )
            @current_algo.create_traverse_info( )
            console.log @current_algo.traverse_info
            console.log @current_algo.explored_nodes
        $( '#run' ).click ( e ) =>
            alert "Function not added yet!"
        $( '#design' ).click ( e ) =>
            $( '#runmode' ).animate
                opacity: 0,
                    complete: ->
                        $( @ ).css
                            display: 'none'
                        $( '#designmode' ).css( 'display', 'block' ).animate
                            opacity: 100

        # Preset test data
        @graph.add_point 224, 118, "Alan"
        @graph.add_point 208, 356, "Beth"
        @graph.add_point 259, 204, "Carl"
        @graph.add_point 363, 283, "Dave"
        @graph.add_point 110, 85, "Elle"

        @graph.connect @graph.points[2], @graph.points[1]
        @graph.connect @graph.points[2], @graph.points[3]
        @graph.connect @graph.points[0], @graph.points[2]
        @graph.connect @graph.points[4], @graph.points[0]
        @graph.connect @graph.points[3], @graph.points[1]

        # Rearranges points so that they are above the connections in the canvas
        @graph.sort_elements( )

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
