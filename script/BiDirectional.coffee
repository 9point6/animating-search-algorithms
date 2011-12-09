# Part of the **Animating Search Algorithms** project
#
# ## Developers
# * [Ian Brown] (http://www.csc.liv.ac.uk/~cs8jb/)
# * [Jack Histon] (http://www.csc.liv.ac.uk/~cs8jrh/)
# * [Colin Jackson] (http://www.csc.liv.ac.uk/~cs8cj/)
# * [Jennifer Jones] (http://www.csc.liv.ac.uk/~cs8jlj/)
# * [John Sanderson] (http://www.csc.liv.ac.uk/~cs8js/)
#
# Do not modify or distribute without permission.

# ## Main Documentation

# BiDi algorithm class

class BiDirectional extends Algorithm
    name: "Bi-Directional Search"

    constructor: ->
        @alg = []

    pre_run: ->
        console.log @alg
#         if @alg[1] instanceof AStar
#             @alg[1].heuristic_choice = 0
#         if @alg[2] instanceof AStar
#             @alg[2].heuristic_choice = 0
        @alg[1].root_node = @root_node
        @alg[1].goal_node = @goal_node
        @alg[1].search( )
        @alg[1].create_traverse_info( )
        @traverse_info_start = @alg[1].traverse_info.slice(0)

        for node in APP.graph.nodes
            node.explored = false

        @alg[2].root_node = @goal_node
        @alg[2].goal_node = @root_node
        @alg[2].is_from_goal = true
        @alg[2].search( )
        @alg[2].create_traverse_info( )
        @traverse_info_goal = @alg[2].traverse_info.slice(0)

    destroy: ->
        for node in APP.graph.nodes
            delete node.explored
        super

    search: ->
        @traverse_info = []
        @explored_nodes = []
        searched_from_goal = []
        searched_from_start = []
        combinedArrayLength = @traverse_info_start.length + @traverse_info_goal.length
        i = 0
        while i < combinedArrayLength
            if i < @traverse_info_start.length
                @traverse_info.push @traverse_info_start[i]
                searched_from_start.push @traverse_info[@traverse_info.length-1]

                if @contains searched_from_goal, searched_from_start[searched_from_start.length-1]
                    return

                if @traverse_info[@traverse_info.length-1] instanceof Edge
                    if @traverse_info_start[i]?
                        if @containsById searched_from_start, @traverse_info_start[i].nodea
                            if @containsById searched_from_goal, @traverse_info_start[i].nodeb
                                return
                        else if @containsById searched_from_start, @traverse_info_start[i].nodeb
                            if @containsById searched_from_goal, @traverse_info_start[i].nodea
                                return

            if i < @traverse_info_goal.length
                @traverse_info.push @traverse_info_goal[i]
                searched_from_goal.push @traverse_info[@traverse_info.length-1]

                if @contains searched_from_start, searched_from_goal[searched_from_goal.length-1]
                    return

                if @traverse_info[@traverse_info.length-1] instanceof Edge
                    if @traverse_info_start[i]?
                        if @containsById searched_from_start, @traverse_info_start[i].nodea
                            if @containsById searched_from_goal, @traverse_info_start[i].nodeb
                                return
                        else if @containsById searched_from_start, @traverse_info_start[i].nodeb
                            if @containsById searched_from_goal, @traverse_info_start[i].nodea
                                return

            i++

    contains: (a, obj) ->
        i = a.length
        while i--
            if a[i]? and obj?
                if a[i] is obj
                    return true
        return false

    containsById: (a, obj) ->
        i = a.length
        while i--
            if a[i].id? and obj.id?
                if a[i].id is obj.id
                    return true
        return false

    gen_info: ->
        [
            "Complete"
            "O(b<sup>m</sup>)"
            "O(bm)"
            "Not Optimal"
            "bidi"
        ]

    run_info: ->
        alert "stuff"

    create_traverse_info: ->
        false

this.BiDirectional = BiDirectional
