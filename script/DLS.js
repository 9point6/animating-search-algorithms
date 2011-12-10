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
      this.path_info = [];
      this.path_edges = [];
      this.is_found = false;
      this.traverse_info = [];
      this._search(this.root_node, this.depth, this.root_node);
      return this.create_path_info();
    };
    DLS.prototype._search = function(node, depth, prev_node) {
      var neighbour, visitable, _i, _len, _ref, _results;
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
          if (this.is_from_goal != null) {
            visitable = neighbour.e.visitable(node, true);
          } else {
            visitable = neighbour.e.visitable(node);
          }
          if (visitable) {
            if (neighbour.n.id !== prev_node.id) {
              if (depth > 0) {
                this.traverse_info.push(neighbour.e);
              }
              this._search(neighbour.n, depth - 1, node);
              if (this.is_found) {
                break;
              }
            }
          }
        }
        return _results;
      }
    };
    DLS.prototype.gen_info = function() {
      return ["Complete if depth bound correct", "O(|V|+|E|)", "O(|V|)", "Not Optimal", "needsdepth"];
    };
    DLS.prototype.run_info = function() {
      return alert("runtime information");
    };
    DLS.prototype.create_traverse_info = function() {
      return false;
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
          if (edge.n.id === out_sub.slice(-1)[0].id) {
            out_edges.push(edge.e);
          }
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
              if (edge.n.id === out_sub.slice(-1)[0].id) {
                out_edges.push(edge.e);
              }
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
