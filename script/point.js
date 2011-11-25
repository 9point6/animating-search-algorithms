(function() {
  var Point;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Point = (function() {
    function Point(raphael, x, y, name) {
      this.raphael = raphael;
      this.x = x;
      this.y = y;
      this.name = name != null ? name : "";
      this.hover_out = __bind(this.hover_out, this);
      this.hover_in = __bind(this.hover_in, this);
      this.move_with_mouse = __bind(this.move_with_mouse, this);
      this.drag_up = __bind(this.drag_up, this);
      this.drag_move = __bind(this.drag_move, this);
      this.drag_start = __bind(this.drag_start, this);
      this.click = __bind(this.click, this);
      this.remove = __bind(this.remove, this);
      this.move_mode = false;
      this.connections = [];
      this.x = parseInt(this.x);
      this.y = parseInt(this.y);
      this.id = uniqueId();
      this.r = this.raphael.circle(this.x, this.y, 5);
      this.label = this.raphael.text(this.x, this.y - 20, this.name);
      this.label.attr({
        opacity: 0
      });
      this.r.attr({
        fill: "#000",
        stroke: "transparent"
      });
      this.r.hover(this.hover_in, this.hover_out);
      this.r.click(this.click);
      this.r.drag(this.drag_move, this.drag_start, this.drag_up);
    }
    Point.prototype.connect = function(other_point, connection) {
      return this.connections.push({
        p: other_point,
        c: connection
      });
    };
    Point.prototype.remove = function() {
      var con, _i, _len, _ref;
      _ref = this.connections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        con = _ref[_i];
        con.c.remove();
      }
      return this.r.animate({
        r: 0,
        opacity: 0
      }, 200, 'linear', __bind(function() {
        var newpoints, point, _j, _len2, _ref2;
        this.label.remove();
        this.r.remove();
        newpoints = [];
        _ref2 = APP.graph.points;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          point = _ref2[_j];
          if (point.id !== this.id) {
            newpoints.push(point);
          }
        }
        return APP.graph.points = newpoints;
      }, this));
    };
    Point.prototype.move = function(x, y) {
      this.x = x;
      this.y = y;
      this.r.attr({
        cx: this.x,
        cy: this.y
      });
      return this.label.attr({
        x: this.x,
        y: this.y - 20
      });
    };
    Point.prototype.click = function(e) {
      if (APP.graph.connect_mode === true) {
        this.r.animate({
          r: 10,
          fill: "#f00"
        }, 100);
        return APP.graph.do_mouse_connection(this);
      } else if (APP.graph.remove_mode === true) {
        return APP.graph.do_mouse_removal(this);
      } else {
        return false;
      }
    };
    Point.prototype.drag_start = function() {
      var _ref;
      if (APP.design_mode) {
        if (this.move_mode === false) {
          this.move_mode = true;
          return _ref = [0 + this.x, 0 + this.y], this.startx = _ref[0], this.starty = _ref[1], _ref;
        } else {
          return false;
        }
      }
    };
    Point.prototype.drag_move = function(dx, dy) {
      var connection, _i, _len, _ref, _results;
      if (APP.design_mode) {
        this.move(this.startx + dx, this.starty + dy);
        _ref = this.connections;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          connection = _ref[_i];
          _results.push((function(connection) {
            return connection.c.update_path();
          })(connection));
        }
        return _results;
      }
    };
    Point.prototype.drag_up = function() {
      if (APP.design_mode) {
        return this.move_mode = false;
      }
    };
    Point.prototype.move_with_mouse = function() {
      var _ref;
      if (this.drag_start()) {
        _ref = [0, 0], this.startx = _ref[0], this.starty = _ref[1];
        return $(this.raphael.canvas).mousemove(__bind(function(e) {
          this.drag_move(e.pageX, e.pageY);
          return $(this.raphael.canvas).click(__bind(function(e) {
            this.drag_up();
            $(this.raphael.canvas).unbind('mousemove');
            return $(this.raphael.canvas).unbind('click');
          }, this));
        }, this));
      }
    };
    Point.prototype.hover_in = function(e) {
      this.r.attr({
        cursor: 'pointer'
      });
      this.r.animate({
        r: 10
      }, 100);
      return this.label.animate({
        opacity: 1
      }, 100);
    };
    Point.prototype.hover_out = function(e) {
      this.r.attr({
        cursor: 'normal'
      });
      this.r.animate({
        r: 5
      }, 100);
      return this.label.animate({
        opacity: 0
      }, 100);
    };
    Point.prototype.update_style = function(style_name) {
      var anim_speed;
      anim_speed = 100;
      switch (style_name) {
        case "normal":
          return this.r.animate({
            fill: "#000"
          }, anim_speed, this.style = "normal");
        case "viewing":
          return this.r.animate({
            fill: "#A40000"
          }, anim_speed, this.style = "viewing");
        case "visited":
          return this.r.animate({
            fill: "#999"
          }, anim_speed, this.style = "visited");
        case "goal":
          return this.r.animate({
            fill: "#FFFF00"
          }, anim_speed, this.style = "goal");
      }
    };
    return Point;
  })();
  this.Point = Point;
}).call(this);
