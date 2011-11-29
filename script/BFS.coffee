class BFS extends Algorithm
    name: "Breadth-First Search"

    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    search: ->
        for node in @explored_nodes
            node.explored = false

        @explored_nodes = []
        @traverse_info = []
        @found = false
        #queue of nodes to be searched
        queue = []

        #add the root node to the front of the queue
        queue.push @root_node

        #add the root node to the set of explored nodes
        @root_node.explored = true
        @traverse_info.push @root_node

        #if the root node is the goal then end search
        if @root_node is @goal_node
            return

        #while there are still nodes in the queue
        while queue.length isnt 0

            #the new root node is the first node in the queue
            current_node = queue.shift()

            if found
                break

            if current_node is @goal_node
                @explored_nodes.push current_node
                @traverse_info.push current_node
                break

            #get the connections of the node
            neighbours = current_node.edges

            #for all the neighbours of the node
            for neighbour in neighbours
                #add the neighbour to the set of explored nodes
                if not neighbour.n.explored
                    neighbour.n.explored = true
                    @traverse_info.push neighbour.e
                    @traverse_info.push neighbour.n
                    if neighbour.n is @goal_node
                        found = true
                        break
                    queue.push neighbour.n


    # ### DFS.create_traverse_info
    # Populates the traverse_info array for use by the
    # animate class
    # ### Parameters
    #
    create_traverse_info: ->
        false

    gen_info: ->
        [
            "Complete"
            "O(b<sup>d+1</sup>)"
            "O(b<sup>d</sup>)"
            "Not Optimal"
        ]

this.BFS = BFS
