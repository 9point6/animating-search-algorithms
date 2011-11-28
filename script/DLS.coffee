class DLS extends Algorithm
    name: "Depth-Limited Search"

    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    # depth-limited search starting form a root node
    # User gives a limit upon clicking animate.
    search: ->
        for node in @explored_nodes
            node.explored = false

        @explored_nodes = []
        @todo_list = []
        @_search @root_node, 4

    _search: ( node, depth ) ->
        if depth > 0
            if not node.explored
                @explored_nodes.push node

            node.explored = true

            if node is @goal_node
                return node

            for neighbour in node.edges
                @_search neighbour.n, depth-1

    gen_info: ->
        [
            "Complete"
            "O(b<sup>m</sup>)"
            "O(bm)"
            "Not Optimal"
        ]

    run_info: ->
        alert "runtime information"

    # ### DFS.create_traverse_info
    # Populates the traverse_info array for use by the
    # animate class
    # ### Parameters
    #
    create_traverse_info: ->
        @traverse_info = []

        # this array is used so connections are
        # highlighted correctly when backtracking
        fork = []

        exp_nodes = @explored_nodes.slice(0)
        # if the array reaches zero then all the elements
        # have been added to the traverse_info array.
        while exp_nodes.length isnt 0
            # get an element of the exp_nodes array, and
            # remove the element from the array.
            current_node = exp_nodes.shift( )
            # push the current_node onto the start of the array.
            @traverse_info.push current_node

            # push current_node onto the start of the array backtracking array
            fork.unshift current_node

            # if this the last node in exp_nodes array, then there is
            # no need to loop through its connections
            if exp_nodes.length isnt 0
                # loop through the nodes connections, and pick out the
                # correct connection which links to the next node in the
                # exp_nodes array.
                for edge in current_node.edges
                    # if the other node for the current connection is
                    # the node we are looking for.
                    if edge.n.id is exp_nodes[0].id
                        # add connection to the traverse_info array.
                        @traverse_info.push edge.e

                # Only runs this code if the last point is not directly
                # connected with the next point in exp_nodes array
                if @traverse_info.slice(-1)[0] instanceof Node
                    # loop through fork array for backtracking
                    for node in fork
                        # look at previous nodes connections
                        for edge in node.edges
                            # if the previous node is connected with the next node
                            # then add the connection to the traverse_info array for
                            # animation.
                            if edge.n.id is exp_nodes[0].id
                                @traverse_info.push edge.e
this.DLS = DLS
