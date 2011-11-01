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

    gen_info: ->
        alert "general information"

    run_info: ->
        alert "runtime information"

    # ### DFS.create_traverse_info
    # Populates the traverse_info array for use by the
    # animate class
    # ### Parameters
    #
    create_traverse_info: ->
        exp_nodes = explored_nodes

        # Animate class with traverse through the traverse_info
        # array. It will animate the nodes and connections
        # in the order this array has placed them. The traverse_info
        # array is populated based on the order of the explored_nodes
        # array the algorithm has produced.
        while exp_nodes.length is not 0

          # get the first element of the explored_nodes array, and
          # remove the element from the array.
          current_node = exp_nodes.shift()

          # push the current_node onto the start of the array. Push
          # was not used here, as the animate class would have to
          # go through the array in reverse. Makes building the animate
          # class easier
          traverse_info[0...0] = current_node
     
          # if this the last node in exp_nodes array, then there is
          # no need to loop through its connections.
          if exp_nodes.length is not 0
            # loop through the nodes connections, and pick out the
            # correct connection which links to the next node in the
            # exp_nodes array.
            for con in current_node.connections

              # if the other node for the current connection is
              # the node we are looking for.
              if con.p.id is exp_nodes[0..0].id

                # add conneciton to the traverse_info array.
                traverse_info[0...0] = con
          else
            break
