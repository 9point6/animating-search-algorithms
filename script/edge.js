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
      this.anim_atob = true;
      this.update_midpoint();
      this.r = this.raphael.path();
      this.wt = this.raphael.text(this.x, this.y - 20, this.weight);
      $(this.wt.node).css("cursor", "pointer");
      this.di = this.raphael.path();
      this.update_style("normal", true);
      this.update_path();
      this.r.hover(this.hover_in, this.hover_out);
      this.di.hover(this.hover_in, this.hover_out);
      this.wt.hover(this.hover_in, this.hover_out);
      this.r.click(this.click);
      this.di.click(this.click);
      this.wt.click(this.click);
    }
    Edge.prototype.visitable = function(node, reverse) {
      var ret;
      if (reverse == null) {
        reverse = false;
      }
      if (this.direction === 0) {
        return true;
      } else {
        if (this.direction > 0) {
          ret = this.nodea.id === node.id;
        } else {
          ret = this.nodeb.id === node.id;
        }
        if (reverse) {
          return !ret;
        } else {
          return ret;
        }
      }
    };
    Edge.prototype.update_midpoint = function() {
      this.x = (this.nodea.x + this.nodeb.x) / 2;
      this.y = (this.nodea.y + this.nodeb.y) / 2;
      return this.m = (this.nodeb.y - this.nodea.y) / (this.nodeb.x - this.nodea.x);
    };
    Edge.prototype.update_path = function() {
      var add, angle, anglemod;
      this.update_midpoint();
      add = (this.direction > 0 ? 180 : 0) + (this.nodea.x < this.nodeb.x ? 180 : 0);
      angle = 180 / Math.PI * Math.atan(this.m) + 90;
      if ((180 > angle && angle >= 140)) {
        anglemod = -1;
      } else if ((220 > angle && angle >= 180)) {
        anglemod = 1;
      } else if ((360 > angle && angle >= 320)) {
        anglemod = 1;
      } else if ((40 > angle && angle >= 0)) {
        anglemod = -1;
      } else {
        anglemod = 0;
      }
      this.r.attr({
        path: "M" + this.nodea.x + " " + this.nodea.y + "L" + this.nodeb.x + " " + this.nodeb.y
      });
      this.wt.attr({
        x: this.x + 20 * Math.round(anglemod),
        y: this.y - 20
      });
      this.di.attr({
        x: this.x,
        y: this.y,
        path: ["M", this.x, this.y, "L", this.x + 5, this.y + 10, "L", this.x - 5, this.y + 10, "L", this.x, this.y],
        opacity: Math.abs(this.direction * 100)
      });
      this.di.translate(0, -5);
      return this.di.rotate(angle + add, true);
    };
    Edge.prototype.remove = function() {
      this.di.animate({
        opacity: 0
      }, 250, 'linear', function() {
        return this.remove();
      });
      this.wt.animate({
        opacity: 0
      }, 250, 'linear', function() {
        return this.remove();
      });
      return this.r.animate({
        opacity: 0
      }, 250, 'linear', __bind(function() {
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
        this.di.attr({
          cursor: 'pointer'
        });
        return this.update_style("hover");
      }
    };
    Edge.prototype.hover_out = function(e) {
      if (APP.design_mode) {
        this.r.attr({
          cursor: 'normal'
        });
        this.di.attr({
          cursor: 'normal'
        });
        return this.update_style("normal");
      }
    };
    Edge.prototype.click = function(e) {
      if (APP.graph.remove_mode) {
        return APP.graph.do_mouse_removal(this);
      } else if (APP.design_mode) {
        if (APP.context) {
          APP.context.destroy();
        }
        return APP.context = new Context({
          items: {
            'Edit': __bind(function() {
              return this.edit();
            }, this),
            'Remove': __bind(function() {
              return this.remove();
            }, this)
          },
          x: e.pageX,
          y: e.pageY
        });
      }
    };
    Edge.prototype.edit = function() {
      var modal;
      modal = new Modal({
        title: "Edit an edge",
        fields: {
          "weight": {
            type: "text",
            label: "Edge Weight",
            "default": this.weight
          },
          "direction": {
            type: "radio",
            label: "Edge Direction",
            values: {
              "0": "Undirected",
              "-1": "'" + this.nodeb.name + "' to '" + this.nodea.name + "'",
              "1": "'" + this.nodea.name + "' to '" + this.nodeb.name + "'"
            },
            "default": this.direction
          }
        },
        cancel: "Cancel",
        callback: __bind(function(r) {
          this.direction = parseInt(r.direction);
          this.weight = parseInt(r.weight);
          this.wt.attr({
            text: this.weight
          });
          return this.update_path();
        }, this)
      });
      return modal.show();
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
    Edge.prototype.update_style = function(style_name, instant) {
      var anim_speed, colour;
      if (instant == null) {
        instant = false;
      }
      anim_speed = instant ? 0 : 100;
      switch (style_name) {
        case "normal":
          this.r.animate({
            stroke: "#666",
            "stroke-width": 1
          }, anim_speed);
          this.di.animate({
            fill: "#666",
            stroke: "#666",
            "stroke-width": 1
          }, anim_speed);
          this.wt.animate({
            stroke: "#000"
          }, anim_speed);
          return this.style = "normal";
        case "hover":
          this.r.animate({
            stroke: "#f00",
            "stroke-width": 3
          }, anim_speed);
          this.di.animate({
            fill: "#f00",
            stroke: "#f00"
          }, anim_speed);
          this.wt.animate({
            stroke: "#f00"
          }, anim_speed);
          return this.style = "hover";
        case "viewing":
          colour = "#0C3";
          this.r.animate({
            stroke: colour,
            "stroke-width": 10
          }, anim_speed);
          this.di.animate({
            fill: colour,
            stroke: colour,
            "stroke-width": 7
          }, anim_speed);
          return this.style = "viewing";
        case "potential":
          colour = "#0247FE";
          this.r.animate({
            stroke: colour,
            "stroke-width": 5
          }, anim_speed);
          this.di.animate({
            fill: colour,
            stroke: colour,
            "stroke-width": 3
          }, anim_speed);
          return this.style = "potential";
        case "visited":
          colour = "#000";
          this.r.animate({
            stroke: colour,
            "stroke-width": 3
          }, anim_speed);
          this.di.animate({
            fill: colour,
            stroke: colour,
            "stroke-width": 1
          }, anim_speed);
          return this.style = "visited";
        case "path":
          colour = "#F60";
          this.r.animate({
            stroke: colour,
            "stroke-width": 5
          }, anim_speed);
          this.di.animate({
            fill: colour,
            stroke: colour,
            "stroke-width": 3
          }, anim_speed);
          return this.style = "path";
      }
    };
    return Edge;
  })();
  this.Edge = Edge;
}).call(this);
