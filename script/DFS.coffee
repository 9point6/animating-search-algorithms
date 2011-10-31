class DFS extends algorithm

    # executes a depth first search given
    # a particular set of nodes, starting from 
    # the root_node (only works on a tree graph)
    search: ->
        #stack for nodes to be searched
        todo_list = []

        #push root (starting) node onto stack
        todo_list.push root_node

        # while there are nodes still left to check
        while todo_list.length is not 0
          #pull a node from the stack
          current_node = todo_list.pop

          #if current node is goal node, end the search
          if current_node is goal_node
            explored_nodes.push current_node
            break

          #add to to-do stack
          for neighbour in current_node.connections
            todo_list.push neighbour.p
            
          #add current node to explored nodes list
          explored_nodes.push current_node

          traverse_info.push
            connection: con.p.id is todo_list[todo_list.length].id for con in current_node.connections
            a_to_b: conn.c.pointa.id is current_node.id
            style_name: "visited"


    gen_info: ->
        alert "general information"

    run_info: ->
        alert "runtime information"
