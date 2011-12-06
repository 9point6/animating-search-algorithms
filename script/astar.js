(function() {
  var AStar;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  AStar = (function() {
    __extends(AStar, Algorithm);
    function AStar() {
      AStar.__super__.constructor.apply(this, arguments);
    }
    AStar.prototype.name = "A* Search";
    AStar.prototype.destroy = function() {
      var node, _i, _len, _ref;
      _ref = this.explored_nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        delete node.explored;
      }
      return AStar.__super__.destroy.apply(this, arguments);
    };
    AStar.prototype.search = function() {
      return this._search(this.heuristic);
    };
    AStar.prototype._search = function(heuristic) {
      var closedList, connection, currentNode, edge, endNode, openList, potentialCost, _i, _j, _len, _len2, _ref, _ref2, _results;
      this.destroy;
      this.explored_nodes = [];
      openList = [];
      closedList = [];
      if (this.root_node.id === this.goal_node.id) {
        break;
      } else {
        this.root_node.costSoFar = 0;
        this.root_node.estimatedTotalCost = this.root_node.costSoFar + heuristic(this.root_node, this.goal_node);
        openList.push(this.root_node);
      }
      _results = [];
      while (openList.length !== 0) {
        currentNode = this.getSmallestElement(openList);
        _ref = currentNode.edges;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          edge = _ref[_i];
          if (edge.n === this.prev_node) {
            this.traverse_info.push(edge.n);
          }
        }
        this.explored_nodes.push(currentNode);
        this.traverse_info.push(currentNode);
        _ref2 = currentNode.edges;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          connection = _ref2[_j];
          endNode = connection.n;
          potentialCost = currentNode.costSoFar + connection.e.weight;
          if (this.contains(closedList, endNode)) {
            if (potentialCost < endNode.costSoFar) {
              endNode.estimatedTotalCost = endNode.estimatedTotalCost - endNode.costSoFar + potentialCost;
              endNode.costSoFar = potentialCost;
              this.remove(closedList, endNode);
              openList.push(endNode);
            }
          } else if (this.contains(openList, endNode)) {
            if (potentialCost < endNode.costSoFar) {
              endNode.estimatedTotalCost = endNode.estimatedTotalCost - endNode.costSoFar + potentialCost;
              endNode.costSoFar = potentialCost;
            }
          } else {
            endNode.costSoFar = potentialCost;
            endNode.estimatedTotalCost = endNode.costSoFar + heuristic(endNode, this.goal_node);
            openList.push(endNode);
          }
        }
        this.remove(openList, currentNode);
        closedList.push(currentNode);
        _results.push(this.prev_node = currentNode);
      }
      return _results;
    };
    AStar.prototype.contains = function(a, obj) {
      var i;
      i = a.length;
      while (i--) {
        if (a[i] === obj) {
          return true;
        }
      }
      return false;
    };
    AStar.prototype.remove = function(a, obj) {
      var i, _results;
      i = a.length;
      _results = [];
      while (i--) {
        _results.push(a[i] === obj ? a.splice(i, 1) : void 0);
      }
      return _results;
    };
    AStar.prototype.getSmallestElement = function(a) {
      var node, smallNode, _i, _len, _results;
      smallNode = a[0];
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        node = a[_i];
        _results.push(smallNode.estimatedTotalCost > node.estimatedTotalCost ? smallNode = node : void 0);
      }
      return _results;
    };
    AStar.prototype.gen_info = function() {
      return alert("general information");
    };
    AStar.prototype.run_info = function() {
      return alert("run information");
    };
    return AStar;
  })();
  this.AStar = AStar;
}).call(this);
