(function() {
  var Animate;
  Animate = (function() {
    function Animate() {}
    Animate.prototype.pointer = 0;
    Animate.prototype.algorithm = null;
    Animate.prototype.destroy = function() {
      APP.graph.remove_styles();
      return delete this;
    };
    Animate.prototype.step_forward = function() {
      var con, current_item, previous_item, _i, _j, _len, _len2, _ref, _ref2;
      if ((this.algorithm.traverse_info != null) && this.pointer < this.algorithm.traverse_info.length) {
        this.traverse_info = this.algorithm.traverse_info;
        current_item = this.traverse_info[this.pointer];
        console.log("current item " + current_item.name);
        current_item.update_style("viewing");
        if (current_item instanceof Point) {
          console.log("IT GOT HERE 1");
          _ref = current_item.connections;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            con = _ref[_i];
            if (con.c.style === "normal") {
              con.c.update_style("potential");
            }
          }
        }
        console.log("pointer " + this.pointer);
        if (this.pointer !== 0) {
          previous_item = this.traverse_info[this.pointer - 1];
          console.log("previous_item " + previous_item.name);
          if (previous_item.style === "viewing") {
            previous_item.update_style("visited");
            if (previous_item instanceof Point) {
              _ref2 = previous_item.connections;
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                con = _ref2[_j];
                if (con.c.style === "potential" && this.algorithm.name !== "AStar" && this.algorithm.name !== "BiDi") {
                  con.c.update_style("normal");
                }
              }
            }
          }
        }
        return this.pointer++;
      }
    };
    Animate.prototype.step_backward = function() {
      var con, current_item, previous_item, _i, _j, _len, _len2, _ref, _ref2, _results;
      if ((this.algorithm.traverse_info != null) && this.pointer > 0) {
        this.pointer--;
        this.traverse_info = this.algorithm.traverse_info;
        current_item = this.traverse_info[pointer];
        current_item.update_style("normal");
        if (current_item instanceof Point) {
          _ref = current_item.connections;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            con = _ref[_i];
            if (con.c.style === "potential") {
              con.c.update_style("normal");
            }
          }
        }
        if (this.pointer === !0) {
          previous_item = this.traverse_info[this.pointer - 1];
          previous_item.update_style("viewing");
          if (previous_item instanceof Point) {
            _ref2 = previous_item.connections;
            _results = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              con = _ref2[_j];
              _results.push(con.c.style !== "viewing" ? con.c.update_style("potential") : void 0);
            }
            return _results;
          }
        }
      }
    };
    Animate.prototype.traverse = function() {
      var _results;
      if (this.algorithm.traverse_info != null) {
        _results = [];
        while (pointer <= this.algorithm.traverse_info.length) {
          _results.push(this.step_foward);
        }
        return _results;
      }
    };
    return Animate;
  })();
  this.Animate = Animate;
}).call(this);
