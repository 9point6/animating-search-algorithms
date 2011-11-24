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

            # create local variable for storing the array of points/connections
            @traverse_info = @algorithm.traverse_info
            # create a variable for storing the element the pointer represents
            current_item = @traverse_info[@pointer]
            # update the current item pointed at to "viewing"
            current_item.update_style "viewing"
            # if the current_item selected is a point object
            if current_item instanceof Point
                # loop through all of the points connections
                for con in current_item.connections
                    # This stops overwriting the style of the previous element in the
                    # traverse_info array as it should be the only connection in the
                    # "viewing" state.
                    if con.c.style is "normal"
                        con.c.update_style "potential"

            # the current_item is not the first element in the array
            if @pointer isnt 0
                # create a variable for storing the previous element.
                previous_item = @traverse_info[@pointer-1]
                # if the previous item is in the "viewing" style (which it should
                # be)
                if previous_item.style is "viewing"
                    # update previous items style to visited
                    previous_item.update_style "visited"
                    if previous_item instanceof Point
                        # change all of its connections back to normal unless it
                        # is an AStar algorithm. AStar works by keeping previous
                        # connections as "potentials" in an open set.
                        for con in previous_item.connections
                            if con.c.style is "potential" and
                                @algorithm.name isnt "AStar" and
                                    @algorithm.name isnt "BiDi"
                                        con.c.update_style "normal"

            # increase the pointer value
            @pointer++

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
            current_item = @traverse_info[pointer]

            # change the current item to a "normal" style
            current_item.update_style "normal"

            # if the current item is a point then change all of it's potential
            # connections back to a normal style.
            if current_item instanceof Point
                for con in current_item.connections
                    if con.c.style is "potential"
                        con.c.update_style "normal"

            # If there is an item before the current item in the traverse_info
            # array
            if @pointer is not 0
                # Create a variable for storing the previous item
                previous_item = @traverse_info[@pointer-1]
                # Change it's style to "viewing"
                previous_item.update_style "viewing"

                # if the previous item is a point change all of its connections
                # to now be in a "potential" style.
                if previous_item instanceof Point
                    for con in previous_item.connections
                        if con.c.style isnt "viewing"
                            con.c.update_style "potential"

    # ### animate.traverse( )
    # Loop through the given array, animating each given
    # node and connection in order.
    # ### Parameters
    #
    # #### TODO
    traverse: ->
        # if the list to iterate over is not null
        if @algorithm.traverse_info?
            while pointer <= @algorithm.traverse_info.length
                this.step_foward

this.Animate = Animate
