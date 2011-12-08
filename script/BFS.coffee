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

# BFS algorithm class
class BFS extends Algorithm
    name: "Breadth-First Search"

    # ### BFS.destroy( )
    # deletes the explored variable from each node.
    # ### Parameters
    destroy: ->
        for node in @explored_nodes
            delete node.explored
        super

    # ### BFS.search( )
    # searches for a goal node by using a breath first algorithm.
    # Starting the @root_node
    # ### Parameters
    search: ->
        for node in @explored_nodes
            node.explored = false

        @explored_nodes = []
        @traverse_info = []
        #queue of nodes to be searched
        queue = []
        found = false

        #add the root node to the front of the queue
        queue.push @root_node

        #add the root node to the set of explored nodes
        @root_node.explored = true
        @traverse_info.push @root_node
        @explored_nodes.push @root_node

        #if the root node is the goal then end search
        if @root_node is @goal_node
            return

        #while there are still nodes in the queue
        while queue.length isnt 0

            #the new root node is the first node in the queue
            current_node = queue.shift()

            # Goal node has been found so break
            if found
                break

            if current_node is @goal_node
                @explored_nodes.push current_node
                @traverse_info.push current_node
                break

            #get the connections of the node
            neighbours = current_node.edges

            #for all the neighbours of the node
            for neighbour in neighbours
                if @is_from_goal?
                    visitable = neighbour.e.visitable current_node, true
                else
                    visitable = neighbour.e.visitable current_node

                #add the neighbour to the set of explored nodes
                if not neighbour.n.explored and visitable
                    neighbour.n.explored = true
                    @traverse_info.push neighbour.e
                    @traverse_info.push neighbour.n
                    @explored_nodes.push neighbour.n
                    if neighbour.n is @goal_node
                        found = true
                        break
                    queue.push neighbour.n


    # ### BFS.create_traverse_info
    # Populates the traverse_info array for use by the
    # animate class
    # ### Parameters
    create_traverse_info: ->
        false

    # ### BFS.gen_info( )
    # Gives the general metrics for a BFS search
    # ### Parameters
    gen_info: ->
        [
            "Complete"
            "O(b<sup>d+1</sup>)"
            "O(b<sup>d</sup>)"
            "Not Optimal"
        ]

    # ### BFS.run_info( )
    # Shows the specific metrics for a particular instance.
    # ### Parameters
    run_info: ->
        alert "Run information"

this.BFS = BFS
