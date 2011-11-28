(function() {
  var Animate;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Animate = (function() {
    function Animate() {}
    Animate.prototype.pointer = 0;
    Animate.prototype.algorithm = null;
    Animate.prototype.destroy = function() {
      APP.graph.remove_styles();
      return delete this;
    };
    Animate.prototype.step_forward = function() {
      var current_item, edge, previous_item, _i, _j, _len, _len2, _ref, _ref2;
      if ((this.algorithm.traverse_info != null) && this.pointer < this.algorithm.traverse_info.length) {
        this.traverse_info = this.algorithm.traverse_info;
        current_item = this.traverse_info[this.pointer];
        if (current_item === this.algorithm.goal_node) {
          current_item.update_style("goal");
        } else {
          current_item.update_style("viewing");
        }
        if (current_item instanceof Node) {
          _ref = current_item.edges;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            edge = _ref[_i];
            if (edge.e.style === "normal") {
              edge.e.update_style("potential");
            }
          }
        }
        if (this.pointer !== 0) {
          previous_item = this.traverse_info[this.pointer - 1];
          if (previous_item.style === "viewing") {
            previous_item.update_style("visited");
            if (previous_item instanceof Node) {
              _ref2 = previous_item.edges;
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                edge = _ref2[_j];
                if (edge.e.style === "potential" && this.algorithm.name !== "AStar" && this.algorithm.name !== "BiDi") {
                  edge.e.update_style("normal");
                }
              }
            }
          }
        }
        return this.pointer++;
      }
    };
    Animate.prototype.step_backward = function() {
      var current_item, edge, previous_item, _i, _j, _len, _len2, _ref, _ref2, _results;
      if ((this.algorithm.traverse_info != null) && this.pointer > 0) {
        this.pointer--;
        this.traverse_info = this.algorithm.traverse_info;
        current_item = this.traverse_info[this.pointer];
        current_item.update_style("normal");
        if (current_item instanceof Node) {
          _ref = current_item.edges;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            edge = _ref[_i];
            if (edge.e.style === "potential") {
              edge.e.update_style("normal");
            }
          }
        }
        if (this.pointer !== 0) {
          previous_item = this.traverse_info[this.pointer - 1];
          previous_item.update_style("viewing");
          if (previous_item instanceof Node) {
            _ref2 = previous_item.edges;
            _results = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              edge = _ref2[_j];
              _results.push(edge.e.style !== "visited" ? edge.e.update_style("potential") : void 0);
            }
            return _results;
          }
        }
      }
    };
    Animate.prototype.traverse = function() {
      var doTraverse, traverse_speed;
      traverse_speed = 500;
      this.pointer = 0;
      if (this.algorithm.traverse_info != null) {
        doTraverse = __bind(function() {
          this.step_forward();
          if (this.pointer < this.algorithm.traverse_info.length) {
            return setTimeout(doTraverse, traverse_speed);
          }
        }, this);
        return setTimeout(doTraverse, traverse_speed);
      }
    };
    return Animate;
  })();
  this.Animate = Animate;
}).call(this);
