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
		
		traverse_start = traverse_info_start[i]
		traverse_goal = traverse_info_goal[i]
		
			while traverse_start is not traverse_goal
			
				traverse_info_output[2i-1] = traverse_start
				traverse_info_output[2i] = traverse_goal

			if traverse_start is traverse_goal
			
				traverse_info_output[2i] = traverse_start