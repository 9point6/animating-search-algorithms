var connection;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
connection = (function() {
  function connection(raphael, pointa, pointb, weight, direction) {
    this.raphael = raphael;
    this.pointa = pointa;
    this.pointb = pointb;
    this.weight = weight;
    this.direction = direction;
    this.click = __bind(this.click, this);
    this.hover_out = __bind(this.hover_out, this);
    this.hover_in = __bind(this.hover_in, this);
    this.remove = __bind(this.remove, this);
    this.pointa.connect(this.pointb, this);
    this.pointb.connect(this.pointa, this);
    this.anim_atob = true;
    this.r = this.raphael.path();
    this.r.attr({
      stroke: "#666"
    });
    this.update_path();
    this.r.hover(this.hover_in, this.hover_out);
    this.r.click(this.click);
  }
  connection.prototype.update_path = function() {
    return this.r.attr({
      path: "M" + this.pointa.x + " " + this.pointa.y + "L" + this.pointb.x + " " + this.pointb.y
    });
  };
  connection.prototype.remove = function() {
    return this.r.animate({
      opacity: 0
    }, 50, 'linear', __bind(function() {
      var con, newcons, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
      this.r.remove();
      newcons = [];
      _ref = this.pointa.connections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        con = _ref[_i];
        if (con.p.id !== this.pointb.id) {
          newcons.push(con);
        }
      }
      this.pointa.connections = newcons;
      newcons = [];
      _ref2 = this.pointb.connections;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        con = _ref2[_j];
        if (con.p.id !== this.pointa.id) {
          newcons.push(con);
        }
      }
      this.pointb.connections = newcons;
      newcons = [];
      _ref3 = a.connections;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        con = _ref3[_k];
        if (con.pointa.id !== this.pointa.id || con.pointb.id !== this.pointb.id) {
          newcons.push(con);
        }
      }
      return a.connections = newcons;
    }, this));
  };
  connection.prototype.hover_in = function(e) {
    this.r.attr({
      cursor: 'pointer'
    });
    return this.r.animate({
      "stroke-width": 3,
      stroke: "#f00"
    });
  };
  connection.prototype.hover_out = function(e) {
    this.r.attr({
      cursor: 'normal'
    });
    return this.r.animate({
      "stroke-width": 1,
      stroke: "#666"
    }, 100);
  };
  connection.prototype.click = function(e) {
    return this.spark();
  };
  connection.prototype.spark = function(a2b) {
    var grad, start_point, stops;
    if (a2b == null) {
      a2b = true;
    }
    start_point = a2b ? this.pointa : this.pointb;
    window.spark = this.raphael.ellipse(start_point.x, start_point.y, 20, 20);
    window.spark.attr({
      fill: "r#f00-#fff",
      stroke: "transparent"
    });
    grad = $(spark.node).attr("fill");
    grad = grad.substring(4, grad.length - 1);
    stops = $(grad).children();
    $(stops[0]).attr("stop-opacity", "1");
    $(stops[1]).attr("stop-opacity", "0");
    return window.spark.animateAlong(this.r, 500, false, __bind(function() {
      return spark.remove();
    }, this));
  };
  connection.prototype.update_style = function(style_name) {
    var anim_speed;
    anim_speed = 100;
    switch (style_name) {
      case "normal":
        return this.r.animate({
          stroke: "#666",
          "stroke-width": 1
        }, anim_speed);
      case "viewing":
        return this.r.animate({
          stroke: "#008000",
          "stroke-width": 10
        }, anim_speed);
      case "potential":
        return this.r.animate({
          stroke: "#0247FE",
          "stroke-width": 5
        }, anim_speed);
      case "visited":
        return this.r.animate({
          stroke: "#A40000",
          "stroke-width": 3
        }, anim_speed);
    }
  };
  return connection;
})();