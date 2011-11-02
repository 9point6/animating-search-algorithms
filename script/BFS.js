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
  __extends(BFS, algorithm);
  function BFS() {
    BFS.__super__.constructor.apply(this, arguments);
  }
  BFS.prototype.search = function() {
    var neighbour, neighbours, queue, root_node, _results;
    queue = [];
    queue.push(root_node);
    explored_nodes.push(root_node);
    if (root_node === goal_node) {
      return;
    }
    _results = [];
    while (queue.length === !0) {
      root_node = queue.shift();
      neighbours = root_node.connections;
      _results.push((function() {
        var _i, _len, _results2;
        _results2 = [];
        for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
          neighbour = neighbours[_i];
          explored_nodes.push(neighbour.p);
          if (neighbour.p === goal_node) {
            break;
          }
        }
        return _results2;
      })());
    }
    return _results;
  };
  return BFS;
})();