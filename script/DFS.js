var DFS;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
DFS = (function() {
  __extends(DFS, algorithm);
  function DFS() {
    DFS.__super__.constructor.apply(this, arguments);
  }
  DFS.prototype.name = "DFS";
  DFS.prototype.search = function() {
    var current_node, neighbour, node, todo_list, _i, _j, _len, _len2, _ref, _ref2, _results;
    _ref = this.explored_nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      node.explored = false;
    }
    this.explored_nodes = [];
    todo_list = [];
    todo_list.push(this.root_node);
    _results = [];
    while (todo_list.length !== 0) {
      current_node = todo_list.pop();
      current_node.explored = true;
      if (current_node.id === this.goal_node.id) {
        this.explored_nodes.push(current_node);
        break;
      }
      _ref2 = current_node.connections;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        neighbour = _ref2[_j];
        if (!neighbour.p.explored) {
          todo_list.push(neighbour.p);
        }
      }
      _results.push(this.explored_nodes.push(current_node));
    }
    return _results;
  };
  DFS.prototype.gen_info = function() {
    return alert("general information");
  };
  DFS.prototype.run_info = function() {
    return alert("runtime information");
  };
  DFS.prototype.create_traverse_info = function() {
    var con, current_node, exp_nodes, fork, node, pleh, _results;
    this.traverse_info = [];
    fork = [];
    exp_nodes = this.explored_nodes.slice(0);
    _results = [];
    while (exp_nodes.length !== 0) {
      current_node = exp_nodes.shift();
      this.traverse_info.push(current_node);
      if (current_node.connections.length > 2 || current_node.id === this.root_node.id) {
        fork.push(current_node);
      }
      _results.push((function() {
        var _i, _j, _len, _len2, _ref, _ref2, _results2;
        if (exp_nodes.length !== 0) {
          _ref = current_node.connections;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            con = _ref[_i];
            if (con.p.id === exp_nodes[0].id) {
              this.traverse_info.push(con.c);
            }
          }
          pleh = this.traverse_info[this.traverse_info.length - 1] instanceof connection;
          if (!pleh) {
            node = fork[fork.length - 1];
            if (node != null) {
              _ref2 = node.connections;
              _results2 = [];
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                con = _ref2[_j];
                _results2.push(con.p.id === exp_nodes[0].id ? this.traverse_info.push(con.c) : void 0);
              }
              return _results2;
            }
          }
        }
      }).call(this));
    }
    return _results;
  };
  return DFS;
})();