//# Node class or point whatever the fuck its called, I'm gonna call it node
//# it makes more sense. needs extra variables for the A* search to work
//# costSoFar - this will be the cost to get to this node
//# estimatedTotalCost - this will be the estimate cost to get to the goal node
//# if we use this node in our path. It is equal to costSoFar + heuristic
//# fromNode - this is the record of the node we came from to get to this one

class DFS extends Algorithm
    name: "A* Search"

    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    search: (heuristic) ->

        @destroy
        @explored_nodes = []

        openList = []       # this contains the nodes that have been visited but not yet processed
        closedList = []     # this is the list of processed nodes

        if @root_node.id is @goal_node.id #// we're at the goal node so return
            break
        else
            #initialise root_nodes cost so far as 0
            # call the heuristic to estimate the total cost to the goal node
            # and add root_node to the list of open nodes
            root_node.costSoFar = 0
            root_node.estimatedTotalCost = @root_node.costSoFar + heuristic(root_node, goal_node)
            openList.push @root_node

        while openList.length isnt 0

            # get the node with the smallest estimatedTotalCost
            currentNode = @getSmallestElement openList
            @explored_nodes.push
            #for each connection from our current node
            #if needed initialise or update costSoFar and estimatedTotalCost
            #we also need to check if this connection leads to a node that already
            #exists on the open or closed list
            #if its on the open list compare values and update if neccessary, stays on open list
            #if its on the closed list but this is a shorter path update values and put it back on the open list
            #remove it from the closed list, this will force any connections dependant on this node to be reconsidered at a later time


            for connection in currentNode.edges
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
                    endNode.estimatedTotalCost = endNode.costSoFar + heuristic(endNode, @goal_node)
                    openList.push endNode

                @remove openList, currentNode
                closedList.push currentNode

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

