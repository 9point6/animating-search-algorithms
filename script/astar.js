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
      this.heuristic = new Heuristics();
      return this._search();
    };
    AStar.prototype._search = function() {
      var closedList, connection, currentNode, endNode, openList, potentialCost, visitable, _i, _len, _ref, _results;
      this.destroy;
      this.explored_nodes = [];
      openList = [];
      closedList = [];
      if (this.root_node.id === this.goal_node.id) {
        return;
      } else {
        this.root_node.costSoFar = 0;
        this.root_node.estimatedTotalCost = 0 + this.root_node.costSoFar + this.heuristic.choice(this.heuristic_choice, this.root_node, this.goal_node);
        openList.push(this.root_node);
      }
      _results = [];
      while (openList.length !== 0) {
        currentNode = this.getSmallestElement(openList);
        this.explored_nodes.push(currentNode);
        if (currentNode === this.goal_node) {
          break;
        }
        _ref = currentNode.edges;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          connection = _ref[_i];
          if (this.is_from_goal != null) {
            visitable = connection.e.visitable(currentNode, true);
          } else {
            visitable = connection.e.visitable(currentNode);
          }
          if (visitable) {
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
              endNode.estimatedTotalCost = endNode.costSoFar + this.heuristic.choice(this.heuristic_choice, endNode, this.goal_node);
              openList.push(endNode);
            }
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
      var node, smallNode, _i, _len;
      smallNode = a[0];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        node = a[_i];
        if (smallNode.estimatedTotalCost > node.estimatedTotalCost) {
          smallNode = node;
        }
      }
      return smallNode;
    };
    AStar.prototype.gen_info = function() {
      return ["Complete", "O(log h<sup>*</sup>(x))", "O(bm)", "Optimal", "needsheuristic"];
    };
    AStar.prototype.run_info = function() {
      return alert("run information");
    };
    AStar.prototype.create_traverse_info = function() {
      var current_node, edge, exp_nodes, fork, found, node, _results;
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
              found = false;
              _results2 = [];
              for (_j = 0, _len2 = fork.length; _j < _len2; _j++) {
                node = fork[_j];
                _results2.push((function() {
                  var _k, _len3, _ref2, _results3;
                  if (!found) {
                    _ref2 = node.edges;
                    _results3 = [];
                    for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
                      edge = _ref2[_k];
                      if (edge.n.id === exp_nodes[0].id) {
                        this.traverse_info.push(edge.e);
                        found = true;
                        break;
                      }
                    }
                    return _results3;
                  }
                }).call(this));
              }
              return _results2;
            }
          }
        }).call(this));
      }
      return _results;
    };
    return AStar;
  })();
  this.AStar = AStar;
}).call(this);
