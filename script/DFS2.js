(function() {
  var DFS2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  DFS2 = (function() {
    __extends(DFS2, algorithm);
    function DFS2() {
      DFS2.__super__.constructor.apply(this, arguments);
    }
    DFS2.prototype.name = "DFS2";
    DFS2.prototype.current_node = root_node;
    DFS2.prototype.search = function() {
      var c, current_node, incident_edges, node, _i, _len, _results;
      explored_nodes.push(root_node);
      incident_edges = current_node.connections;
      _results = [];
      for (_i = 0, _len = incident_edge.length; _i < _len; _i++) {
        c = incident_edge[_i];
        _results.push(c.explored === false ? (node = edge.p, node.explored === false ? (c.discovery_edge = true, current_node = node, this.search) : void 0) : c.back_edge = true);
      }
      return _results;
    };
    DFS2.prototype.gen_info = function() {
      return alert("gen info");
    };
    DFS2.prototype.run_info = function() {
      return alert("run info");
    };
    return DFS2;
  })();
}).call(this);
