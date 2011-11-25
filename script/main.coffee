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
class Main
    # ### Class properties

    # ### app.constructor( )
    # Constructor for the app.
    # #### TODO
    # * Add cancel button to helptext mode
    # * Write a better system for preset data
    # * Replace JS prompt dialogs with nice modal ones
    constructor: ->
        @design_mode = true
        @graph = new Graph( )

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
                <li id="stepback" title="Step Back through animation" />
                <li id="run" title="Run Animation" />
                <li id="stepforward" title="Step Forward through animation" />
                <li id="design" title="Switch to design mode" />
            </ul>
            <div id="helptext" />
        </div>
        <div id="slidewrap">
            <a id="slidetoggle">
                <span>&#9679;</span>
            </a>
            <div id="slideout">
                <h2 id="title">Algorithm</h2>
                <ul id="list">
                    <li>
                        <h3>Algorithm:</h3>
                        <select id="algoselection" />
                    </li>
                    <li>
                        <h3>Completeness:</h3>
                        <p id="algodata_completeness">Blah</p>
                    </li>
                    <li>
                        <h3>Time Complexity:</h3>
                        <p id="algodata_time">Blah</p>
                    </li>
                    <li>
                        <h3>Space Complexity:</h3>
                        <p id="algodata_space">Blah</p>
                    </li>
                    <li>
                        <h3>Optimality:</h3>
                        <p id="algodata_optimality">Blah</p>
                    </li>
                </ul>
            </div>
        </div>
        <div id="algohelptext">Click for algorithm properties</div>
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
        $( '#slideout' ).css
            "margin-right": -300

        # jQuery One-Click Upload for loading
        @upload_obj = $( '<a />' ).css(
            width: "32px"
            height: "32px"
            display: "block"
        ).appendTo( '#load' ).upload
            name: 'fileup'
            action: "io.php"
            params:
                action: "load"
            onComplete: ( response ) =>
                data = $.parseJSON response
                @graph.parse_string data.data
            onSelect: ( ) ->
                @submit( )

        # Set events all UI stuff
        $( '#slidetoggle' ).hover ( ( e ) ->
            $( '#algohelptext' ).css "display", "block"
            $( '#algohelptext' ).css "opacity", 100
        ), ( e ) ->
            $( '#algohelptext' ).css "opacity", 0
        $( '#algoselection' ).change ( e ) ->
            alg = new ALGORITHMS[$( @ ).attr "value"]
            $( '#algodata_completeness' ).html alg.gen_info( )[0]
            $( '#algodata_time' ).html alg.gen_info( )[1]
            $( '#algodata_space' ).html alg.gen_info( )[2]
            $( '#algodata_optimality' ).html alg.gen_info( )[3]
            delete alg
        $( '#new' ).click ( e ) =>
            @graph.clear_graph( )
        $( '#save' ).click ( e ) =>
            # prompt "Copy this string to save the graph", @graph.serialise_graph( )
            $( '<iframe name="download" id="download" />' ).appendTo( 'body' ).hide( )
            $( """
                <form method="POST" action="io.php" target="download">
                    <input name="action" value="save" />
                    <input name="content" value="#{@graph.serialise_graph( )}" />
                    <input id="dlsubmit" type="submit" />
                </form>
            """ ).appendTo( 'body' ).hide( )
            $( '#dlsubmit' ).click( )
        #$( '#load' ).click ( e ) =>
        #    @graph.parse_string prompt "Paste a saved graph string here"
        $( '#add' ).click ( e ) =>
            pnt = @graph.add_point 1, 1, prompt "What will this point be named?"
            pnt.move_with_mouse( )
        $( '#remove' ).click ( e ) =>
            @graph.do_mouse_removal( )
        $( '#connect' ).click ( e ) =>
            @graph.do_mouse_connection( )
        $( '#search' ).click ( e ) =>
            @design_mode = false
            @current_algo = new ALGORITHMS[$( '#algoselection' ).prop "value"]
            @animate_obj = new Animate
            @animate_obj.algorithm = @current_algo
            $( '#designmode' ).animate
                opacity: 0,
                    complete: ->
                        $( @ ).css
                            display: 'none'
                        $( '#runmode' ).css( 'display', 'block' ).animate
                            opacity: 100
        $( '#process' ).click ( e ) =>
            for point in @graph.points
                if point.name is "Dave"
                    @current_algo.root_node = point
                if point.name is "Elle"
                    @current_algo.goal_node = point
            @current_algo.search( )
            @current_algo.create_traverse_info( )
        $( '#stepback' ).click ( e ) =>
            @animate_obj.step_backward( )
        $( '#run' ).click ( e ) =>
            @animate_obj.traverse( )
        $( '#stepforward' ).click ( e ) =>
            @animate_obj.step_forward( )
        $( '#design' ).click ( e ) =>
            @design_mode = true
            @animate_obj.destroy( )
            @current_algo.destroy( )
            $( '#runmode' ).animate
                opacity: 0,
                    complete: ->
                        $( @ ).css
                            display: 'none'
                        $( '#designmode' ).css( 'display', 'block' ).animate
                            opacity: 100
        $( '#slidetoggle' ).click ( e ) =>
            if $( '#slideout' ).css( "margin-right" ) is "-300px"
                $( '#slideout' ).animate
                    "margin-right": 0
            else
                $( '#slideout' ).animate
                    "margin-right": -300

        # TODO: There's gotta be a better way of doing this
        i = 0
        for algo in ALGORITHMS
            alg = new algo( )
            $( '#algoselection' ).append "<option id=\"alg#{algo.name}\" value=\"#{i++}\">#{alg.name}</option>"
            delete alg
        $( '#algDFS' ).attr "selected", "selected"
        $( '#algoselection' ).change( )

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
    # * `cancel_callback` - Function to call if cancel is clicked
    #
    # #### TODO
    # * Convert these two methods to a single method and toggle.
    fade_out_toolbar: ( text, cancel_callback ) ->
        $( '#designmode' ).animate
            opacity: 0,
                complete: ->
                    $( @ ).css
                        height: 1
                    $( '#helptext' ).text( text ).append( '''
                        <ul>
                            <li id="cancel" title="Cancel operation" />
                        </ul>
                        ''' ).animate
                        opacity: 100
                    $( '#cancel' ).click ( e ) =>
                        cancel_callback( )

    # ### app.fade*_*in_toolbar( )
    # Fades toolbar back in when it's hidden.
    # #### TODO
    # * Convert these two methods to a single method and toggle.
    fade_in_toolbar: ->
        $( '#helptext' ).animate
            opacity: 0,
                complete: ->
                    $( @ ).html ""
                    $( '#designmode' ).css( 'height', '' ).animate
                        opacity: 100

this.Main = Main
