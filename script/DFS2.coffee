class DFS2 extends algorithm
    current_node: root_node

    # implementing the wiki-page DFS algorithm.
    # made up the 'discover_edge', 'explored' and 'back_edge'
    # properties for a connection.
    search: ->
        explored_nodes.push root_node

        incident_edges = current_node.connections
        for c in incident_edge
          if c.explored is false
            node = edge.p
            if node.explored is false
              c.discovery_edge = true
              current_node = node
              @search
          else
            c.back_edge = true

    gen_info: ->
        alert "gen info"

    run_info: ->
        alert "run info"
