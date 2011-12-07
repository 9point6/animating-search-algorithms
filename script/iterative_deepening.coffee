class IterativeDeepening extends Algorithm

    name: "Iterative Deepening"

    # Iterative Deepening starting form a root node
    # User gives a limit upon clicking animate.
    search: ->
        #stack for nodes to be searched
        todo_list = []

        #limit of search
        limit = 1

        #push root node onto the stack
        todo_list.push root_node

        # while there are still nodes outside the
        # boundary of the limit.
        while todo_list.length < limit

            # while there are nodes still left to check
            while todo_list.length is not 0
                current_node = todo_list.pull

                # If the goal node is the current node, end the search
                if current_node is goal_node
                    explored_nodes.push current_node
                    break

                #get the connections of the current node
                neighbours = current_node.edges

                for neighbour in neighbours
                    todo_list.push neighbour.n

                    # add the node to the explored nodes array and
                    # the connection to the explored connections array
                    explored_nodes.push neighbour.n
                    explored_edges.push neighbour.e

            limit++

    gen_info: ->
        [
            "Complete"
            "O(b<sup>d+1</sup>)"
            "O(bd)"
            "Not Optimal"
        ]

    run_info: ->
      alert "runtime information"

this.IterativeDeepening = IterativeDeepening
