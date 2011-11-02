class animate
    constructor: ( @raphael ) ->
        @r = @raphael

    # ### animate.traverse( )
    # Loop through the given array, animating each given
    # node and connection in order. the traverse_info object should
    # be in reverse order, so when pop occurs, the animation is forwards.
    # ### Parameters
    # * `algorithm` - the algorithm containing the array for traversing
    #
    # #### TODO
    # * add .style attribute to connection/node classes
    # * add "goal" style for the point class
    traverse: (algorithm) ->
      # if the list to iterate over is not null
      if algorithm.traverse_info is not null
        # create local variable for list
        @traverse_info = algorithm.traverse_info
        # this will keep a record of the previous item in the list
        previous_item = null

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
      
    traverse: (traverse_info_a, traverse_info_b) ->


    node: (node, colour, size) ->
        false

    connection: (connection, colour) ->
        false
    
    
    
    ###
      path = algorithm.traverse_info
      while path.length is not 0
        item = path.pop
        prev_item = null
        if previous_item.length > 1
          prev_item = previous_item.shift()

        if item instanceof Point

          if prev_item is not null and prev_item instanceof Connection
            prev_item.update_style "visited"
            
          item.update_style "viewing"
          for con in item.connections
            if con.state is "normal"
              con.update_style "potential"

        else if item instanceof Connection

          if prev_item is not null and prev_item instanceof Point
            prev_item.update_style "visited"
            for con in prev_item.connections
              if con.state is "potential"
                con.update_style "normal"

          item.update_style "viewing"

        previous_item.push item

        if path.length is 0
          item = previous_item.shift()
          item.update_style "visited"
          item = previous_item.shift()
          item.update_style "visited"
    ###
