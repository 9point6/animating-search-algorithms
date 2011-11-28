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
      return this._search(this.root_node, 4);
    };
    DLS.prototype._search = function(node, depth) {
      var neighbour, _i, _len, _ref, _results;
      if (depth > 0) {
        if (!node.explored) {
          this.explored_nodes.push(node);
        }
        node.explored = true;
        if (node === this.goal_node) {
          return node;
        }
        _ref = node.edges;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          neighbour = _ref[_i];
          _results.push(this._search(neighbour.n, depth - 1));
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
      var current_node, edge, exp_nodes, fork, node, _results;
      this.traverse_info = [];
      fork = [];
      exp_nodes = this.explored_nodes.slice(0);
      _results = [];
      while (exp_nodes.length !== 0) {
        current_node = exp_nodes.shift();
        this.traverse_info.push(current_node);
        fork.unshift(current_node);
        _results.push((function() {
          var _i, _j, _len, _len2, _ref, _results2;
          if (exp_nodes.length !== 0) {
            _ref = current_node.edges;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              edge = _ref[_i];
              if (edge.n.id === exp_nodes[0].id) {
                this.traverse_info.push(edge.e);
              }
            }
            if (this.traverse_info.slice(-1)[0] instanceof Node) {
              _results2 = [];
              for (_j = 0, _len2 = fork.length; _j < _len2; _j++) {
                node = fork[_j];
                _results2.push((function() {
                  var _k, _len3, _ref2, _results3;
                  _ref2 = node.edges;
                  _results3 = [];
                  for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
                    edge = _ref2[_k];
                    _results3.push(edge.n.id === exp_nodes[0].id ? this.traverse_info.push(edge.e) : void 0);
                  }
                  return _results3;
                }).call(this));
              }
              return _results2;
            }
          }
        }).call(this));
      }
      return _results;
    };
    return DLS;
  })();
  this.DLS = DLS;
}).call(this);
