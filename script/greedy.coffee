# Part of the **Animating Search Algorithms** project
#
# ## Developers
# * [Ian Brown] (http://www.csc.liv.ac.uk/~cs8jb/)
# * [Jack Histon] (http://www.csc.liv.ac.uk/~cs8jrh/)
# * [Colin Jackson] (http://www.csc.liv.ac.uk/~cs8cj/)
# * [Jennifer Jones] (http://www.csc.liv.ac.uk/~cs8jlj/)
# * [John Sanderson] (http://www.csc.liv.ac.uk/~cs8js/)
#
# Do not modify or distribute without permission.

# ## Main Documentation

# Greedy algorithm class

class Greedy extends Algorithm
    name: "Greedy Search"

    # ### Greedy.destroy( )
    # This resets every node to unexplored again
    # #### TODO
    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    # ### Greedy.search( )
    # Calls the _search method which does the actual work
    # #### TODO
    search: ->
        # Create the heuristic object for this particular search
        @heuristic = new Heuristics( )

        @_search( )

    # ### Greedy._search( )
    # Searches form the root node for a goal node. Uses an A* Search method.
    # #### TODO
    _search: ->

        @destroy
        @explored_nodes = []

        openList = []

        if @root_node.id is @goal_node.id
            return
        else
            @root_node.costSoFar = 0
            @root_node.estimatedTotalCost = 0 + @root_node.costSoFar + @heuristic.choice @heuristic_choice, @root_node, @goal_node
            openList.push @root_node
            currentNode = @root_node

        while openList.length isnt 0

            openList = []
            currentNode.explored = true
            console.log currentNode
            @explored_nodes.push currentNode

            if currentNode is @goal_node
                break

            if currentNode?
                for connection in currentNode.edges
                    if @is_from_goal?
                        visitable = connection.e.visitable currentNode, true
                    else
                        visitable = connection.e.visitable currentNode

                    endNode = connection.n

                    if visitable and not endNode.explored
                        potentialCost = currentNode.costSoFar + connection.e.weight
                        endNode.costSoFar = potentialCost
                        endNode.estimatedTotalCost = endNode.costSoFar + @heuristic.choice @heuristic_choice, endNode, @goal_node
                        openList.push endNode
            else
                break

            currentNode = @getSmallestElement openList

    # ### Greedy.remove( )
    # Removes and element from an array
    # #### Parameters
    # * `a` - Array to search in
    # * `obj` - the object to search for
    # #### TODO
    remove: (a, obj) ->
        i = a.length
        while i--
            if a[i] is obj
                a.splice(i,1)

    # ### Greedy.getSmallestElement( )
    # Gets the element with the smallest "estimatedTotalCost" in the array given
    # #### Parameters
    # * `a` - the array to search in
    # #### TODO
    getSmallestElement: (a) ->
        smallNode = a[0]
        for node in a
            if smallNode.estimatedTotalCost > node.estimatedTotalCost
                smallNode = node

        return smallNode

    # ### Greedy.gen_info( )
    # General information about the greedy search method
    # #### TODO
    gen_info: ->
        [
            "Complete"
            "Variable"
            "O(V)"
            "Optimal"
            "needsheuristic"
        ]

    # ### Greedy.run_info( )
    # Running information for the specific instance of this algorithm
    # #### TODO
    run_info: ->
        alert "run information"

    # ### Greedy.create_traverse_info( )
    # Populates the traverse_info array for use by the
    # animate class
    # ### Parameters
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

            # push current_node onto the start of the backtracking array
            fork.unshift current_node

            # if this the last node in exp_nodes array, then there is
            # no need to loop through its connections
            if exp_nodes.length isnt 0
                # loop through the nodes connections, and pick out the
                # correct connection which links to the next node in the
                # exp_nodes array.
                for edge in current_node.edges
                    if @is_from_goal?
                        visitable = edge.e.visitable current_node, true
                    else
                        visitable = edge.e.visitable current_node

                    # if the other node for the current connection is
                    # the node we are looking for.
                    if edge.n.id is exp_nodes[0].id and visitable
                        # add connection to the traverse_info array.
                        @traverse_info.push edge.e

                # Only runs this code if the last point is not directly
                # connected with the next point in exp_nodes array
                if @traverse_info.slice(-1)[0] instanceof Node
                    found = false
                    # loop through fork array for backtracking
                    for node in fork
                        # stop looping if the edge has been found
                        if not found
                            # look at previous nodes connections
                            for edge in node.edges
                                if @is_from_goal?
                                    visitable = edge.e.visitable node, true
                                else
                                    visitable = edge.e.visitable node

                                # if the previous node is connected with the next node
                                # then add the connection to the traverse_info array for
                                # animation.
                                if edge.n.id is exp_nodes[0].id and visitable
                                    @traverse_info.push edge.e
                                    found = true
                                    break

this.Greedy = Greedy
