(function() {
  var Animate;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Animate = (function() {
    function Animate() {}
    Animate.prototype.pointer = 0;
    Animate.prototype.algorithm = null;
    Animate.prototype.path_diff = 0;
    Animate.prototype.destroy = function() {
      APP.graph.remove_styles();
      return delete this;
    };
    Animate.prototype.step_forward = function() {
      var current_item, edge, goal_reached, i, is_visited, last_viewed, previous_item, visitable, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _ref4;
      if ((this.algorithm.traverse_info != null) && this.pointer < this.algorithm.traverse_info.length) {
        goal_reached = false;
        this.traverse_info = this.algorithm.traverse_info;
        current_item = this.traverse_info[this.pointer];
        if (current_item === this.algorithm.goal_node && this.algorithm.name !== "Bi-Directional Search") {
          current_item.update_style("goal");
          goal_reached = true;
        } else {
          current_item.update_style("viewing");
        }
        if (current_item instanceof Node) {
          _ref = current_item.edges;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            edge = _ref[_i];
            if (this.algorithm.name === "Bi-Directional Search") {
              if (this.pointer % 2 !== 0) {
                visitable = edge.e.visitable(current_item, true);
              } else {
                visitable = edge.e.visitable(current_item);
              }
            } else {
              visitable = edge.e.visitable(current_item);
            }
            if (edge.e.style === "normal" && !goal_reached && visitable) {
              edge.e.update_style("potential");
            }
          }
        }
        if (this.pointer !== 0) {
          previous_item = this.traverse_info[this.pointer - 1];
          if (previous_item.style === "viewing" && previous_item !== current_item) {
            previous_item.update_style("visited");
            if (previous_item instanceof Node) {
              _ref2 = previous_item.edges;
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                edge = _ref2[_j];
                if ((this.algorithm.path_edges != null) && edge.e.style === "potential") {
                  is_visited = false;
                  for (i = 0, _ref3 = this.pointer; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
                    if (this.traverse_info[i] === edge.e) {
                      is_visited = true;
                      break;
                    }
                  }
                  if (is_visited === true) {
                    edge.e.update_style("visited");
                  } else {
                    edge.e.update_style("normal");
                  }
                }
                if (edge.e.style === "potential") {
                  edge.e.update_style("normal");
                }
              }
            }
          }
          if (this.algorithm.path_edges != null) {
            if (current_item instanceof Node) {
              if (previous_item instanceof Edge) {
                console.log("resetting path");
                this.reset_path();
              }
              last_viewed = previous_item;
              console.log("creating path");
              if (previous_item instanceof Node) {
                this.path_diff++;
              }
              this.create_path((this.pointer + this.path_diff) / 2);
              _ref4 = current_item.edges;
              for (_k = 0, _len3 = _ref4.length; _k < _len3; _k++) {
                edge = _ref4[_k];
                if (edge.n !== this.traverse_info[this.pointer - 2] && edge.e !== last_viewed && !goal_reached && edge.e.visitable(current_item)) {
                  edge.e.update_style("potential");
                }
              }
            }
            if (current_item instanceof Edge) {
              console.log(current_item.nodea);
              console.log(current_item.nodeb);
              if (current_item.nodea !== previous_item && current_item.nodeb !== previous_item) {
                this.reset_path();
                this.create_path((this.pointer + this.path_diff + 1) / 2);
                current_item.update_style("viewing");
              }
            }
          }
        }
        return this.pointer++;
      }
    };
    Animate.prototype.step_backward = function() {
      var current_item, edge, previous_item, visitable, _i, _j, _len, _len2, _ref, _ref2, _results;
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
            if (this.algorithm.path_edges != null) {
              if (current_item instanceof Node) {
                this.path_diff--;
              }
              this.reset_path();
              this.create_path((this.pointer + this.path_diff - 1) / 2);
            }
            _ref2 = previous_item.edges;
            _results = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              edge = _ref2[_j];
              _results.push(edge.e.style !== "visited" ? (this.algorithm.name === "Bi-Directional Search" ? this.pointer % 2 === 0 ? visitable = edge.e.visitable(previous_item, true) : visitable = edge.e.visitable(previous_item) : visitable = edge.e.visitable(previous_item), edge.e.style === "path" ? void 0 : visitable ? edge.e.update_style("potential") : void 0) : void 0);
            }
            return _results;
          }
        }
      }
    };
    Animate.prototype.create_path = function(pointer) {
      var edge, path, _i, _len, _results;
      path = this.algorithm.path_edges[pointer];
      console.log(pointer);
      console.log(path);
      _results = [];
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        edge = path[_i];
        _results.push(edge.style !== "potential" ? edge.update_style("path") : void 0);
      }
      return _results;
    };
    Animate.prototype.reset_path = function() {
      var edge, _i, _len, _ref, _results;
      console.log("really resetting now...");
      _ref = APP.graph.edges;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        edge = _ref[_i];
        _results.push(edge.style === "path" ? edge.update_style("visited") : void 0);
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
