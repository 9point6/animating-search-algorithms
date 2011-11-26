(function() {
  var DLS;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
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
      return this._search(this.root_node, 6);
    };
    DLS.prototype._search = function(node, depth) {
      var neighbour, _i, _len, _ref, _results;
      if (depth > 0) {
        node.explored = true;
        this.traverse_info.push(node);
        if (node === this.goal_node) {
          return node;
        }
        _ref = node.connections;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          neighbour = _ref[_i];
          if (!neighbour.p.explored) {
            this.traverse_info.push(neighbour.c);
            this._search(neighbour.p, depth - 1);
          }
          _results.push(!this.contains(this.traverse_info, neighbour.c) && neighbour.p.explored ? neighbour.p.explored = false : void 0);
        }
        return _results;
      }
    };
    DLS.prototype.contains = function(a, obj) {
      var i;
      i = a.length;
      while (i--) {
        if (a[i] === obj) {
          return true;
        }
      }
      return false;
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
                      for con in current_node.connections
                          # if the other node for the current connection is
                          # the node we are looking for.
                          if con.p.id is exp_nodes[0].id
                              # add connection to the traverse_info array.
                              @traverse_info.push con.c
      
                      # Only runs this code if the last point is not directly
                      # connected with the next point in exp_nodes array
                      if @traverse_info.slice(-1)[0] instanceof Point
                          # loop through fork array for backtracking
                          for node in fork
                              # look at previous nodes connections
                              for con in node.connections
                                  # if the previous node is connected with the next node
                                  # then add the connection to the traverse_info array for
                                  # animation.
                                  if con.p.id is exp_nodes[0].id
                                      @traverse_info.push con.c
              */
    };
    return DLS;
  })();
  this.DLS = DLS;
}).call(this);
