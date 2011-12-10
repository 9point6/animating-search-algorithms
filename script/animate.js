(function() {
  var Animate;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Animate = (function() {
    Animate.prototype.pointer = 0;
    Animate.prototype.algorithm = null;
    function Animate() {
      this.VIEWING_CONST = "viewing";
      this.POTENTIAL_CONST = "potential";
      this.NORMAL_CONST = "normal";
      this.VISITED_CONST = "visited";
      this.GOAL_CONST = "goal";
      this.PATH_CONST = "path";
      this.BIDI_CONST = "Bi-Directional Search";
    }
    Animate.prototype.path_diff = 0;
    Animate.prototype.destroy = function() {
      APP.graph.remove_styles();
      return delete this;
    };
    Animate.prototype.step_forward = function() {
      var current_item, goal_reached;
      if ((this.algorithm.traverse_info != null) && this.pointer < this.algorithm.traverse_info.length) {
        goal_reached = false;
        this.traverse_info = this.algorithm.traverse_info;
        current_item = this.traverse_info[this.pointer];
        this.update_current_item(current_item, goal_reached);
        this.update_previous_item(current_item, goal_reached);
        return this.pointer++;
      }
    };
    Animate.prototype.update_previous_item = function(current_item, goal_reached) {
      var edge, i, is_visited, previous_item, _i, _len, _ref, _ref2;
      if (this.pointer !== 0) {
        previous_item = this.traverse_info[this.pointer - 1];
        if (previous_item.style === this.VIEWING_CONST && previous_item !== current_item) {
          previous_item.update_style(this.VISITED_CONST);
          if (previous_item instanceof Node) {
            _ref = previous_item.edges;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              edge = _ref[_i];
              if ((this.algorithm.path_edges != null) && edge.e.style === this.POTENTIAL_CONST) {
                is_visited = false;
                for (i = 0, _ref2 = this.pointer; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
                  if (this.traverse_info[i] === edge.e) {
                    is_visited = true;
                    break;
                  }
                }
                if (is_visited === true) {
                  edge.e.update_style(this.VISITED_CONST);
                } else {
                  edge.e.update_style(this.NORMAL_CONST);
                }
              }
              if (edge.e.style === this.POTENTIAL_CONST) {
                edge.e.update_style(this.NORMAL_CONST);
              }
            }
          }
        }
        return this.update_path(current_item, previous_item, goal_reached);
      }
    };
    Animate.prototype.update_path = function(current_item, previous_item, goal_reached) {
      var edge, last_viewed, _i, _len, _ref;
      if (this.algorithm.path_edges != null) {
        if (current_item instanceof Node) {
          if (previous_item instanceof Edge) {
            this.reset_path();
          }
          last_viewed = previous_item;
          if (previous_item instanceof Node) {
            this.path_diff++;
          }
          this.create_path((this.pointer + this.path_diff) / 2);
          _ref = current_item.edges;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            edge = _ref[_i];
            if (edge.n !== this.traverse_info[this.pointer - 2] && edge.e !== last_viewed && !goal_reached && edge.e.visitable(current_item)) {
              edge.e.update_style(this.POTENTIAL_CONST);
            }
          }
        }
        if (current_item instanceof Edge) {
          if (current_item.nodea !== previous_item && current_item.nodeb !== previous_item) {
            this.reset_path();
            this.create_path((this.pointer + this.path_diff + 1) / 2);
            return current_item.update_style(this.VIEWING_CONST);
          }
        }
      }
    };
    Animate.prototype.update_current_item = function(current_item, goal_reached) {
      var edge, visitable, _i, _len, _ref, _results;
      if (current_item === this.algorithm.goal_node && this.algorithm.name !== this.BIDI_CONST) {
        current_item.update_style(this.GOAL_CONST);
        goal_reached = true;
      } else {
        current_item.update_style(this.VIEWING_CONST);
      }
      if (current_item instanceof Node) {
        _ref = current_item.edges;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          edge = _ref[_i];
          if (this.algorithm.name === this.BIDI_CONST) {
            if (this.pointer % 2 !== 0) {
              visitable = edge.e.visitable(current_item, true);
            } else {
              visitable = edge.e.visitable(current_item);
            }
          } else {
            visitable = edge.e.visitable(current_item);
          }
          _results.push(edge.e.style === this.NORMAL_CONST && !goal_reached && visitable ? edge.e.update_style(this.POTENTIAL_CONST) : void 0);
        }
        return _results;
      }
    };
    Animate.prototype.step_backward = function() {
      var current_item;
      if ((this.algorithm.traverse_info != null) && this.pointer > 0) {
        this.pointer--;
        this.traverse_info = this.algorithm.traverse_info;
        current_item = this.traverse_info[this.pointer];
        this.update_current_item_backwards(current_item);
        return this.update_previous_item_backwards(current_item);
      }
    };
    Animate.prototype.update_current_item_backwards = function(current_item) {
      var edge, _i, _len, _ref, _results;
      current_item.update_style(this.NORMAL_CONST);
      if (current_item instanceof Node) {
        _ref = current_item.edges;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          edge = _ref[_i];
          _results.push(edge.e.style === this.POTENTIAL_CONST ? edge.e.update_style(this.NORMAL_CONST) : void 0);
        }
        return _results;
      }
    };
    Animate.prototype.update_previous_item_backwards = function(current_item) {
      var edge, previous_item, visitable, _i, _len, _ref, _results;
      if (this.pointer !== 0) {
        previous_item = this.traverse_info[this.pointer - 1];
        previous_item.update_style(this.VIEWING_CONST);
        if (previous_item instanceof Node) {
          if (this.algorithm.path_edges != null) {
            if (current_item instanceof Node) {
              this.path_diff--;
            }
            this.reset_path();
            this.create_path((this.pointer + this.path_diff - 1) / 2);
          }
          _ref = previous_item.edges;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            edge = _ref[_i];
            _results.push(edge.e.style !== this.VISITED_CONST ? (this.algorithm.name === this.BIDI_CONST ? this.pointer % 2 === 0 ? visitable = edge.e.visitable(previous_item, true) : visitable = edge.e.visitable(previous_item) : visitable = edge.e.visitable(previous_item), edge.e.style === this.PATH_CONST ? void 0 : visitable ? edge.e.update_style(this.POTENTIAL_CONST) : void 0) : void 0);
          }
          return _results;
        }
      }
    };
    Animate.prototype.create_path = function(pointer) {
      var edge, path, _i, _len, _results;
      path = this.algorithm.path_edges[pointer];
      _results = [];
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        edge = path[_i];
        _results.push(edge.style !== this.POTENTIAL_CONST ? edge.update_style(this.PATH_CONST) : void 0);
      }
      return _results;
    };
    Animate.prototype.reset_path = function() {
      var edge, _i, _len, _ref, _results;
      _ref = APP.graph.edges;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        edge = _ref[_i];
        _results.push(edge.style === this.PATH_CONST ? edge.update_style(this.VISITED_CONST) : void 0);
      }
      return _results;
    };
    Animate.prototype.traverse = function() {
      var doTraverse, traverse_speed;
      traverse_speed = 500;
      if (this.algorithm.traverse_info != null) {
        doTraverse = __bind(function() {
          this.step_forward();
          if (this.pointer < this.algorithm.traverse_info.length && !this._stop) {
            return setTimeout(doTraverse, traverse_speed);
          }
        }, this);
        this._stop = false;
        return setTimeout(doTraverse, traverse_speed);
      }
    };
    Animate.prototype.stop = function() {
      return this._stop = true;
    };
    Animate.prototype.reset = function() {
      APP.graph.remove_styles();
      return this.pointer = 0;
    };
    return Animate;
  })();
  this.Animate = Animate;
}).call(this);
