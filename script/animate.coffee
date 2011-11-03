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
class animate
    # Stores pointer value for current position in traverse_info array
    pointer: 0
    # Stores the algorithm currently being worked on in the UI environment.
    algorithm: null

    # ### animate.step_forward( )
    # move forward one step in the traverse_info array for a given algorithm.
    # ### Parameters
    #
    # #### TODO
    step_forward: ->
        # check for null value in traverse_info. if the pointer has not
        # reached the last element of the array already, then run the code.
        if algorithm.traverse_info is not null and pointer < algorithm.traverse_info.length

            # create local variable for storing the array of points/connections
            @traverse_info = algorithm.traverse_info
            # create a variable for storing the element the pointer represents
            current_item = @traverse_info[pointer]

            # update the current item pointed at to "viewing"
            current_item.update_style "viewing"
            # if the current_item selected is a point object
            if current_item instanceof Point
                # loop through all of the points connections
                for con in current_item.connections
                    # This stops overwriting the style of the previous element in the
                    # traverse_info array as it should be the only connection in the
                    # "viewing" state.
                    if con.style is not "viewing"
                        con.update_style "potential"

            # the current_item is not the first element in the array
            if pointer is not 0
                # create a variable for storing the previous element.
                previous_item = @traverse_info[pointer-1]
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
                            if con.style is "potential" and algorithm.name is not "AStar"
                                con.update_style "normal"

            # increase the pointer value                                
            pointer++

    ### animate.step_backward( )
    # move backward one step in the traverse_info array for a given algorithm.
    # ### Parameters
    #
    # #### TODO
    step_backward: ->
        
        # Check for null value in traverse_info. Pointer has to be greater than
        # zero, as the pointer is decremented immediately after this comparison.
        if algortithm.traverse_info is not null and pointer > 0
            
            # Decrement the pointer property
            pointer--
           
            # create variable for storing array
            @traverse_info = algorithm.traverse_info
            # create variable for current item pointer looks at in the array
            current_item = @traverse_info[pointer]
            
            # change the current item to a "normal" style
            current_item.update_style "normal"
           
            # if the current item is a point then change all of it's potential
            # connections back to a normal style.
            if current_item instanceof Point
                for con in current_item.connections
                    if con.style is "potential"
                        con.update_style "normal"

            # If there is an item before the current item in the traverse_info
            # array
            if pointer is not 0
                # Create a variable for storing the previous item
                previous_item = @traverse_info[pointer-1]
                # Change it's style to "viewing"
                previous_item.update_style "viewing"

                # if the previous item is a point change all of its connections
                # to now be in a "potential" style.
                if previous_item instanceof Point
                    for con in current_item.connections
                        if con.style is not "viewing"
                            con.update_style "potential"

    # ### animate.traverse( )
    # Loop through the given array, animating each given
    # node and connection in order.
    # ### Parameters
    #
    # #### TODO
    traverse: ->
        # if the list to iterate over is not null
        if algorithm.traverse_info is not null
            while pointer is <= algorithm.traverse_info.length
                this.step_foward

    # ### animate.traverse_BiDi(algorithm )
    # Loop through the given array, animating each given
    # node and connection in order. the traverse_info object should
    # be in reverse order, so when pop occurs, the animation is forwards.
    # ### Parameters
    #
    # #### TODO
    # * add .style attribute to connection/node classes
    # * add "goal" style for the point class
    traverse_BiDi: ->
        if algorithm.traverse_info or algorithm.traverse_from_goal is not null

            traverse_r = algorithm.traverse_info
            traverse_g = algorithm.traverse_from_goal

            previous_item_r = null
            previous_item_g = null

            while traverse_r.length or traverse_g.length is not 0

                # This updates the current, potential and visited nodes for the search algorithm
                #   travelling from the ROOT node
                if traverse_r.length is not 0
                    current_item_r = traverse_r.pop
                    current_item_r.update_style "viewing"

                    if current_item_r instanceof Point
                        for con in current_item_r.connections
                            if con.style is not "viewing"
                                con.update_style "potential"

                    # if there is a previous item
                    if previous_item_r is not null
                        # if the previous item is in the viewing style
                        if previous_item_r.style is "viewing"
                            # change the previous item to the visited style
                            previous_item_r.update_style "visited"
                            # if the previous item is a point
                            if previous_item_r instanceof Point
                                # loop through the previous items connections and change each
                                # connection which is in a "potential" style to a "normal"
                                # style. The A* is not going to do this, as A* may still
                                # visit potentials that previously were unexplored.
                                for con in previous_item_r.connections
                                    if con.style is "potential" and algorithm.name is not "AStar"
                                        con.update_style "normal"

                    # assign the previous item to the current item. Current item
                    # will be updated at the start of the array
                    previous_item_r = current_item_r

                    # the last item visited should be the goal node unless the algorithm
                    # did not complete.
                    if current_item_r is algorithm.goal_node
                        current_item_r.update_style "goal"
                    else
                        current_item_r.update_style "visited"


                # This updates the current, potential and visited nodes for the search algorithm
                #   travelling from the GOAL node
                if traverse_g.length is not 0
                    current_item_g = traverse_g.pop
                    current_item_g.update_style "viewing"

                    if current_item_g instanceof Point
                        for con in current_item_g.connections
                            if con.style is not "viewing"
                                con.update_style "potential"

                    # if there is a previous item
                    if previous_item_g is not null
                        # if the previous item is in the viewing style
                        if previous_item_g.style is "viewing"
                            # change the previous item to the visited style
                            previous_item_g.update_style "visited"
                            # if the previous item is a point
                            if previous_item_g instanceof Point
                                # loop through the previous items connections and change each
                                # connection which is in a "potential" style to a "normal"
                                # style. The A* is not going to do this, as A* may still
                                # visit potentials that previously were unexplored.
                                for con in previous_item_g.connections
                                    if con.style is "potential" and algorithm.name is not "AStar"
                                        con.update_style "normal"

                    # assign the previous item to the current item. Current item
                    # will be updated at the start of the array
                    previous_item_r = current_item_r

                    # the last item visited should be the goal node unless the algorithm
                    # did not complete.
                    if current_item_r is algorithm.goal_node
                        current_item_r.update_style "goal"
                    else
                        current_item_r.update_style "visited"

###
# while there are still items to iterate over
        while @traverse_info.length is not 0
          # this keeps a record of the current item.
          current_item = @traverse_info.pop

          # update the item we are currently looking at to viewing state.
          current_item.update_style "viewing"

          # if the current item is a point we should change each of it's
          # connections to a "potential" style.
          if current_item instanceof Point
            for con in current_item.connections
              if con.style is not "viewing"
                con.update_style "potential"

          # if there is a previous item
          if previous_item is not null
            # if the previous item is in the viewing style
            if previous_item.style is "viewing"
              # change the previous item to the visited style
              previous_item.update_style "visited"
              # if the previous item is a point
              if previous_item instanceof Point
                # loop through the previous items connections and change each
                # connection which is in a "potential" style to a "normal"
                # style. The A* is not going to do this, as A* may still
                # visit potentials that previously were unexplored.
                for con in previous_item.connections
                  if con.style is "potential" and algorithm.name is not "AStar"
                    con.update_style "normal"

          # assign the previous item to the current item. Current item
          # will be updated at the start of the array
          previous_item = current_item

        # the last item visited should be the goal node unless the algorithm
        # did not complete.
        if current_item is algorithm.goal_node
          current_item.update_style "goal"
        else
          current_item.update_style "visited"
###
