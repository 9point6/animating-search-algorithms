class heuristics

    constructor: (@num_choice, @root_node, @goal_node) ->
        switch ( @num_choice )
            when 1 then @euclidean_distance @root_node, @goal_node

    euclidean_distance: (root, goal) ->
        alert "euclidean"
