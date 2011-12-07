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
                <li id="setnodes" title="Set root and goal nodes" />
                <li id="process" title="Process Graph" />
                <li id="stepback" title="Step Back through animation" />
                <li id="run" title="Run Animation" />
                <li id="stop" title="Stop Animation" />
                <li id="stepforward" title="Step Forward through animation" />
                <li id="reset" title="Reset the animation" />
                <li id="settings" title="Settings Dialog" />
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
        $( '#algoselection' ).change ( e ) =>
            if @current_algo
                root = @current_algo.root_node
                goal = @current_algo.goal_node
                @animate_obj.destroy( )
                @current_algo.destroy( )
                @current_algo = new ALGORITHMS[$( '#algoselection' ).prop "value"]
                @current_algo.root_node = root
                @current_algo.goal_node = goal
                @animate_obj = new Animate
                @animate_obj.algorithm = @current_algo
            alg = new ALGORITHMS[$( '#algoselection' ).attr "value"]
            $( '.algoextra' ).remove( )
            $( '#algodata_completeness' ).html alg.gen_info( )[0]
            $( '#algodata_time' ).html alg.gen_info( )[1]
            $( '#algodata_space' ).html alg.gen_info( )[2]
            $( '#algodata_optimality' ).html alg.gen_info( )[3]
            if alg.gen_info( )[4]?
                extras = $( '#list' )
                if alg.gen_info( )[4].indexOf( 'needsheuristic' ) isnt -1
                    # TODO: automate
                    extras.append li = $( "<li class=\"algoextra\" />" )
                    li.append "<h3>Heuristic:</h3>"
                    li.append combo = $( "<select id=\"algoheuristic\">" )
                    combo.append "<option selected=\"selected\" value=\"0\">None</option>"
                    combo.append "<option value=\"1\">Euclidian</option>"
                    combo.change ( e ) =>
                        if @current_algo
                            @current_algo.heuristic_choice = $( e.target ).val( )
                if alg.gen_info( )[4].indexOf( 'bidi' ) isnt -1
                    for i in [1..2]
                        extras.append li = $( "<li class=\"algoextra\" />" )
                        li.append "<h3>Algorithm #{i}:</h3>"
                        li.append combo = $( "<select id=\"algobidi#{i}\">" )
                        j = 0
                        for algo in ALGORITHMS
                            a = new algo( )
                            if not ( a instanceof BiDirectional )
                                combo.append "<option id=\"bd#{i}-alg#{algo.name}\" value=\"#{j++}\">#{a.name}</option>"
                                combo.change ( e ) =>
                                    # TODO: Change in bidi
                                    false
                            delete a
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
            modal = new Modal
                title: "New Node"
                fields:
                    "name":
                        type: "text"
                        label: "Node name"
                cancel: "Cancel"
                callback: ( r ) =>
                    node = @graph.add_node 1, 1, r.name
                    node.move_with_mouse( )
            modal.show( )
        $( '#remove' ).click ( e ) =>
            @graph.do_mouse_removal( )
        $( '#connect' ).click ( e ) =>
            @graph.do_mouse_connection( )
        $( '#search' ).click ( e ) =>
            @design_mode = false
            @current_algo = new ALGORITHMS[$( '#algoselection' ).prop "value"]
            if @current_algo instanceof AStar
                @current_algo.heuristic_choice = $( '#algoheuristic' ).val( )
            @animate_obj = new Animate
            @animate_obj.algorithm = @current_algo
            $( '#designmode' ).animate
                opacity: 0,
                    complete: ->
                        $( @ ).hide( )
                        $( '#runmode' ).show( ).animate
                            opacity: 100
            $( '#slideout' ).animate
                "margin-right": 0
        $( '#setnodes' ).click ( e ) =>
            @graph.remove_root_and_goal_nodes( )
            @fade_out_toolbar "Select root node", =>
                if @current_algo.root_node?
                    @current_algo.root_node.update_style "normal"
                if @current_algo.goal_node?
                    @current_algo.goal_node.update_style "normal"
                @graph.remove_root_and_goal_nodes( )
                @root_select_mode = false
                @goal_select_mode = false
                @fade_in_toolbar( )
            @root_select_mode = true
        $( '#process' ).click ( e ) =>
            if @current_algo.root_node? and @current_algo.goal_node?
                @current_algo.search( )
                @current_algo.create_traverse_info( )
            else
                modal = new Modal
                    title: "Root or goal nodes not selected"
                    intro: "You need to set a goal and root node before running the algorithm."
                modal.show( )
        $( '#stepback' ).click ( e ) =>
            @animate_obj.step_backward( )
        $( '#run' ).click ( e ) =>
            if @current_algo.traverse_info[0]?
                @animate_obj.traverse( )
            else
                modal = new Modal
                    title: "You have not run the algorithm"
                    intro: "Press okay to run now and then animate"
                    cancel: "Cancel"
                    callback: ( r ) =>
                        $( '#process' ).click( )
                        if @current_algo.traverse_info[0]?
                            $( '#run' ).click( )
                modal.show( )
        $( '#stop' ).click ( e ) =>
            @animate_obj.stop( )
        $( '#stepforward' ).click ( e ) =>
            @animate_obj.step_forward( )
        $( '#reset' ).click ( e ) =>
            @animate_obj.reset( )
        $( '#settings' ).click ( e ) =>
            alert "not yet implemented"
        $( '#design' ).click ( e ) =>
            @design_mode = true
            @graph.remove_root_and_goal_nodes( )
            @animate_obj.destroy( )
            @current_algo.destroy( )
            $( '#runmode' ).animate
                opacity: 0,
                    complete: ->
                        $( @ ).hide( )
                        $( '#designmode' ).show( ).animate
                            opacity: 100
            $( '#slideout' ).animate
                "margin-right": -300
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
        @graph.add_node 224, 118, "Alan"
        @graph.add_node 208, 356, "Beth"
        @graph.add_node 259, 204, "Carl"
        @graph.add_node 363, 283, "Dave"
        @graph.add_node 110, 85, "Elle"

        @graph.connect @graph.nodes[2], @graph.nodes[1], 3, -1
        @graph.connect @graph.nodes[2], @graph.nodes[3], 2, 1
        @graph.connect @graph.nodes[0], @graph.nodes[2], 8, 0
        @graph.connect @graph.nodes[4], @graph.nodes[0], 4, 0
        @graph.connect @graph.nodes[3], @graph.nodes[1], 2, 1

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
        tb = if @design_mode then $( '#designmode' ) else $( '#runmode' )
        tb.animate
            opacity: 0,
                complete: ->
                    $( @ ).css
                        height: 1
                        "margin-top": -100
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
                    tb = if APP.design_mode then $( '#designmode' ) else $( '#runmode' )
                    tb.css(
                        height: '',
                        "margin-top": ''
                    ).animate
                        opacity: 100

    change_help_text: ( text ) ->
        $( '#helptext' ).text text

this.Main = Main
