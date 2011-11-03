# Part of the **Animating Search Algorithms** project
#
# ## Developers
# * [Ian Brown](http://www.csc.liv.ac.uk/~cs8ib/)
# * [Jack Histon](http://www.csc.liv.ac.uk/~cs8jrh/)
# * [Colin Jackson](http://www.csc.liv.ac.uk/~cs8cj/)
# * [Jennifer Jones](http://www.csc.liv.ac.uk/~cs8jlj/)
# * [John Sanderson](http://www.csc.liv.ac.uk/~cs8js/)
#
# Do not modify or distribute without permission

# ## Main Documentation

# Algorithm abstract class
class algorithm
    # Base node object
    root_node: null
    # Goal node object
    goal_node: null
    # List of explored node IDs
    explored_nodes: []
    # List of explored edges for animation.
    # Object to be pushed to this array should be in the format:
    # traverse_info.push
    #       connection: conn.c
    #       a_to_b: conn.c.pointa.id is current_node.id
    #       style_name: "Visited"
    traverse_info: []
    # Name of the algorithm
    name: "Algorithm"

    # ### algorithm.constructor( )
    # Constructor for an algorithm. Not neccesarily needed in the derrived
    # classes, but here for completeness.
    constructor: ->
        false

    # ### algorithm.search( )
    # Will be the main bulk of the class. Runs and animates the search
    # algorithm.
    search: ->
        throw "Search not implemented"

    # ### algorithm.gen_info( )
    # returns an object containing the general information relating to an
    # algorithm. (Such as time complexity, etc)
    #
    # **Return** -> Array containing the information
    gen_info: ->
        throw "General info not implemented"

    # ### algorithm.run_info( )
    # returns an object containing the information relating generated from
    # running the algorithm. (Such as run time, etc)
    #
    # **Return** -> Array containing the information
    run_info: ->
        throw "Run info not implemented"
