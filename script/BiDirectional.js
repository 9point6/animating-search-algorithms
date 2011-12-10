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
    BiDirectional.prototype.name = "Bi-Directional Search";
    function BiDirectional() {
      this.alg = [];
    }
    BiDirectional.prototype.pre_run = function() {
      var node, _i, _len, _ref;
      this.alg[1].root_node = this.root_node;
      this.alg[1].goal_node = this.goal_node;
      this.alg[1].search();
      this.alg[1].create_traverse_info();
      this.traverse_info_start = this.alg[1].traverse_info.slice(0);
      _ref = APP.graph.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.explored = false;
      }
      this.alg[2].root_node = this.goal_node;
      this.alg[2].goal_node = this.root_node;
      this.alg[2].is_from_goal = true;
      this.alg[2].search();
      this.alg[2].create_traverse_info();
      return this.traverse_info_goal = this.alg[2].traverse_info.slice(0);
    };
    BiDirectional.prototype.destroy = function() {
      var node, _i, _len, _ref;
      _ref = APP.graph.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        delete node.explored;
      }
      delete this.alg;
      return BiDirectional.__super__.destroy.apply(this, arguments);
    };
    BiDirectional.prototype.search = function() {
      var combinedArrayLength, i, _results;
      this.traverse_info = [];
      this.explored_nodes = [];
      this.searched_from_goal = [];
      this.searched_from_start = [];
      combinedArrayLength = this.traverse_info_start.length + this.traverse_info_goal.length;
      i = 0;
      _results = [];
      while (i < combinedArrayLength) {
        if (i < this.traverse_info_start.length) {
          this.add_to_traverse_info(this.traverse_info_start, i);
          this.searched_from_start.push(this.get_last_element_of(this.traverse_info));
          if (this.check_for_crossover(this.searched_from_goal, this.searched_from_start)) {
            return;
          }
        }
        if (i < this.traverse_info_goal.length) {
          this.add_to_traverse_info(this.traverse_info_goal, i);
          this.searched_from_goal.push(this.get_last_element_of(this.traverse_info));
          if (this.check_for_crossover(this.searched_from_start, this.searched_from_goal)) {
            return;
          }
        }
        _results.push(i++);
      }
      return _results;
    };
    BiDirectional.prototype.check_for_crossover = function(array1, array2) {
      if (this.contains(array1, this.get_last_element_of(array2))) {
        return true;
      }
      if (this.get_last_element_of(this.traverse_info instanceof Edge)) {
        if (this.traverse_info_start[i] != null) {
          if (this.containsById(this.searched_from_start, this.traverse_info_start[i].nodea)) {
            if (this.containsById(this.searched_from_goal, this.traverse_info_start[i].nodeb)) {
              return true;
            }
          } else if (this.containsById(this.searched_from_start, this.traverse_info_start[i].nodeb)) {
            if (this.containsById(this.searched_from_goal, this.traverse_info_start[i].nodea)) {
              return true;
            }
          }
        }
      }
      return false;
    };
    BiDirectional.prototype.get_last_element_of = function(obj) {
      return obj[obj.length - 1];
    };
    BiDirectional.prototype.add_to_traverse_info = function(obj, i) {
      return this.traverse_info.push(obj[i]);
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
      return ["Variable", "Variable", "Variable", "Variable", "bidi"];
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
