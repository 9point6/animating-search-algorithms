(function() {
var DLS;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

DLS = (function() {

  __extends(DLS, Algorithm);

  function DLS() {
    DLS.__super__.constructor.apply(this, arguments);
  }

  DLS.prototype.name = "Depth-Limited Search";

  DLS.prototype.destroy = function() {
    var node, _i, _len, _ref;
    _ref = this.explored_nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      delete node.explored;
    }
    return DLS.__super__.destroy.apply(this, arguments);
  };

  DLS.prototype.search = function() {
    var node, _i, _len, _ref;
    _ref = this.explored_nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      node.explored = false;
    }
    this.explored_nodes = [];
    this.todo_list = [];
    this.path_info = [];
    this.path_edges = [];
    this.is_found = false;
    this.traverse_info = [];
    this._search(this.root_node, 3, this.root_node);
    return this.create_path_info();
  };

  DLS.prototype._search = function(node, depth, prev_node) {
    var neighbour, _i, _len, _ref, _results;
    if (depth >= 0) {
      this.explored_nodes.push(node);
      this.path_info.push(prev_node);
      this.traverse_info.push(node);
      if (node === this.goal_node) {
        this.is_found = true;
        return node;
      }
      _ref = node.edges;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        neighbour = _ref[_i];
        if (neighbour.n.id !== prev_node.id) {
          if (depth > 0) this.traverse_info.push(neighbour.e);
          this._search(neighbour.n, depth - 1, node);
          if (this.is_found) {
            break;
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  DLS.prototype.gen_info = function() {
    return ["Complete", "O(b<sup>m</sup>)", "O(bm)", "Not Optimal"];
  };

  DLS.prototype.run_info = function() {
    return alert("runtime information");
  };

  DLS.prototype.create_traverse_info = function() {
    /*
            @traverse_info = []
    
            # this array is used so connections are
            # highlighted correctly when backtracking
            fork = []
    
            exp_nodes = @explored_nodes.slice(0)
            # if the array reaches zero then all the elements
            # have been added to the traverse_info array.
            while exp_nodes.length isnt 0
                # get an element of the exp_nodes array, and
                # remove the element from the array.
                current_node = exp_nodes.shift( )
                # push the current_node onto the start of the array.
                @traverse_info.push current_node
    
                # push current_node onto the start of the array backtracking array
                fork.unshift current_node
    
                # if this the last node in exp_nodes array, then there is
                # no need to loop through its connections
                if exp_nodes.length isnt 0
                    # loop through the nodes connections, and pick out the
                    # correct connection which links to the next node in the
                    # exp_nodes array.
                    for edge in current_node.edges
                        # if the other node for the current connection is
                        # the node we are looking for.
                        if edge.n.id is exp_nodes[0].id
                            # add connection to the traverse_info array.
                            @traverse_info.push edge.e
    
                    # Only runs this code if the last point is not directly
                    # connected with the next point in exp_nodes array
                    if @traverse_info.slice(-1)[0] instanceof Node
                        # loop through fork array for backtracking
                        for node in fork
                            # look at previous nodes connections
                            for edge in node.edges
                                # if the previous node is connected with the next node
                                # then add the connection to the traverse_info array for
                                # animation.
                                if edge.n.id is exp_nodes[0].id
                                    @traverse_info.push edge.e
    */
  };

  DLS.prototype.create_path_info = function() {
    var current, edge, i, j, out_edges, out_sub, rev_explored, rev_path_info, _i, _j, _len, _len2, _ref, _ref2, _ref3;
    console.log("creating path info...");
    rev_explored = this.explored_nodes.reverse();
    rev_path_info = this.path_info.reverse();
    for (i = 0, _ref = rev_explored.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      out_sub = [rev_explored[i]];
      out_edges = [];
      current = rev_path_info[i];
      _ref2 = current.edges;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        edge = _ref2[_i];
        if (edge.n.id === out_sub.slice(-1)[0].id) out_edges.push(edge.e);
      }
      j = i;
      while (j !== rev_path_info.length - 1) {
        j++;
        if (rev_explored[j].id === current.id) {
          out_sub.push(rev_explored[j]);
          current = rev_path_info[j];
          _ref3 = current.edges;
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            edge = _ref3[_j];
            if (edge.n.id === out_sub.slice(-1)[0].id) out_edges.push(edge.e);
          }
        }
      }
      this.path_info[i] = out_sub.reverse();
      this.path_edges[i] = out_edges.reverse();
    }
    this.path_info.reverse();
    this.path_edges.reverse();
    console.log(this.path_info);
    return console.log(this.path_edges);
  };

  return DLS;

})();

this.DLS = DLS;
}).call(this);
