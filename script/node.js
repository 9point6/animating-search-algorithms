(function() {
  var Node;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Node = (function() {
    function Node(raphael, x, y, name) {
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
      this.edges = [];
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
    Node.prototype.setRoot = function() {
      if (!this.goal && !this.root) {
        this.root = true;
        this.emph = this.raphael.circle(this.x, this.y, 10);
        this.emph.attr({
          stroke: "#f00",
          "stroke-width": 2
        });
      }
      return this;
    };
    Node.prototype.setGoal = function() {
      if (!this.goal && !this.root) {
        this.goal = true;
        this.emph = this.raphael.circle(this.x, this.y, 10);
        this.emph.attr({
          fill: "#0f0",
          stroke: "#0f0",
          "stroke-width": 2
        });
        $(this.emph.node).prependTo($('svg')[0]);
      }
      return this;
    };
    Node.prototype.unsetGoalRoot = function() {
      if (this.goal || this.root) {
        this.emph.remove();
        if (this.root) {
          APP.current_algo.root_node = null;
          this.root = false;
        }
        if (this.goal) {
          APP.current_algo.goal_node = null;
          return this.goal = false;
        }
      }
    };
    Node.prototype.connect = function(other_node, edge) {
      return this.edges.push({
        n: other_node,
        e: edge
      });
    };
    Node.prototype.remove = function() {
      var edge, _i, _len, _ref;
      _ref = this.edges;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        edge = _ref[_i];
        edge.e.remove();
      }
      this.r.animate({
        r: 0,
        opacity: 0
      }, 200, 'linear', __bind(function() {
        var newnodes, node, _j, _len2, _ref2;
        this.label.remove();
        this.r.remove();
        newnodes = [];
        _ref2 = APP.graph.nodes;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          node = _ref2[_j];
          if (node.id !== this.id) {
            newnodes.push(node);
          }
        }
        return APP.graph.nodes = newnodes;
      }, this));
      if (this.goal || this.root) {
        return this.emph.animate({
          r: 0,
          opacity: 0
        }, 200, 'linear');
      }
    };
    Node.prototype.move = function(x, y) {
      this.x = x;
      this.y = y;
      this.r.attr({
        cx: this.x,
        cy: this.y
      });
      this.label.attr({
        x: this.x,
        y: this.y - 20
      });
      if (this.goal || this.root) {
        return this.emph.attr({
          cx: this.x,
          cy: this.y
        });
      }
    };
    Node.prototype.click = function(e) {
      if (APP.graph.connect_mode) {
        this.r.animate({
          r: 10,
          fill: "#f00"
        }, 100);
        return APP.graph.do_mouse_connection(this);
      } else if (APP.graph.remove_mode) {
        return APP.graph.do_mouse_removal(this);
      } else if (APP.root_select_mode) {
        APP.current_algo.root_node = this.setRoot();
        APP.root_select_mode = false;
        APP.goal_select_mode = true;
        return APP.change_help_text("Select goal node");
      } else if (APP.goal_select_mode) {
        APP.current_algo.goal_node = this.setGoal();
        APP.goal_select_mode = false;
        return APP.fade_in_toolbar();
      } else {
        if (APP.design_mode && !this.move_mode) {
          if (APP.context) {
            APP.context.destroy();
          }
          APP.context = new Context({
            items: {
              'Remove': __bind(function() {
                return this.remove();
              }, this)
            },
            x: e.pageX,
            y: e.pageY
          });
        }
        return this.move_mode = false;
      }
    };
    Node.prototype.drag_start = function() {
      var _ref;
      if (APP.design_mode) {
        return _ref = [0 + this.x, 0 + this.y], this.startx = _ref[0], this.starty = _ref[1], _ref;
      }
    };
    Node.prototype.drag_move = function(dx, dy) {
      var edge, _i, _len, _ref, _results;
      if (APP.design_mode) {
        this.move_mode = true;
        this.move(this.startx + dx, this.starty + dy);
        _ref = this.edges;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          edge = _ref[_i];
          _results.push((function(edge) {
            return edge.e.update_path();
          })(edge));
        }
        return _results;
      }
    };
    Node.prototype.drag_up = function() {};
    Node.prototype.move_with_mouse = function() {
      var _ref;
      if (this.drag_start()) {
        _ref = [0, 0], this.startx = _ref[0], this.starty = _ref[1];
        console.log("derp");
        $(this.raphael.canvas).mousemove(__bind(function(e) {
          console.log("df");
          this.drag_move(e.pageX, e.pageY);
          return $(this.raphael.canvas).click(__bind(function(e) {
            this.drag_up();
            $(this.raphael.canvas).unbind('mousemove');
            return $(this.raphael.canvas).unbind('click');
          }, this));
        }, this));
        return console.log("herp");
      }
    };
    Node.prototype.hover_in = function(e) {
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
    Node.prototype.hover_out = function(e) {
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
    Node.prototype.update_style = function(style_name) {
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
    return Node;
  })();
  this.Node = Node;
}).call(this);
