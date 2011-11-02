var point;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
point = (function() {
  function point(raphael, x, y, name) {
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
    app.points_id_map;
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
  point.prototype.connect = function(other_point, connection) {
    return this.connections.push({
      p: other_point,
      c: connection
    });
  };
  point.prototype.remove = function() {
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
      _ref2 = a.points;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        point = _ref2[_j];
        if (point.id !== this.id) {
          newpoints.push(point);
        }
      }
      return a.points = newpoints;
    }, this));
  };
  point.prototype.move = function(x, y) {
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
  point.prototype.click = function(e) {
    if (a.connect_mode === true) {
      this.r.animate({
        r: 10,
        fill: "#f00"
      }, 100);
      return a.do_mouse_connection(this);
    } else if (a.remove_mode === true) {
      return a.do_mouse_removal(this);
    } else {
      return false;
    }
  };
  point.prototype.drag_start = function() {
    var _ref;
    if (this.move_mode === false) {
      this.move_mode = true;
      return _ref = [0 + this.x, 0 + this.y], this.startx = _ref[0], this.starty = _ref[1], _ref;
    } else {
      return false;
    }
  };
  point.prototype.drag_move = function(dx, dy) {
    var connection, _i, _len, _ref, _results;
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
  };
  point.prototype.drag_up = function() {
    return this.move_mode = false;
  };
  point.prototype.move_with_mouse = function() {
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
  point.prototype.hover_in = function(e) {
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
  point.prototype.hover_out = function(e) {
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
  point.prototype.update_style = function(style_name) {
    var anim_speed;
    anim_speed = 100;
    switch (style_name) {
      case "normal":
        return this.r.animate({
          fill: "#000"
        }, anim_speed);
      case "working":
        return this.r.animate({
          fill: "#008000"
        }, anim_speed);
      case "visited":
        return this.r.animate({
          fill: "#999"
        }, anim_speed);
    }
  };
  return point;
})();