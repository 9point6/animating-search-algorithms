class BFS extends algorithm

	search: ->
		#queue of nodes to be searched
		queue = []
		
		#add the root node to the front of the queue
		queue.push root_node

		#add the root node to the set of explored nodes
		explored_nodes.push root_node
		
		#if the root node is the goal then end search
		if root_node is goal_node
			break

		#while there are still nodes in the queue
		while queue.length is not 0

			#the new root node is the first node in the queue
			root_node = queue.shift()

			#get the connections of the node
			neighbours = root_node.connections

			#for all the neighbours of the node
			for neighbour in neighbours
				#add the neighbour to the set of explored nodes
				explored_nodes.push neighbour.p

				#if the nieghbour is the goal node end search
				if neighbour.p is goal_node
					break

				
