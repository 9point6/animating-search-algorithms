class DFS extends algorithm

    search: ->
        todo_list = []

        todo_list.push root_node

        while todo_list.length is not 0
          current_node = todo_list.pull

          if current_node is goal_node
            explored_nodes.push current_node
            break

          neighbours = current_node.connections
          
          for neighbour in neighbours
            todo_list.push neighbour.p

          explored_nodes.push current_node


    gen_info: ->
        alert "general information"

    run_info: ->
        alert "runtime information"
