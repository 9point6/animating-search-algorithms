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
        for connection in algorithm.explored_connections
            connection.p

    node: (node, colour, size) ->
        false

    connection: (connection, colour) ->
        false
