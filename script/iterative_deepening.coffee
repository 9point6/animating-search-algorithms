class IterativeDeepening extends Algorithm

    name: "Iterative Deepening"

    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    # depth-limited search starting form a root node
    # User gives a limit upon clicking animate.
    search: ->
        for node in @explored_nodes
            node.explored = false

        #@temp_explored_nodes = []
        @explored_nodes = []
        #@temp_path_info = []
        @path_info = []
        @path_edges = []
        @is_found = false
        @traverse_info = []


        @max_depth = 3
        depth = 0
        while ((@is_found is false) and (depth < @max_depth))
            #@explored_nodes = []
            #@path_info = []
            #console.log(depth)
            @_search @root_node, depth, @root_node
            depth = depth + 1

            #for node in @explored_nodes
            #    @temp_explored_nodes.push node
            #for node in @path_info
            #    @temp_path_info.push node
        #@explored_nodes = @temp_explored_nodes
        console.log(@explored_nodes)
        #@path_info = @temp_path_info
        console.log(@path_info)
        @create_path_info()

    _search: ( node, depth, prev_node ) ->
        if (depth >= 0)
            #if not node.explored
            #@explored_nodes.push node

            #node.explored = true
            @explored_nodes.push node
            @path_info.push prev_node
            console.log "#{prev_node.name}"
            console.log @path_info[@path_info.length-1]
            @traverse_info.push node

            if node is @goal_node
                @is_found = true
                return node

            for neighbour in node.edges
                if neighbour.e.visitable node
                    if neighbour.n.id isnt prev_node.id
                        if depth > 0
                            @traverse_info.push neighbour.e
                        @_search neighbour.n, depth-1, node
                        if @is_found
                            break

    create_traverse_info: ->

    gen_info: ->
        [
            "Complete"
            "O(|V|+|E|)"
            "O(|V|)"
            "Optimal"
            "needsmaxdepth"
        ]

    run_info: ->
      alert "runtime information"

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

this.IterativeDeepening = IterativeDeepening
