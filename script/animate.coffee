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

    # ### Animate.constructor( )
    # Constructor for the animate class. Defines some member variables for
    # the names of styles etc.
    # #### TODO
    constructor: ->
        # Create local names
        @VIEWING_CONST = "viewing"
        @POTENTIAL_CONST = "potential"
        @NORMAL_CONST = "normal"
        @VISITED_CONST = "visited"
        @GOAL_CONST = "goal"
        @PATH_CONST = "path"
        @BIDI_CONST = "Bi-Directional Search"

    # For creating a path we use path_edges which is (approx) half the length of
    # traverse_info. In order to navigate path_edges using the traverse_info
    # pointer we must half the value and make up the difference. Part of this difference
    # indicates how many times we 'reset' our search, such as when iterative deepening
    # restarts from a different depth.
    path_diff: 0

    # ### Animate.destroy( )
    # gets rid of all the styles of each node/edge
    # #### TODO
    destroy: ->
        APP.graph.remove_styles( )
        delete @

    # ### Animate.step_forward( )
    # Move forward one step in the traverse_info array for a given algorithm.
    # ### Parameters
    # #### TODO
    step_forward: ->
        # Check for null value in traverse_info. if the pointer has not
        # reached the last element of the array already, then run the code.
        if @algorithm.traverse_info? and @pointer < @algorithm.traverse_info.length
            # Boolean value checking whether the goal has been reached
            goal_reached = false
            # Create local variable for storing the array of points/connections
            @traverse_info = @algorithm.traverse_info
            # Create a variable for storing the element the pointer represents
            current_item = @traverse_info[@pointer]

            # Update the current item and its edges styles
            @update_current_item current_item, goal_reached

            # Update the previous item and its edges styles
            @update_previous_item current_item, goal_reached

            # Increase the pointer value
            @pointer++

    # ### Animate.update_previous_item( )
    # Updates the previous item in the @traverse_info array when stepping forward
    # #### Parameters
    # * `current_item` - the current item looked at
    # * `goal_reached` - Boolean value checking if the goal has been reached
    # #### TODO
    update_previous_item: (current_item, goal_reached) ->
        # The current_item is not the first element in the array
        if @pointer isnt 0
            # Create a variable for storing the previous element.
            previous_item = @traverse_info[@pointer-1]
            # If the previous item is in the "viewing" style (which it should
            # be)
            if previous_item.style is @VIEWING_CONST and previous_item isnt current_item
                # Update previous items style to visited
                previous_item.update_style @VISITED_CONST
                if previous_item instanceof Node
                    # Change all of its connections back to normal
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

                        if edge.e.style is @POTENTIAL_CONST
                            edge.e.update_style @NORMAL_CONST

            @update_path current_item, previous_item, goal_reached

    # ### Animate.update_path( )
    # Updates the path that is from the root node to the current node
    # #### Parameters
    # * `current_item` - Current item looked at
    # * `previous_item` - Previous item looked at
    # * `goal_reached` - boolean checking if the goal has been reached
    # #### TODO
    update_path: (current_item, previous_item, goal_reached) ->
        # check that path_edges has been populated. The algorithms that have no
        # visual path will skip this method
        if @algorithm.path_edges?
            
            # if the current item in traverse_info is a node
            if current_item instanceof Node
                # if the previous item is an edge, reset the path
                # This allows BiDi to maintain one path while the other
                # is amended
                if previous_item instanceof Edge
                    @reset_path()
                
                last_viewed = previous_item

                # if current item and previous item are nodes then
                # path diff must be incremented
                if previous_item instanceof Node
                    @path_diff++

                # create the path
                @create_path (@pointer+@path_diff) / 2

                # update current item's edges to potential, unless it leads to our previous node and current item isn't the goal
                for edge in current_item.edges
                    if edge.n isnt @traverse_info[@pointer-2] and edge.e isnt last_viewed and not goal_reached and edge.e.visitable current_item
                        edge.e.update_style @POTENTIAL_CONST

            # if current item is an edge and the nodes on this edge are not the one we've just visited
            # (ie, the path has jumped from one part of the graph to another) then reset the path, create
            # a new path and make the current item 'viewing'
            if current_item instanceof Edge
                if current_item.nodea isnt previous_item and current_item.nodeb isnt previous_item
                    @reset_path()
                    @create_path (@pointer+@path_diff+1)/2
                    current_item.update_style @VIEWING_CONST

    # ### Animate.update_current_item( )
    # Updates the style of the current item looked at by the pointer
    # #### Parameters
    # * `current_item` - The current item looked at by the pointer
    # * `goal_reached` - boolean checking if the goal has been reached
    # #### TODO
    update_current_item: (current_item, goal_reached) ->
        #Checks if the current_item is the goal node, if so then updates the nodes style
        if current_item is @algorithm.goal_node and @algorithm.name isnt @BIDI_CONST
            # update the current item pointed at to goal node animation
            current_item.update_style @GOAL_CONST
            goal_reached = true
        else
            # update the current item pointed at to "viewing"
            current_item.update_style @VIEWING_CONST

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
    # Move backward one step in the traverse_info array for a given algorithm.
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

    # ### Animate.update_current_item_backwards( )
    # Updates the current item pointed at by the @pointer backwards
    # #### Parameters
    # * `current_item` - Current item the pointer represents
    # #### TODO
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

    # ### Animate.update_previous_item_backwards( )
    # Updates the previous items style backwards
    # #### Parameters
    # * `current_item` - Current item the pointer represents
    # #### TODO
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

    # ### Animate.create_path( )
    # Create the path from root to a particular node
    # #### Parameters
    # * `pointer` - A pointer to current item's entry in path_edges
    create_path: (pointer) ->
        # path stores all the appropriate edges we need to animate for this
        # node
        path = @algorithm.path_edges[pointer]
        # update all the edge that aren't potential to path 
        for edge in path
            if edge.style isnt @POTENTIAL_CONST
                edge.update_style @PATH_CONST


    # ### Animate.reset_path( )
    # Reset the path to visited style
    # #### TODO
    reset_path: ->
        for edge in APP.graph.edges
            if edge.style is @PATH_CONST
                edge.update_style @VISITED_CONST


    # ### Animate.traverse( )
    # Loop through the given array, animating each given
    # node and connection in order.
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

    # ### Animate.stop( )
    # Stop the animation
    # #### TODO
    stop: ->
        @_stop = true

    # ### Animate.reset( )
    # Reset the animation to the start
    # #### TODO
    reset: ->
        APP.graph.remove_styles( )
        @pointer = 0

this.Animate = Animate
