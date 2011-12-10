(function() {
  var BFS;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BFS = (function() {
    __extends(BFS, Algorithm);
    function BFS() {
      BFS.__super__.constructor.apply(this, arguments);
    }
    BFS.prototype.name = "Breadth-First Search";
    BFS.prototype.destroy = function() {
      var node, _i, _len, _ref;
      _ref = this.explored_nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        delete node.explored;
      }
      return BFS.__super__.destroy.apply(this, arguments);
    };
    BFS.prototype.search = function() {
      var current_node, found, neighbour, neighbours, node, queue, visitable, _i, _len, _ref, _results;
      _ref = this.explored_nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.explored = false;
      }
      this.explored_nodes = [];
      this.traverse_info = [];
      queue = [];
      found = false;
      queue.push(this.root_node);
      this.root_node.explored = true;
      this.traverse_info.push(this.root_node);
      this.explored_nodes.push(this.root_node);
      if (this.root_node === this.goal_node) {
        return;
      }
      _results = [];
      while (queue.length !== 0) {
        current_node = queue.shift();
        if (found) {
          break;
        }
        if (current_node === this.goal_node) {
          this.explored_nodes.push(current_node);
          this.traverse_info.push(current_node);
          break;
        }
        neighbours = current_node.edges;
        _results.push((function() {
          var _j, _len2, _results2;
          _results2 = [];
          for (_j = 0, _len2 = neighbours.length; _j < _len2; _j++) {
            neighbour = neighbours[_j];
            if (this.is_from_goal != null) {
              visitable = neighbour.e.visitable(current_node, true);
            } else {
              visitable = neighbour.e.visitable(current_node);
            }
            if (!neighbour.n.explored && visitable) {
              neighbour.n.explored = true;
              this.traverse_info.push(neighbour.e);
              this.traverse_info.push(neighbour.n);
              this.explored_nodes.push(neighbour.n);
              if (neighbour.n === this.goal_node) {
                found = true;
                break;
              }
              queue.push(neighbour.n);
            }
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    BFS.prototype.create_traverse_info = function() {
      return false;
    };
    BFS.prototype.gen_info = function() {
      return ["Complete", "O(|V|+|E|)", "O(|V|)", "Not Optimal"];
    };
    BFS.prototype.run_info = function() {
      return alert("Run information");
    };
    return BFS;
  })();
  this.BFS = BFS;
}).call(this);
