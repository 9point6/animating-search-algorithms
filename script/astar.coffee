# Node class or point whatever the fuck its called, I'm gonna call it node
# it makes more sense. needs extra variables for the A* search to work
# costSoFar - this will be the cost to get to this node
# estimatedTotalCost - this will be the estimate cost to get to the goal node
# if we use this node in our path. It is equal to costSoFar + heuristic
# fromNode - this is the record of the node we came from to get to this one

class AStar extends Algorithm
    name: "A* Search"

    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    search: ->
        # Create the heuristic object for this particular search
        @heuristic = new Heuristics( )

        @_search( )

    _search: ->

        @destroy
        @explored_nodes = []

        openList = []       # this contains the nodes that have been visited but not yet processed
        closedList = []     # this is the list of processed nodes

        if @root_node.id is @goal_node.id # we're at the goal node so return
            return
        else
            # initialise root_nodes cost so far as 0
            # call the heuristic to estimate the total cost to the goal node
            # and add root_node to the list of open nodes
            @root_node.costSoFar = 0
            @root_node.estimatedTotalCost = 0 + @root_node.costSoFar + @heuristic.choice @heuristic_choice, @root_node, @goal_node
            openList.push @root_node

        while openList.length isnt 0

            # get the node with the smallest estimatedTotalCost
            currentNode = @getSmallestElement openList
            # find the edge that is connected to the previous node and the new current node and place
            # on the traverse_info array for animation.
            # for edge in currentNode.edges
                #if edge.n is @prev_node
                    #@traverse_info.push edge.n

            @explored_nodes.push currentNode

            if currentNode is @goal_node
                break

            #for each connection from our current node
            #if needed initialise or update costSoFar and estimatedTotalCost
            #we also need to check if this connection leads to a node that already
            #exists on the open or closed list
            #if its on the open list compare values and update if neccessary, stays on open list
            #if its on the closed list but this is a shorter path update values and put it back on the open list
            #remove it from the closed list, this will force any connections dependant on this node to be reconsidered at a later time

            for connection in currentNode.edges
                #visitable = connection.e.visitable currentNode
                if @is_from_goal?
                        visitable = connection.e.visitable currentNode, true
                    else
                        visitable = connection.e.visitable currentNode


                if visitable
                    endNode = connection.n
                    potentialCost = currentNode.costSoFar + connection.e.weight

                    if @contains closedList, endNode
                        if potentialCost < endNode.costSoFar
                            # endNode.estimatedTotalCost - endNode.costSoFar == the heuristic (OR SHOULD!)
                            endNode.estimatedTotalCost = endNode.estimatedTotalCost - endNode.costSoFar + potentialCost
                            endNode.costSoFar = potentialCost
                            @remove closedList, endNode
                            openList.push endNode
                    else if @contains openList, endNode
                        if potentialCost < endNode.costSoFar
                            # endNode.estimatedTotalCost - endNode.costSoFar == the heuristic (OR SHOULD!)
                            endNode.estimatedTotalCost = endNode.estimatedTotalCost - endNode.costSoFar + potentialCost
                            endNode.costSoFar = potentialCost
                    else
                        endNode.costSoFar = potentialCost
                        endNode.estimatedTotalCost = endNode.costSoFar + @heuristic.choice @heuristic_choice, endNode, @goal_node
                        openList.push endNode

            @remove openList, currentNode
            closedList.push currentNode
            @prev_node = currentNode

    contains: (a, obj) ->
        i = a.length
        while i--
            if a[i] is obj
                return true
        return false

    remove: (a, obj) ->
        i = a.length
        while i--
            if a[i] is obj
                a.splice(i,1)

    getSmallestElement: (a) ->
        smallNode = a[0]
        for node in a
            if smallNode.estimatedTotalCost > node.estimatedTotalCost
                smallNode = node

        return smallNode

    gen_info: ->
        [
            "Complete"
            "O(log h<sup>*</sup>(x))"
            "O(bm)"
            "Optimal"
            "needsheuristic"
        ]

    run_info: ->
        alert "run information"

    # ### DFS.create_traverse_info
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
                    # if the other node for the current connection is
                    # the node we are looking for.
                    if edge.n.id is exp_nodes[0].id
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
                                # if the previous node is connected with the next node
                                # then add the connection to the traverse_info array for
                                # animation.
                                if edge.n.id is exp_nodes[0].id
                                    @traverse_info.push edge.e
                                    found = true
                                    break

this.AStar = AStar
