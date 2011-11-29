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

# BiDi algorithm class

class BiDirectional extends Algorithm
	
	name: "Bi-Directional Search"
	
    destroy: ->
    for node in @explored_nodes
        delete node.explored
    super
	
	search: (traverse_info_start, traverse_info_goal) ->
				
		for i in traverse_info_start.length
			
			if traverse_info_start[i] is not traverse_info_goal[i]
			
				traverse_info_output.push = traverse_start
				traverse_info_output.push = traverse_goal

			if traverse_start is traverse_goal
			
				traverse_info_output.push = traverse_start
				break