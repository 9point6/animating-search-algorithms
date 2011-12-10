class DLS extends Algorithm
    name: "Depth-Limited Search"

    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    # depth-limited search starting form a root node
    # User gives a limit upon clicking animate.
    search: ->
        for node in @explored_nodes
            node.explored = false

        @explored_nodes = []
        @todo_list = []
        @path_info = []
        @path_edges = []
        @is_found = false
        @traverse_info = []
        @_search @root_node, @depth, @root_node
        @create_path_info()

    _search: ( node, depth, prev_node ) ->
        if (depth >= 0)
            #if not node.explored
            #@explored_nodes.push node

            #node.explored = true
            @explored_nodes.push node
            @path_info.push prev_node
            @traverse_info.push node

            if node is @goal_node
                @is_found = true
                return node

            for neighbour in node.edges
                if @is_from_goal?
                    visitable = neighbour.e.visitable node, true
                else
                    visitable = neighbour.e.visitable node

                if visitable
                    if neighbour.n.id isnt prev_node.id
                        if depth > 0
                            @traverse_info.push neighbour.e
                        @_search neighbour.n, depth-1, node
                        if @is_found
                            break

    gen_info: ->
        [
            "Complete if depth bound correct"
            "O(|V|+|E|)"
            "O(|V|)"
            "Not Optimal"
            "needsdepth"
        ]

    run_info: ->
        alert "runtime information"

    create_traverse_info: ->
        false

    create_path_info: ->
        console.log("creating path info...")
        rev_explored = @explored_nodes.reverse()
        rev_path_info = @path_info.reverse()
        #path_edges = []
        for i in [0...rev_explored.length]
            out_sub = [rev_explored[i]]
            out_edges = []
            current = rev_path_info[i]
            for edge in current.edges
                if edge.n.id is out_sub.slice(-1)[0].id
                    out_edges.push edge.e
            j = i
            while (j isnt rev_path_info.length - 1)
                j++
                if rev_explored[j].id is current.id
                    out_sub.push rev_explored[j]
                    current = rev_path_info[j]
                    for edge in current.edges
                        if edge.n.id is out_sub.slice(-1)[0].id
                            out_edges.push edge.e
            @path_info[i] = out_sub.reverse()
            @path_edges[i] = out_edges.reverse()
        @path_info.reverse()
        @path_edges.reverse()
        console.log(@path_info)
        console.log(@path_edges)

this.DLS = DLS
