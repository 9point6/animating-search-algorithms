(function() {
  var BiDirectional;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BiDirectional = (function() {
    __extends(BiDirectional, Algorithm);
    function BiDirectional() {
      BiDirectional.__super__.constructor.apply(this, arguments);
    }
    BiDirectional.prototype.name = "Bi-Directional Search";
    BiDirectional.prototype.pre_run = function() {
      var node, _i, _len, _ref;
      this.alg1 = new DLS();
      this.alg2 = new DLS();
      this.alg1.heuristic_choice = 0;
      this.alg2.heuristic_choice = 0;
      this.alg1.root_node = this.root_node;
      this.alg1.goal_node = this.goal_node;
      this.alg1.search();
      this.alg1.create_traverse_info();
      this.traverse_info_start = this.alg1.traverse_info.slice(0);
      _ref = APP.graph.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.explored = false;
      }
      this.alg2.root_node = this.goal_node;
      this.alg2.goal_node = this.root_node;
      this.alg2.is_from_goal = true;
      this.alg2.search();
      this.alg2.create_traverse_info();
      return this.traverse_info_goal = this.alg2.traverse_info.slice(0);
    };
    BiDirectional.prototype.destroy = function() {
      var node, _i, _len, _ref;
      _ref = this.explored_nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        delete node.explored;
      }
      return BiDirectional.__super__.destroy.apply(this, arguments);
    };
    BiDirectional.prototype.search = function() {
      var combinedArrayLength, i, searched_from_goal, searched_from_start, _results;
      this.traverse_info = [];
      this.explored_nodes = [];
      searched_from_goal = [];
      searched_from_start = [];
      combinedArrayLength = this.traverse_info_start.length + this.traverse_info_goal.length;
      i = 0;
      _results = [];
      while (i < combinedArrayLength) {
        if (i < this.traverse_info_start.length) {
          this.traverse_info.push(this.traverse_info_start[i]);
          searched_from_start.push(this.traverse_info[this.traverse_info.length - 1]);
          if (this.contains(searched_from_goal, searched_from_start[searched_from_start.length - 1])) {
            return;
          }
          if (this.traverse_info[this.traverse_info.length - 1] instanceof Edge) {
            if (this.containsById(searched_from_start, this.traverse_info_start[i].nodea)) {
              if (this.containsById(searched_from_goal, this.traverse_info_start[i].nodeb)) {
                return;
              }
            }
          }
        }
        if (i < this.traverse_info_goal.length) {
          this.traverse_info.push(this.traverse_info_goal[i]);
          searched_from_goal.push(this.traverse_info[this.traverse_info.length - 1]);
          if (this.contains(searched_from_start, searched_from_goal[searched_from_goal.length - 1])) {
            return;
          }
          if (this.traverse_info[this.traverse_info.length - 1] instanceof Edge) {
            if (this.containsById(searched_from_start, this.traverse_info_start[i].nodea)) {
              if (this.containsById(searched_from_goal, this.traverse_info_start[i].nodeb)) {
                return;
              }
            }
          }
        }
        _results.push(i++);
      }
      return _results;
    };
    BiDirectional.prototype.contains = function(a, obj) {
      var i;
      i = a.length;
      while (i--) {
        if ((a[i] != null) && (obj != null)) {
          if (a[i] === obj) {
            return true;
          }
        }
      }
      return false;
    };
    BiDirectional.prototype.containsById = function(a, obj) {
      var i;
      i = a.length;
      while (i--) {
        if ((a[i].id != null) && (obj.id != null)) {
          if (a[i].id === obj.id) {
            return true;
          }
        }
      }
      return false;
    };
    BiDirectional.prototype.gen_info = function() {
      return ["Complete", "O(b<sup>m</sup>)", "O(bm)", "Not Optimal", "bidi"];
    };
    BiDirectional.prototype.run_info = function() {
      return alert("stuff");
    };
    BiDirectional.prototype.create_traverse_info = function() {
      return false;
    };
    return BiDirectional;
  })();
  this.BiDirectional = BiDirectional;
}).call(this);
