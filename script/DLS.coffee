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

class DLS extends Algorithm
    name: "Depth-Limited Search"

    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    # ### DLS.search( )
    # initialises everything to perform a depth limited search.
    # The depth limit is taken from the user interface
    search: ->
        for node in @explored_nodes
            node.explored = false

        #reset explored_nodes and traverse_info
        @explored_nodes = []
        @traverse_info = []

        # For every element in explored_nodes, explored_parents stores its parent.
        # Necessary as the same node can appear several times in explored_nodes, each with a different parent
        # The parent of the root node is the root node
        @explored_parents = []

        #path_edges stores - for each element in explored_nodes - all the edges that lead from the root node to it.
        # This is populated using explored_parents
        @path_edges = []

        #if a solution is found, return true
        @is_found = false

        #Perform DLS search
        @_search @root_node, @depth, @root_node

        #create the path info for each explored node
        @create_path_info()

    # ### DLS._search( node, depth, prev_node )
    # executes a depth limited search by recursively
    # going deeper from a node until the maximum depth
    # is achieved
    # #### Parameters
    # * `node` - Current node being explored
    # * `depth` - Current depth of the search
    # * `prev_node` - Previous instance of 'node'; used for explored_parents
    _search: ( node, depth, prev_node ) ->

        #Only continue along this path if we haven't expired the maximum depth
        if (depth >= 0)

            # Push node onto explored_nodes and traverse_info, and node's parent onto explored_parents.
            # For this implementation, the root is the parent of itself.
            @explored_nodes.push node
            @explored_parents.push prev_node
            @traverse_info.push node

            # if node is the goal node, come out of the search
            if node is @goal_node
                @is_found = true
                return node

            # For every edge connected to node
            for neighbour in node.edges

                # if edge is undirected or directed away from current node, mark is as visitable
                if @is_from_goal?
                    visitable = neighbour.e.visitable node, true
                else
                    visitable = neighbour.e.visitable node

                # if edge is visitable
                if visitable
                    # if the edge isn't the node we've just come from, continue search
                    if neighbour.n.id isnt prev_node.id
                        # if max depth not yet reached, push the edge onto traverse_info
                        if depth > 0
                            @traverse_info.push neighbour.e
                        # perform DLS search with new node from the other end of the edge, a decremented depth
                        # prev_node as the node we've just explored
                        @_search neighbour.n, depth-1, node

                        # if solution is found (ie, exiting the recursion), break the loop and terminate search
                        if @is_found
                            break

    gen_info: ->
        [
            "Complete if depth bound correct"
            "O(|V|+|E|)"
            "O(|V|)"
            "Not Optimal"
            "needsdepth"
        ]

    run_info: ->
        alert "runtime information"

    create_traverse_info: ->
        false

    # ### DLS.create_path_info
    # creates the path info necessary to make a path from
    # each node in explored_nodes to the root.
    # It does so by looking at the parent of each node
    # then the parent of that parent, and so forth, until
    # the root is reached.
    # By traversing explored_nodes and explored_parents in
    # reverse we know that the last instance of the parent
    # in explored_nodes must be the path that was taken
    # ###
    create_path_info: ->

        # create reverse versions of explored_nodes and explored_parents
        # for traversal
        rev_explored = @explored_nodes.reverse()
        rev_explored_parents = @explored_parents.reverse()

        # for each element in the reverse explored_nodes store
        # the edges needed to create the path
        for i in [0...rev_explored.length]
            # create a temporary array which will hold all
            # the nodes on the path. The first node on the
            # path is the element we are currently exploring
            out_sub = [rev_explored[i]]

            # reset a temporary array which will store the
            # edges that connect all the nodes on the current path
            out_edges = []

            # current stores the node we now want to find the parent of
            current = rev_explored_parents[i]

            # explore all the edges connected to current until
            # we find the one that connects current to the
            # last node we added as part of the path - push this
            # onto out_edges
            for edge in current.edges
                if edge.n.id is out_sub.slice(-1)[0].id
                    out_edges.push edge.e

            # traverse backwards through explored_parents
            # until we find current. This allows us to reset
            # current to be the parent of current, and repeat
            # until the root.
            j = i
            while (j isnt rev_explored_parents.length - 1)
                j++
                # if we find current in reverse_explored then
                # push current onto the array holding all the
                # nodes on the path (out_sub), and reset current.
                if rev_explored[j].id is current.id
                    out_sub.push rev_explored[j]
                    current = rev_explored_parents[j]

                    # explore all the edges connected to current
                    # until we find the one that connects current
                    # to the last node we added as part of the path
                    # and push onto out_sub
                    for edge in current.edges
                        if edge.n.id is out_sub.slice(-1)[0].id
                            out_edges.push edge.e

            # Store all the edges that are required to make a path from
            # explored_nodes[i] in path_edges[i]
            @path_edges[i] = out_edges.reverse()
        @path_edges.reverse()

this.DLS = DLS
