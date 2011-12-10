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

# BiDirectional algorithm class

class BiDirectional extends Algorithm
    name: "Bi-Directional Search"

    # ### BiDirectional.constructor( )
    # Constructor for BiDirectional search .
    # #### TODO
    constructor: ->
        @alg = []

    # ### BiDirectional.pre_run( )
    # Used to run the two algorithms given before sorting into
    # two arrays. One algorithm will run from the root node, the other
    # from the goal node.
    # #### TODO
    pre_run: ->
        # Prepare and run the first algorithm given
        @alg[1].root_node = @root_node
        @alg[1].goal_node = @goal_node
        @alg[1].search( )
        @alg[1].create_traverse_info( )
        @traverse_info_start = @alg[1].traverse_info.slice(0)

        # Reset the nodes on the graph
        for node in APP.graph.nodes
            node.explored = false

        # Prepare and run the second algorithm given
        @alg[2].root_node = @goal_node
        @alg[2].goal_node = @root_node
        @alg[2].is_from_goal = true
        @alg[2].search( )
        @alg[2].create_traverse_info( )
        @traverse_info_goal = @alg[2].traverse_info.slice(0)

    # ### BiDirectional.destroy( )
    # This resets every node to unexplored again
    # #### TODO
    destroy: ->
        for node in APP.graph.nodes
            delete node.explored
        delete @alg
        super

    # ### BiDirectional.search( )
    # This concatenates the traverse_info array from @alg[1] and @alg[2],
    # stopping at when they meet
    # #### TODO
    search: ->
        # Reset/instantiate all arrays
        @traverse_info = []
        @explored_nodes = []
        @searched_from_goal = []
        @searched_from_start = []

        # Loop at least until all nodes have been covered in each array
        combinedArrayLength = @traverse_info_start.length + @traverse_info_goal.length

        i = 0
        while i < combinedArrayLength
            # If we haven't reached the end of the array for algorithm 1
            if i < @traverse_info_start.length
                # Add element to traverse_info
                @add_to_traverse_info @traverse_info_start, i
                # Add to list of already searched items from start node
                @searched_from_start.push @get_last_element_of @traverse_info

            # Check if there is a crossover after adding this item
            if @check_for_crossover @searched_from_goal, @searched_from_start
                break

            # If we haven't reached the end of the array for algorithm 2
            if i < @traverse_info_goal.length
                # Add element to traverse_info
                @add_to_traverse_info @traverse_info_goal, i
                # Add to list of already searched items from goal node
                @searched_from_goal.push @get_last_element_of @traverse_info

            # Check if there is a crossover after adding this item
            if @check_for_crossover @searched_from_start, @searched_from_goal
                break

            # Loop through checking all items in
            # @traverse_info_start and @traverse_info_goal
            i++

    # ### BiDirectional.check_for_crossover( )
    # Checks if there is a crossover between array1 and array2 i.e. array1 contains
    # an element from array2
    # #### Parameters
    # * `array1` - First array to check
    # * `array2` - Second array to check
    #
    # #### TODO
    check_for_crossover: (array1, array2) ->
        # If array1 contains the last element of array2 then return true
        if @contains array1, @get_last_element_of array2
            return true

        # Same as previous check but for edges
        last_elem = @get_last_element_of @traverse_info
        if last_elem instanceof Edge
            if @containsById array1, last_elem.nodea
                if @containsById array2, last_elem.nodeb
                    return true
            else if @containsById array1, last_elem.nodeb
                if @containsById array2, last_elem.nodea
                    return true

        # Return false if there was no match between each array
        return false

    # ### BiDirectional.get_last_element_of( )
    # Return the last element of an array
    # #### Parameters
    # * `obj` - array to return the last element of
    #
    # #### TODO
    get_last_element_of: (obj) ->
        obj[obj.length-1]

    # ### BiDirectional.add_to_traverse_info( )
    # Add an element from an array to traverse_info
    # #### Parameters
    # * `obj` - array to take an element from
    # * `i` - number of element to take
    # #### TODO
    add_to_traverse_info: (obj, i) ->
        @traverse_info.push obj[i]
        if obj[i] instanceof Node
            @explored_nodes.push obj[i]

    # ### BiDirectional.containsById( )
    # Check to see if an object exists in an array using an id
    # #### Parameters
    # * `a` - Array to search in
    # * `obj` - Object to look for
    # #### TODO
    containsById: (a, obj) ->
        i = a.length
        while i--
            if a[i].id? and obj.id?
                if a[i].id is obj.id
                    return true
        return false

    # ### BiDirectional.gen_info( )
    # General information for bidirectional search
    # #### Parameters
    # #### TODO
    gen_info: ->
        [
            "Variable"
            "Variable"
            "Variable"
            "Variable"
            "bidi"
        ]

    # ### BiDirectional.run_info( )
    # Specific run information for bidirectional search
    # #### Parameters
    # #### TODO
    run_info: ->
        alert "stuff"

    # ### BiDirectional.create_traverse_info( )
    # Not implemented
    # #### Parameters
    # #### TODO
    create_traverse_info: ->
        false

this.BiDirectional = BiDirectional
