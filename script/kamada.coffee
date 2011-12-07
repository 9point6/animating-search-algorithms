# Forked from github.com/richthegeek/coffeegraph
class KamadaKawai

    constructor: ->
        @paths = {}
        @springs = {}

    dist: ( n1, n2 ) ->
        dx = n2.x - n1.x
        dy = n2.y - n1.y
        d2 = ( dx * dx ) - ( dy * dy )

        while d2 < .01
            dx = .1 * Math.random( ) + .1
            dy = .1 * Math.random( ) + .1
            d2 = ( dx * dx ) - ( dy * dy )

        result = [d2, dx, dy]

    prepare: ( ) ->
        # console.log "## prepare"
        # scale graph by graph-size..
        s = Math.sqrt Math.sqrt APP.graph.nodecount
        [n.x, n.y] = [n.x * s, n.y * s] for n in APP.graph.nodes

        # compute shortest paths (O(n^3))
        @shortest_paths( )

        @tolerance = 0.1
        @k = 1

        @update_springs( )

        # get first p/delta_p
        @delta_p = -Infinity
        @partials = {}
        for n in APP.graph.nodes
            do( n ) ->
            @partials[n.id] = @compute_partial_derivatives n
            console.log @partials[n.id]
            delta = @calculate_delta @partials[n.id]
            console.log delta

            if delta > @delta_p
                @p = n
                @delta_p = delta
        # console.log "// prepare"


    update_springs: ( ) ->
        # console.log "## update springs"
        # compute l and k (ideal lengths and spring-strengths) (O(n^2))
        @springs = {}
        @springs[u.id] = {} for u in APP.graph.nodes

        for i, u of APP.graph.nodes
            do( i, u ) ->
            for v in APP.graph.nodes[++i..] # yes, i know, horrible look
                do( u, v )->
                dij = @paths[u.id][v.id]
                if dij == Infinity then return false
                kd = @k / ( dij * dij )
                @springs[u.id][v.id] = kd
                @springs[v.id][u.id] = kd
        # console.log "// update springs"

    # using the Floyd-Warshall algorithm 'cos I'm hardcore like that
    # ported from networkX code
    # O(n2) + O(n3) - luckily only run once
    # tested + working on a cube
    shortest_paths: ->
        # console.log "## shortest paths"
        @paths = {}

        lim = Math.ceil Math.sqrt APP.graph.nodecount
        console.log "Calculating approximate APSP to depth " + lim
        for u in APP.graph.nodes
            p = {}
            p[v.id] = lim + v.weight_to_travel( u ) for v in APP.graph.nodes
            # p[v.id] = lim + 1 for v in APP.graph.nodes
            p[u.id] = 0

            e = {}
            e[u.id] = true
            q = [u]
            qo = 0

            while q.length > 0
                n = q.reverse( ).pop( )
                q = q.reverse( )
                for m in n when not e[m.id]? # changed from n.nodes
                    p[m.id] = p[n.id] + 1
                    e[m.id] = true

                    q.push m
            @paths[u.id] = p

        # console.log "// shortest paths"
        @paths

    iterate: ( ) ->
        # console.log "## iterate"
        if APP.graph.nodecount is 0 then return
        # adds 2n to iteration, could probably be improved... ensures we have springs and paths
        for n in APP.graph.nodes
            if !@paths or !@springs or !@partials or !@paths[n.id]? or !@springs[n.id]? or !@partials[n.id]
                @prepare( )
                break

        # update p_partials - partials from each each node to p
        @p_partials = {}
        @p_partials[n.id] = @compute_partial_derivative( n, @p ) for n in APP.graph.nodes

        # compute differentials and move candidate node about
        @inner_loop( )

        # select new p by updating each pd and delta
        @select_new_p( )
        APP.graph.last_energy = @delta_p
        # console.log "// iterate"

    inner_loop: ( ) ->
        # console.log "## inner loop"
        iter = 0 # iter is to make sure the algorithm doesn't get stuck
        @last_local_energy = Infinity
        while iter < 500 and not @done false
            iter++

            # compute elements of jacobian
            mat =
                xx: 0
                yy: 0
                xy: 0
                yx: 0
            dim = ['x','y']

            spr = @springs[@p.id]
            pat = @paths[@p.id]

            d = {}
            for n in APP.graph.nodes when not ( n is @p )
                do( ) ->
                [d2, d.x, d.y] = @dist( @p, n )

                k = spr[n.id]
                lid3 = pat[n.id] / ( d2 * Math.sqrt d2 )

                for i in dim
                    for j in dim
                        mat[i + j] += if i is j then k * ( 1 + lid3 * ( d[i] * d[i] - d2 ) ) else k * lid3 * d[i] * d[j]

            # solve the linear equations using Cramer's law
            delta = @linear_solver mat, @partials[@p.id]

            # move p by delta
            @p.x += delta.x
            @p.y += delta.y

            #update partials and delta p
            @partials[@p.id] = @compute_partial_derivatives @p
            @delta_p = @calculate_delta @partials[@p.id]
        # console.log "// inner_loop "

    select_new_p: ( ) ->
        # console.log "## select_new_p "
        op = @p
        for n in APP.graph.nodes
            do( n ) ->
            odp = @p_partials[n.id]
            opp = @compute_partial_derivative n, op

            @partials[n.id].x += opp.x - odp.x
            @partials[n.id].y += opp.y - odp.y

            delta = @calculate_delta @partials[n.id]

            if delta > @delta_p
                @p = n
                @delta_p = delta
        # console.log "// select_new_p "

    linear_solver: ( mat, rhs ) ->
        # console.log "## linear_solver"
        denom = 1 / (mat.xx * mat.yy - mat.xy * mat.xy)
        x_num = rhs.x  * mat.yy - rhs.y  * mat.xy
        y_num = mat.xx * rhs.y  - mat.xy * rhs.x
        z_num = 0

        result =
            x: x_num * denom
            y: y_num * denom
        # console.log "// linear_solver"
        result

    # compute contribution from first derivative (dE/dx)
    compute_partial_derivative: ( m, i ) ->
        # console.log "## compute_partial_derivative"
        result =
            x: 0
            y: 0

        if not ( i is m )
            [d2, dx, dy] = @dist( m, i )
            k = @springs[m.id][i.id]
            l = @paths[m.id][i.id] / Math.sqrt d2

            result.x = k * ( dx - l * dx )
            result.y = k * ( dy - l * dy )
        # console.log "// compute_partial_derivative"
        result

    # sum section of dE/dx type eqautions
    compute_partial_derivatives: ( m ) ->
        # console.log "## compute_partial_derivatives"
        result =
            x: 0
            y: 0
        add_results = ( a, b ) ->
            a.x += b.x
            a.y += b.y
            a

        result = add_results( result, @compute_partial_derivative m, i ) for i in APP.graph.nodes
        # console.log "// compute_partial_derivatives"
        result

    calculate_delta: ( partial ) ->
        # console.log "## calculate_delta :- #{partial.x}, #{partial.y}"
        if partial[0]?
            partial = partial[0] # bugfix?
        ret = Math.sqrt partial.x * partial.x + partial.y * partial.y
        # console.log "// calculate_delta :- #{ret}"
        ret

    # checks wether the change in energy is small enough to move on
    done: ( ) ->
        if @last_local_energy == Infinity || @last_local_energy < @delta_p
                @last_local_energy = @delta_p
                return false

        diff = 1 - Math.abs( @last_local_energy - @delta_p ) / @last_local_energy
        done = ( @delta_p == 0 ) or ( diff < @tolerance )
        @last_local_energy = @delta_p
        done

this.KamadaKawai = KamadaKawai
