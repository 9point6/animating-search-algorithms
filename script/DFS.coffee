class DFS extends algorithm

    # executes a depth first search given
    # a particular set of nodes, starting from 
    # the root_node
    search: ->
        #stack for nodes to be searched
        todo_list = []

        #push root (starting) node onto stack
        todo_list.push root_node

        # while there are nodes still left to check
        while todo_list.length is not 0
          #pull a node from the stack
          current_node = todo_list.pull

          #if current node is goal node, end the search
          if current_node is goal_node
            explored_nodes.push current_node
            break

          #get the connections of the current node
          neighbours = current_node.connections
          
          #add to to-do stack
          for neighbour in neighbours
            todo_list.push neighbour.p

          #add current node to explored nodes list
          explored_nodes.push current_node


    gen_info: ->
        alert "general information"

    run_info: ->
        alert "runtime information"
