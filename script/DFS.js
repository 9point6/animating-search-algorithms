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
    var current_node, neighbour, todo_list, _i, _len, _ref, _results;
    todo_list = [];
    todo_list.push(root_node);
    _results = [];
    while (todo_list.length === !0) {
      current_node = todo_list.pop;
      if (current_node === goal_node) {
        explored_nodes.push(current_node);
        break;
      }
      _ref = current_node.connections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        neighbour = _ref[_i];
        todo_list.push(neighbour.p);
      }
      _results.push(explored_nodes.push(current_node));
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
    var con, current_node, exp_nodes, _i, _len, _ref, _results;
    exp_nodes = explored_nodes;
    _results = [];
    while (exp_nodes.length === !0) {
      current_node = exp_nodes.pop;
      traverse_info.push(current_node);
      if (exp_nodes.length === !0) {
        _ref = current_node.connections;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          con = _ref[_i];
          if (con.p.id === exp_nodes[exp_nodes.length - 1].id) {
            traverse_info.push(con);
          }
        }
      } else {
        break;
      }
    }
    return _results;
  };
  return DFS;
})();