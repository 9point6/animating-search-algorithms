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

# DFS algorithm class
class DFS extends algorithm
    name: "DFS"

    # ### DFS.search( )
    # executes a depth first search given
    # a particular set of nodes, starting from
    # the root_node (only works on a tree graph)
    # ### Parameters
    search: ->
        # reset all the explored values for each node
        for node in @explored_nodes
            node.explored = false

        #reset the explored_nodes array
        @explored_nodes = []

        #stack for nodes to be searched
        todo_list = []

        #push root (starting) node onto stack
        todo_list.push @root_node
        # while there are nodes still left to check
        while todo_list.length isnt 0

            #pull a node from the stack
            current_node = todo_list.pop( )
            current_node.explored = true

            #if current node is goal node, end the search
            if current_node.id is @goal_node.id
                @explored_nodes.push current_node
                break

            #add to to-do stack
            for neighbour in current_node.connections
                if not neighbour.p.explored
                    todo_list.push neighbour.p

            #add current node to explored nodes list
            @explored_nodes.push current_node

    gen_info: ->
        alert "general information"

    run_info: ->
        alert "runtime information"

    # ### DFS.create_traverse_info
    # Populates the traverse_info array for use by the
    # animate class
    # ### Parameters
    #
    create_traverse_info: ->
        @traverse_info = []
        fork = []
        fork.push @root_node
        exp_nodes = @explored_nodes.slice(0)

        # if the array reaches zero then all the elements
        # have been added to the traverse_info array.
        while exp_nodes.length isnt 0
            # get an element of the exp_nodes array, and
            # remove the element from the array.
            current_node = exp_nodes.pop( )
           
            if current_node.connections.length > 2
                fork.push current_node
            # push the current_node onto the start of the array.
            @traverse_info.push current_node

            # if this the last node in exp_nodes array, then there is
            # no need to loop through its connections
            if exp_nodes.length isnt 0
                # loop through the nodes connections, and pick out the
                # correct connection which links to the next node in the
                # exp_nodes array.
                for con in current_node.connections
                    # if the other node for the current connection is
                    # the node we are looking for.
                    if con.p.id is exp_nodes[exp_nodes.length - 1].id
                        # add connection to the traverse_info array.
                        @traverse_info.push con.c
               
                pleh = @traverse_info[@traverse_info.length-1] instanceof connection

                if not pleh
                    node = fork.pop( )
                    if node?
                        console.log "current node" + current_node.id
                        for con in node.connections
                            console.log "con id " + con.p.id
                            if con.p.id is current_node.id
                                @traverse_info.push con.c
                      

        @traverse_info.reverse()
