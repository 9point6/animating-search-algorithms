class animate
    constructor: ( @raphael ) ->
        @r = @raphael

    # ### animate.traverse( )
    # Loop through the given array, animating each given
    # node and connection in order.
    # ### Parameters
    # * `algorithm` - the algorithm containing the array for traversing
    #
    # #### TODO
    # * MAKE IT WORK!!
    traverse: (algorithm) ->
      if algorithm.traverse_info is not null
        @traverse_info = algorithm.traverse_info
        previous_item = null

        while @traverse_info.length is not 0
          current_item = @traverse_info.pop

          current_item.update_style "viewing"
          if current_item instanceof Point
            for con in current_item.connections
              con.update_style "potential"

          if previous_item is not null
            if previous_item.state is "viewing"
              previous_item.update_style "visited"
              if previous_item instanceof Point
                for con in previous_item.connections
                  if con.state is "potential" and algorithm.name is not "AStar"
                    con.update_style "normal"

          previous_item = current_item
      
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
