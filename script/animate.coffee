# Part of the **Animating Search Algorithms** project
#
# ## Developers
# * [Ian Brown](http://www.csc.liv.ac.uk/~cs8ib/)
# * [Jack Histon](http://www.csc.liv.ac.uk/~cs8jrh/)
# * [Colin Jackson](http://www.csc.liv.ac.uk/~cs8cj/)
# * [Jennifer Jones](http://www.csc.liv.ac.uk/~cs8jlj/)
# * [John Sanderson](http://www.csc.liv.ac.uk/~cs8js/)
#
# Do not modify or distribute without permission.

# ## Main Documentation

# Animate class
class Animate
    # Stores pointer value for current position in traverse_info array
    pointer: 0
    # Stores the algorithm currently being worked on in the UI environment.
    algorithm: null

    constructor: ->
        # Create local names
        @VIEWING_CONST = "viewing"
        @POTENTIAL_CONST = "potential"
        @NORMAL_CONST = "normal"
        @VISITED_CONST = "visited"
        @GOAL_CONST = "goal"
        @PATH_CONST = "path"
        @BIDI_CONST = "Bi-Directional Search"

    path_diff: 0

    destroy: ->
        APP.graph.remove_styles( )
        delete @

    # ### animate.step_forward( )
    # move forward one step in the traverse_info array for a given algorithm.
    # ### Parameters
    #
    # #### TODO
    step_forward: ->
        # check for null value in traverse_info. if the pointer has not
        # reached the last element of the array already, then run the code.
        if @algorithm.traverse_info? and @pointer < @algorithm.traverse_info.length

            goal_reached = false
            # create local variable for storing the array of points/connections
            @traverse_info = @algorithm.traverse_info
            # create a variable for storing the element the pointer represents
            current_item = @traverse_info[@pointer]

            if current_item is @algorithm.goal_node and @algorithm.name isnt @BIDI_CONST
                # update the current item pointed at to goal node animation
                current_item.update_style @GOAL_CONST
                goal_reached = true
            else
                # update the current item pointed at to "viewing"
                current_item.update_style @VIEWING_CONST

            @update_current_item current_item, goal_reached

            @update_previous_item current_item, goal_reached

            # increase the pointer value
            @pointer++

    update_previous_item: (current_item, goal_reached) ->
        # the current_item is not the first element in the array
        if @pointer isnt 0
            # create a variable for storing the previous element.
            previous_item = @traverse_info[@pointer-1]
            # if the previous item is in the "viewing" style (which it should
            # be)
            if previous_item.style is @VIEWING_CONST and previous_item isnt current_item
                # update previous items style to visited
                previous_item.update_style @VISITED_CONST
                if previous_item instanceof Node
                    # change all of its connections back to normal unless it
                    # is an AStar algorithm. AStar works by keeping previous
                    # connections as "potentials" in an open set.
                    for edge in previous_item.edges
                        if @algorithm.path_edges? and edge.e.style is @POTENTIAL_CONST
                            is_visited = false
                            for i in [0...@pointer]
                                if @traverse_info[i] is edge.e
                                    is_visited = true
                                    break
                            if is_visited is true
                                edge.e.update_style @VISITED_CONST
                            else
                                edge.e.update_style @NORMAL_CONST

                        # change all of its connections back to normal unless it
                        # is an AStar algorithm. AStar works by keeping previous
                        # connections as "potentials" in an open set.
                        if edge.e.style is @POTENTIAL_CONST
                            edge.e.update_style @NORMAL_CONST

            @update_path current_item, previous_item, goal_reached

    update_path: (current_item, previous_item, goal_reached) ->
        if @algorithm.path_edges?
            if current_item instanceof Node
                if previous_item instanceof Edge
                    @reset_path()
                last_viewed = previous_item

                if previous_item instanceof Node
                    @path_diff++

                @create_path (@pointer+@path_diff) / 2

                for edge in current_item.edges
                    if edge.n isnt @traverse_info[@pointer-2] and edge.e isnt last_viewed and not goal_reached and edge.e.visitable current_item
                        edge.e.update_style @POTENTIAL_CONST

            if current_item instanceof Edge
                if current_item.nodea isnt previous_item and current_item.nodeb isnt previous_item
                    @reset_path()
                    @create_path (@pointer+@path_diff+1)/2
                    current_item.update_style @VIEWING_CONST

    update_current_item: (current_item, goal_reached) ->
        # if the current_item selected is a point object
        if current_item instanceof Node
            # loop through all of the points connections
            for edge in current_item.edges
                if @algorithm.name is @BIDI_CONST
                    if @pointer % 2 isnt 0
                        visitable = edge.e.visitable current_item, true
                    else
                        visitable = edge.e.visitable current_item
                else
                    visitable = edge.e.visitable current_item

                # This stops overwriting the style of the previous element in the
                # traverse_info array as it should be the only connection in the
                # "viewing" state.
                if edge.e.style is @NORMAL_CONST and not goal_reached and visitable
                    edge.e.update_style @POTENTIAL_CONST

    # ## animate.step_backward( )
    # move backward one step in the traverse_info array for a given algorithm.
    # ### Parameters
    #
    # #### TODO
    step_backward: ->
        # Check for null value in traverse_info. Pointer has to be greater than
        # zero, as the pointer is decremented immediately after this comparison.
        if @algorithm.traverse_info? and @pointer > 0
            # Decrement the pointer property
            @pointer--

            # create variable for storing array
            @traverse_info = @algorithm.traverse_info
            # create variable for current item pointer looks at in the array
            current_item = @traverse_info[@pointer]

            @update_current_item_backwards current_item

            @update_previous_item_backwards current_item

    update_current_item_backwards: (current_item) ->
        #if (@algorithm.name isnt "A* Search" and @algorithm.name isnt @BIDI_CONST) or current_item instanceof Edge
        # change the current item to a "normal" style
        current_item.update_style @NORMAL_CONST
        #else
            #current_item.update_style "potential"

        # if the current item is a point then change all of it's potential
        # connections back to a normal style.
        if current_item instanceof Node
            for edge in current_item.edges
                if edge.e.style is @POTENTIAL_CONST
                    edge.e.update_style @NORMAL_CONST

    update_previous_item_backwards: (current_item) ->
        # If there is an item before the current item in the traverse_info
        # array
        if @pointer isnt 0
            # Create a variable for storing the previous item
            previous_item = @traverse_info[@pointer-1]
            # Change it's style to "viewing"
            previous_item.update_style @VIEWING_CONST

            # if the previous item is a point change all of its connections
            # to now be in a "potential" style.
            if previous_item instanceof Node
                if @algorithm.path_edges?
                    if current_item instanceof Node
                        @path_diff--
                    @reset_path()
                    @create_path((@pointer+@path_diff-1) / 2)
                for edge in previous_item.edges
                    if edge.e.style isnt @VISITED_CONST
                        if @algorithm.name is @BIDI_CONST
                            if @pointer % 2 is 0
                                visitable = edge.e.visitable previous_item, true
                            else
                                visitable = edge.e.visitable previous_item
                        else
                            visitable = edge.e.visitable previous_item

                        if edge.e.style is @PATH_CONST
                        else if visitable
                            edge.e.update_style @POTENTIAL_CONST

    create_path: (pointer) ->
        path = @algorithm.path_edges[pointer]
        for edge in path
            if edge.style isnt @POTENTIAL_CONST
                edge.update_style @PATH_CONST


    reset_path: ->
        for edge in APP.graph.edges
            if edge.style is @PATH_CONST
                edge.update_style @VISITED_CONST


    # ### animate.traverse( )
    # Loop through the given array, animating each given
    # node and connection in order.
    # ### Parameters
    #
    # #### TODO
    traverse: ->
        traverse_speed = 500
        # if the list to iterate over is not null
        if @algorithm.traverse_info?
            doTraverse = =>
                @step_forward( )
                if @pointer < @algorithm.traverse_info.length and not @_stop
                    setTimeout doTraverse, traverse_speed
            @_stop = false
            setTimeout doTraverse, traverse_speed

    stop: ->
        @_stop = true

    reset: ->
        APP.graph.remove_styles( )
        @pointer = 0

this.Animate = Animate
