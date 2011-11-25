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
    BFS.prototype.name = "Beadth-First Search";
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
      var current_node, neighbour, neighbours, node, queue, _i, _j, _len, _len2, _ref, _results;
      _ref = this.explored_nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.explored = false;
      }
      this.explored_nodes = [];
      this.traverse_info = [];
      queue = [];
      queue.push(this.root_node);
      this.root_node.explored = true;
      if (this.root_node === this.goal_node) {
        return;
      }
      _results = [];
      while (queue.length !== 0) {
        current_node = queue.shift();
        if (current_node === this.goal_node) {
          this.explored_nodes.push(current_node);
          this.traverse_info.push(current_node);
          break;
        }
        neighbours = current_node.connections;
        this.traverse_info.push(current_node);
        for (_j = 0, _len2 = neighbours.length; _j < _len2; _j++) {
          neighbour = neighbours[_j];
          if (!neighbour.p.explored) {
            neighbour.p.explored = true;
            queue.push(neighbour.p);
            this.traverse_info.push(neighbour.c);
          }
        }
        _results.push(this.explored_nodes.push(current_node));
      }
      return _results;
    };
    BFS.prototype.create_traverse_info = function() {};
    BFS.prototype.gen_info = function() {
      return ["Complete", "O(b<sup>d+1</sup>)", "O(b<sup>d</sup>)", "Not Optimal"];
    };
    return BFS;
  })();
  this.BFS = BFS;
}).call(this);
