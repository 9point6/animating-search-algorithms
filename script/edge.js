(function() {
  var Edge;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Edge = (function() {
    function Edge(raphael, nodea, nodeb, weight, direction) {
      this.raphael = raphael;
      this.nodea = nodea;
      this.nodeb = nodeb;
      this.weight = weight;
      this.direction = direction;
      this.click = __bind(this.click, this);
      this.hover_out = __bind(this.hover_out, this);
      this.hover_in = __bind(this.hover_in, this);
      this.remove = __bind(this.remove, this);
      this.nodea.connect(this.nodeb, this);
      this.nodeb.connect(this.nodea, this);
      this.style = "normal";
      this.anim_atob = true;
      this.update_midpoint();
      this.r = this.raphael.path();
      this.r.attr({
        stroke: "#666"
      });
      this.wt = this.raphael.text(this.x, this.y - 20, this.weight);
      this.di = this.raphael.path();
      this.di.attr({
        stroke: "#666",
        fill: "#666"
      });
      this.update_path();
      this.r.hover(this.hover_in, this.hover_out);
      this.r.click(this.click);
    }
    Edge.prototype.update_midpoint = function() {
      this.x = (this.nodea.x + this.nodeb.x) / 2;
      this.y = (this.nodea.y + this.nodeb.y) / 2;
      return this.m = (this.nodeb.y - this.nodea.y) / (this.nodeb.x - this.nodea.x);
    };
    Edge.prototype.update_path = function() {
      var add;
      this.update_midpoint();
      add = (this.direction > 0 ? 180 : 0) + (this.nodea.x < this.nodeb.x ? 180 : 0);
      this.r.attr({
        path: "M" + this.nodea.x + " " + this.nodea.y + "L" + this.nodeb.x + " " + this.nodeb.y
      });
      this.wt.attr({
        x: this.x,
        y: this.y - 20
      });
      this.di.attr({
        x: this.x,
        y: this.y,
        path: ["M", this.x, this.y, "L", this.x + 5, this.y + 10, "L", this.x - 5, this.y + 10, "L", this.x, this.y],
        opacity: this.direction === 0 ? 0 : 100
      });
      this.di.translate(0, -5);
      return this.di.rotate(180 / Math.PI * Math.atan(this.m) + 90 + add, true);
    };
    Edge.prototype.remove = function() {
      return this.r.animate({
        opacity: 0
      }, 50, 'linear', __bind(function() {
        var edge, new_edges, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
        this.r.remove();
        new_edges = [];
        _ref = this.nodea.edges;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          edge = _ref[_i];
          if (edge.n.id !== this.nodeb.id) {
            new_edges.push(edge);
          }
        }
        this.nodea.edges = new_edges;
        new_edges = [];
        _ref2 = this.nodeb.edges;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          edge = _ref2[_j];
          if (edge.n.id !== this.nodea.id) {
            new_edges.push(edge);
          }
        }
        this.nodeb.edges = new_edges;
        new_edges = [];
        _ref3 = APP.graph.edges;
        for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
          edge = _ref3[_k];
          if (edge.nodea.id !== this.nodea.id || edge.nodeb.id !== this.nodeb.id) {
            new_edges.push(edge);
          }
        }
        return APP.graph.edges = new_edges;
      }, this));
    };
    Edge.prototype.hover_in = function(e) {
      if (APP.design_mode) {
        this.r.attr({
          cursor: 'pointer'
        });
        return this.r.animate({
          "stroke-width": 3,
          stroke: "#f00"
        });
      }
    };
    Edge.prototype.hover_out = function(e) {
      if (APP.design_mode) {
        this.r.attr({
          cursor: 'normal'
        });
        return this.r.animate({
          "stroke-width": 1,
          stroke: "#666"
        }, 100);
      }
    };
    Edge.prototype.click = function(e) {
      return this.spark(this.direction >= 0);
    };
    Edge.prototype.spark = function(a2b) {
      var grad, spark, start_point, stops;
      if (a2b == null) {
        a2b = true;
      }
      start_point = a2b ? this.nodea : this.nodeb;
      spark = this.raphael.ellipse(start_point.x, start_point.y, 20, 20);
      spark.attr({
        fill: "r#f00-#fff",
        stroke: "transparent"
      });
      grad = $(spark.node).attr("fill");
      grad = grad.substring(4, grad.length - 1);
      stops = $(grad).children();
      $(stops[0]).attr("stop-opacity", "1");
      $(stops[1]).attr("stop-opacity", "0");
      if (a2b) {
        return spark.animateAlong(this.r, 500, false, function() {
          return this.remove();
        });
      } else {
        return spark.animateAlongBack(this.r, 500, false, function() {
          return this.remove();
        });
      }
    };
    Edge.prototype.update_style = function(style_name) {
      var anim_speed;
      anim_speed = 100;
      switch (style_name) {
        case "normal":
          return this.r.animate({
            stroke: "#666",
            "stroke-width": 1
          }, anim_speed, this.style = "normal");
        case "viewing":
          return this.r.animate({
            stroke: "#A40000",
            "stroke-width": 10
          }, anim_speed, this.style = "viewing");
        case "potential":
          return this.r.animate({
            stroke: "#0247FE",
            "stroke-width": 5
          }, anim_speed, this.style = "potential");
        case "visited":
          return this.r.animate({
            stroke: "#000",
            "stroke-width": 3
          }, anim_speed, this.style = "visited");
      }
    };
    return Edge;
  })();
  this.Edge = Edge;
}).call(this);
