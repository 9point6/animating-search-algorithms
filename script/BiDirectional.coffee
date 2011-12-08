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

    pre_run: ->
        @alg1 = new BFS( )
        @alg2 = new BFS( )
        @alg1.root_node = @root_node
        @alg1.goal_node = @goal_node
        @alg1.search( )
        @alg1.create_traverse_info( )
        @traverse_info_start = @alg1.traverse_info.slice(0)

        for node in APP.graph.nodes
            node.explored = false

        @alg2.root_node = @goal_node
        @alg2.goal_node = @root_node
        @alg2.is_from_goal = true
        @alg2.search( )
        @alg2.create_traverse_info( )
        @traverse_info_goal = @alg2.traverse_info.slice(0)

    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    search: ->
        pointer = 0
        for item in @traverse_info_start
            @traverse_info.push item
            pointer++
            for item2 in @alg2.traverse_info
                pointer2 = 0
                if item instanceof Node and item2 instanceof Node
                    if item.id is item2.id
                        #@traverse_info.push item2
                        return
                pointer2++
                if pointer2 is pointer
                    break

            if @traverse_info_goal[0]?
                @traverse_info.push @traverse_info_goal.shift( )

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
