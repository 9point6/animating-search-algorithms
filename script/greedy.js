(function() {
  var Greedy;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Greedy = (function() {
    __extends(Greedy, Algorithm);
    function Greedy() {
      Greedy.__super__.constructor.apply(this, arguments);
    }
    Greedy.prototype.name = "Greedy Search";
    Greedy.prototype.destroy = function() {
      var node, _i, _len, _ref;
      _ref = this.explored_nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        delete node.explored;
      }
      return Greedy.__super__.destroy.apply(this, arguments);
    };
    Greedy.prototype.search = function() {
      this.heuristic = new Heuristics();
      return this._search();
    };
    Greedy.prototype._search = function() {
      var connection, currentNode, endNode, openList, potentialCost, visitable, _i, _len, _ref, _results;
      this.destroy();
      this.explored_nodes = [];
      openList = [];
      if (this.root_node.id === this.goal_node.id) {
        return;
      } else {
        this.root_node.costSoFar = 0;
        this.root_node.estimatedTotalCost = 0 + this.root_node.costSoFar + this.heuristic.choice(this.heuristic_choice, this.root_node, this.goal_node);
        openList.push(this.root_node);
        currentNode = this.root_node;
      }
      _results = [];
      while (openList.length !== 0) {
        openList = [];
        currentNode.explored = true;
        this.explored_nodes.push(currentNode);
        if (currentNode === this.goal_node) {
          break;
        }
        if (currentNode != null) {
          _ref = currentNode.edges;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            connection = _ref[_i];
            if (this.is_from_goal != null) {
              visitable = connection.e.visitable(currentNode, true);
            } else {
              visitable = connection.e.visitable(currentNode);
            }
            endNode = connection.n;
            if (visitable && !endNode.explored) {
              potentialCost = currentNode.costSoFar + connection.e.weight;
              endNode.costSoFar = potentialCost;
              endNode.estimatedTotalCost = endNode.costSoFar + this.heuristic.choice(this.heuristic_choice, endNode, this.goal_node);
              openList.push(endNode);
            }
          }
        } else {
          break;
        }
        _results.push(currentNode = this.getSmallestElement(openList));
      }
      return _results;
    };
    Greedy.prototype.remove = function(a, obj) {
      var i, _results;
      i = a.length;
      _results = [];
      while (i--) {
        _results.push(a[i] === obj ? a.splice(i, 1) : void 0);
      }
      return _results;
    };
    Greedy.prototype.getSmallestElement = function(a) {
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
    Greedy.prototype.gen_info = function() {
      return ["Complete", "Variable", "O(V)", "Optimal", "needsheuristic"];
    };
    Greedy.prototype.run_info = function() {
      return alert("run information");
    };
    Greedy.prototype.create_traverse_info = function() {
      var current_node, edge, exp_nodes, fork, found, node, visitable, _results;
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
              if (this.is_from_goal != null) {
                visitable = edge.e.visitable(current_node, true);
              } else {
                visitable = edge.e.visitable(current_node);
              }
              if (edge.n.id === exp_nodes[0].id && visitable) {
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
                      if (this.is_from_goal != null) {
                        visitable = edge.e.visitable(node, true);
                      } else {
                        visitable = edge.e.visitable(node);
                      }
                      if (edge.n.id === exp_nodes[0].id && visitable) {
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
    return Greedy;
  })();
  this.Greedy = Greedy;
}).call(this);
