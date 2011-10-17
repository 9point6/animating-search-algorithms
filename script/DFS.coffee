class DFS extends algorithm

    search: ->
        explored_nodes.push root_node.id
        root_node.animate "working"

        for connection in root_node.connections
          if connection.p.id not in explored_nodes
             
            
          # for looking at the point
          connection.p
          # for looking at the connection
          connection.c

    gen_info: ->
        alert "general information"

    run_info: ->
        alert "runtime information"
