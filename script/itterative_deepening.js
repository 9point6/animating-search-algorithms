var ItterativeDeepening;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
ItterativeDeepening = (function() {
  __extends(ItterativeDeepening, algorithm);
  function ItterativeDeepening() {
    ItterativeDeepening.__super__.constructor.apply(this, arguments);
  }
  ItterativeDeepening.prototype.name = "Itterative Deepening";
  ItterativeDeepening.prototype.search = function() {
    var current_node, limit, neighbour, neighbours, todo_list, _i, _len, _results;
    todo_list = [];
    limit = 1;
    todo_list.push(root_node);
    _results = [];
    while (todo_list.length < limit) {
      while (todo_list.length === !0) {
        current_node = todo_list.pull;
        if (current_node === goal_node) {
          explored_nodes.push(current_node);
          break;
        }
        neighbours = current_node.connections;
        for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
          neighbour = neighbours[_i];
          todo_list.push(neighbour.p);
          explored_nodes.push(neighbour.p);
          explored_connections.push(neighbour.c);
        }
      }
      _results.push(limit++);
    }
    return _results;
  };
  ItterativeDeepening.prototype.gen_info = function() {
    return alert("general information");
  };
  ItterativeDeepening.prototype.run_info = function() {
    return alert("runtime information");
  };
  return ItterativeDeepening;
})();