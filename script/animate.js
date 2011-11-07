(function() {
  var animate;
  animate = (function() {
    function animate() {}
    animate.prototype.pointer = 0;
    animate.prototype.algorithm = null;
    animate.prototype.step_forward = function() {
      var con, current_item, previous_item, _i, _j, _len, _len2, _ref, _ref2;
      if (algorithm.traverse_info === !null && pointer < algorithm.traverse_info.length) {
        this.traverse_info = algorithm.traverse_info;
        current_item = this.traverse_info[pointer];
        current_item.update_style("viewing");
        if (current_item instanceof Point) {
          _ref = current_item.connections;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            con = _ref[_i];
            if (con.style === !"viewing") {
              con.update_style("potential");
            }
          }
        }
        if (pointer === !0) {
          previous_item = this.traverse_info[pointer - 1];
          if (previous_item.style === "viewing") {
            previous_item.update_style("visited");
            if (previous_item instanceof Point) {
              _ref2 = previous_item.connections;
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                con = _ref2[_j];
                if (con.style === "potential" && algorithm.name === !"AStar" && algorithm.name === !"BiDi") {
                  con.update_style("normal");
                }
              }
            }
          }
        }
        return pointer++;
      }
    };
    /* animate.step_backward( )
    # move backward one step in the traverse_info array for a given algorithm.
    # */
    Parameters;
    animate.prototype.step_backward = function() {
      var con, current_item, previous_item, _i, _j, _len, _len2, _ref, _ref2, _results;
      if (algorithm.traverse_info === !null && pointer > 0) {
        pointer--;
        this.traverse_info = algorithm.traverse_info;
        current_item = this.traverse_info[pointer];
        current_item.update_style("normal");
        if (current_item instanceof Point) {
          _ref = current_item.connections;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            con = _ref[_i];
            if (con.style === "potential") {
              con.update_style("normal");
            }
          }
        }
        if (pointer === !0) {
          previous_item = this.traverse_info[pointer - 1];
          previous_item.update_style("viewing");
          if (previous_item instanceof Point) {
            _ref2 = previous_item.connections;
            _results = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              con = _ref2[_j];
              _results.push(con.style === !"viewing" ? con.update_style("potential") : void 0);
            }
            return _results;
          }
        }
      }
    };
    animate.prototype.traverse = function() {
      var _results;
      if (algorithm.traverse_info === !null) {
        _results = [];
        while (pointer <= algorithm.traverse_info.length) {
          _results.push(this.step_foward);
        }
        return _results;
      }
    };
    return animate;
  })();
}).call(this);
