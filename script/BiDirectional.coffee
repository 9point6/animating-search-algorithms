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
	
	search: (algorithm1, algorithm2) ->
		
		traverse_info_start = algorithm1.traverse_info
		traverse_info_goal = algorithm2.traverse_info
		
		for i in traverse_info_start.length
			for j in traverse_info_goal.length
			
				traverse_start = traverse_info_start[i]
				traverse_goal = traverse_info_goal[j]
			
				if traverse_info_start[i] isnt traverse_info_goal[j]
				
					traverse_info.push traverse_start
					traverse_info.push traverse_goal

				if traverse_info_start[i] is traverse_info_goal[j]
				
					traverse_info.push traverse_start
					break