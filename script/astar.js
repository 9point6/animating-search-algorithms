(function() {
  /(?:)/;
  /(?:)/;
  /(?:)/;
  /(?:)/;
  /(?:)/;
  /(?:)/;
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
    __extends(DFS, Algorithm);
    function DFS() {
      DFS.__super__.constructor.apply(this, arguments);
    }
    DFS.prototype.name = "A* Search";
    DFS.prototype.destroy = function() {
      var node, _i, _len, _ref;
      _ref = this.explored_nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        delete node.explored;
      }
      return DFS.__super__.destroy.apply(this, arguments);
    };
    DFS.prototype.search = function(heuristic) {
      var closedList, connection, currentNode, endNode, openList, potentialCost, _results;
      this.destroy;
      this.explored_nodes = [];
      openList = [];
      closedList = [];
      if (this.root_node.id === this.goal_node.id) {
        break;
      } else {
        root_node.costSoFar = 0;
        root_node.estimatedTotalCost = this.root_node.costSoFar + heuristic(root_node, goal_node);
        openList.push(this.root_node);
      }
      _results = [];
      while (openList.length !== 0) {
        currentNode = this.getSmallestElement(openList);
        this.explored_nodes.push;
        _results.push((function() {
          var _i, _len, _ref, _results2;
          _ref = currentNode.edges;
          _results2 = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            connection = _ref[_i];
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
            this.remove(openList, currentNode);
            _results2.push(closedList.push(currentNode));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    DFS.prototype.contains = function(a, obj) {
      var i;
      i = a.length;
      while (i--) {
        if (a[i] === obj) {
          return true;
        }
      }
      return false;
    };
    DFS.prototype.remove = function(a, obj) {
      var i, _results;
      i = a.length;
      _results = [];
      while (i--) {
        _results.push(a[i] === obj ? a.splice(i, 1) : void 0);
      }
      return _results;
    };
    DFS.prototype.getSmallestElement = function(a) {
      var node, smallNode, _i, _len, _results;
      smallNode = a[0];
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        node = a[_i];
        _results.push(smallNode.estimatedTotalCost > node.estimatedTotalCost ? smallNode = node : void 0);
      }
      return _results;
    };
    return DFS;
  })();
}).call(this);
