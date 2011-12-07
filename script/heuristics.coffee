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

# Heuristics class

class Heuristics

    constructor: ->

    # ### Heuristics.choice( )
    # Chooses an heuristic method
    # #### Parameters
    # `num_choice` - which heuristic to use
    # `node_from` - needed for x, y co-ordinates
    # `node_to` - needed for x, y co-ordinates
    #
    # #### TODO
    choice: (num_choice, node_from, node_to) ->
        num_choice = parseInt( num_choice )
        switch ( num_choice )
            when 0 then return 0
            when 1 then @euclidean_distance node_from, node_to

    # ### Heuristics.euclidean_distance( )
    # Works out the euclidean distance between two points
    # #### Parameters
    # `node_from` - needed for x, y co-ordinates
    # `node_to` - needed for x, y co-ordinates
    #
    # #### TODO
    euclidean_distance: (node_from, node_to) ->
        a = node_from.x - node_to.x
        b = node_from.y - node_to.y

        a = Math.pow(a,2)
        b = Math.pow(b,2)

        c = a + b

        return Math.sqrt c

this.Heuristics = Heuristics
