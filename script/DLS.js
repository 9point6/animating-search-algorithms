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
    __extends(DLS, algorithm);
    function DLS() {
      DLS.__super__.constructor.apply(this, arguments);
    }
    DLS.prototype.search = function() {
      var current_node, limit, neighbour, neighbours, todo_list, _results;
      todo_list = [];
      limit = 4;
      todo_list.push(root_node);
      _results = [];
      while ((todo_list.length === !0) && (todo_list.length < limit)) {
        current_node = todo_list.pull;
        if (current_node === goal_node) {
          explored_nodes.push(current_node);
          break;
        }
        neighbours = current_node.connections;
        _results.push((function() {
          var _i, _len, _results2;
          _results2 = [];
          for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
            neighbour = neighbours[_i];
            todo_list.push(neighbour.p);
            explored_nodes.push(neighbour.p);
            _results2.push(explored_connections.push(neighbour.c));
          }
          return _results2;
        })());
      }
      return _results;
    };
    return DLS;
  })();
}).call(this);
