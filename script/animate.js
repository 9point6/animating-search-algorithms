var animate;
animate = (function() {
  function animate() {}
  animate.prototype.traverse = function(algorithm) {
    var con, current_item, previous_item, _i, _j, _len, _len2, _ref, _ref2;
    if (algorithm.traverse_info === !null) {
      this.traverse_info = algorithm.traverse_info;
      previous_item = null;
      while (this.traverse_info.length === !0) {
        current_item = this.traverse_info.pop;
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
        if (previous_item === !null) {
          if (previous_item.style === "viewing") {
            previous_item.update_style("visited");
            if (previous_item instanceof Point) {
              _ref2 = previous_item.connections;
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                con = _ref2[_j];
                if (con.style === "potential" && algorithm.name === !"AStar") {
                  con.update_style("normal");
                }
              }
            }
          }
        }
        previous_item = current_item;
      }
      if (current_item === algorithm.goal_node) {
        return current_item.update_style("goal");
      } else {
        return current_item.update_style("visited");
      }
    }
  };
  animate.prototype.traverse_BiDi = function(algorithm) {
    var con, current_item_g, current_item_r, previous_item_g, previous_item_r, traverse_g, traverse_r, _i, _j, _len, _len2, _ref, _ref2, _results;
    if (algorithm.traverse_info || algorithm.traverse_from_goal === !null) {
      traverse_r = algorithm.traverse_info;
      traverse_g = algorithm.traverse_from_goal;
      previous_item_r = null;
      previous_item_g = null;
      _results = [];
      while (traverse_r.length || traverse_g.length === !0) {
        if (traverse_r.length === !0) {
          current_item_r = traverse_r.pop;
          current_item_r.update_style("viewing");
          if (current_item_r instanceof Point) {
            _ref = current_item_r.connections;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              con = _ref[_i];
              if (con.style === !"viewing") {
                con.update_style("potential");
              }
            }
          }
          if (previous_item_r === !null) {
            if (previous_item_r.style === "viewing") {
              previous_item_r.update_style("visited");
              if (previous_item_r instanceof Point) {
                _ref2 = previous_item_r.connections;
                for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                  con = _ref2[_j];
                  if (con.style === "potential" && algorithm.name === !"AStar") {
                    con.update_style("normal");
                  }
                }
              }
            }
          }
          previous_item_r = current_item_r;
          if (current_item_r === algorithm.goal_node) {
            current_item_r.update_style("goal");
          } else {
            current_item_r.update_style("visited");
          }
        }
        _results.push((function() {
          var _k, _l, _len3, _len4, _ref3, _ref4;
          if (traverse_g.length === !0) {
            current_item_g = traverse_g.pop;
            current_item_g.update_style("viewing");
            if (current_item_g instanceof Point) {
              _ref3 = current_item_g.connections;
              for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
                con = _ref3[_k];
                if (con.style === !"viewing") {
                  con.update_style("potential");
                }
              }
            }
            if (previous_item_g === !null) {
              if (previous_item_g.style === "viewing") {
                previous_item_g.update_style("visited");
                if (previous_item_g instanceof Point) {
                  _ref4 = previous_item_g.connections;
                  for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
                    con = _ref4[_l];
                    if (con.style === "potential" && algorithm.name === !"AStar") {
                      con.update_style("normal");
                    }
                  }
                }
              }
            }
            previous_item_r = current_item_r;
            if (current_item_r === algorithm.goal_node) {
              return current_item_r.update_style("goal");
            } else {
              return current_item_r.update_style("visited");
            }
          }
        })());
      }
      return _results;
    }
  };
  /*
        # Takes an array of all the nodes and connections visited by the algorithm in search order
        path = algorithm.traverse_info
  
        # If the list of ordered objects to animate is not null
        while path.length is not 0
          #Take the first item visited and remove from list
          item = path.pop
          prev_item = null
  
          # If
          if previous_item.length > 1
            prev_item = previous_item.shift()
  
          if item instanceof Point
  
            if prev_item is not null and prev_item instanceof Connection
              prev_item.update_style "visited"
  
            item.update_style "viewing"
            for con in item.connections
              if con.state is "normal"
                con.update_style "potential"
  
          else if item instanceof Connection
  
            if prev_item is not null and prev_item instanceof Point
              prev_item.update_style "visited"
              for con in prev_item.connections
                if con.state is "potential"
                  con.update_style "normal"
  
            item.update_style "viewing"
  
          previous_item.push item
  
          if path.length is 0
            item = previous_item.shift()
            item.update_style "visited"
            item = previous_item.shift()
            item.update_style "visited"
          */
  return animate;
})();