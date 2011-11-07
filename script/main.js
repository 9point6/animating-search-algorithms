(function() {
  var app;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  app = (function() {
    app.prototype.connect_mode = false;
    app.prototype.remove_mode = false;
    function app() {
      this.do_mouse_removal = __bind(this.do_mouse_removal, this);
      this.do_mouse_connection = __bind(this.do_mouse_connection, this);
      var _ref;
      _ref = [[], []], this.points = _ref[0], this.connections = _ref[1];
      this.points_id_map = {};
      this.canvas_dimensions();
      $(window).resize(__bind(function(e) {
        this.canvas_dimensions();
        return this.paper.setSize(this.wx, this.wy);
      }, this));
      this.paper = Raphael(0, 0, this.wx, this.wy);
      $('body').append('<div id="toolbar">\n    <h1>search<span>r</span></h1>\n    <ul id="designmode">\n        <li id="new" title="New Graph" />\n        <li id="save" title="Save Graph" />\n        <li id="load" title="Load Graph" />\n        <li id="add" title="Add a node" />\n        <li id="remove" title="Remove a node" />\n        <li id="connect" title="Connect two nodes" />\n        <li id="search" title="Switch to search mode" />\n    </ul>\n    <div id="helptext" />\n</div>\n<div id="copyright">\n    <a href="doc">Project Home</a>\n<div>');
      $('#helptext').prop({
        opacity: 0
      });
      $('#new').click(__bind(function(e) {
        return this.clear_graph();
      }, this));
      $('#save').click(__bind(function(e) {
        return prompt("Copy this string to save the graph", this.serialise_graph());
      }, this));
      $('#load').click(__bind(function(e) {
        return this.parse_string(prompt("Paste a saved graph string here"));
      }, this));
      $('#add').click(__bind(function(e) {
        var pnt;
        pnt = this.add_point(1, 1, prompt("What will this point be named?"));
        return pnt.move_with_mouse();
      }, this));
      $('#remove').click(__bind(function(e) {
        return this.do_mouse_removal();
      }, this));
      $('#connect').click(__bind(function(e) {
        return this.do_mouse_connection();
      }, this));
      $('#search').click(__bind(function(e) {
        return alert("Function not added yet!");
      }, this));
      this.add_point(224, 118, "Alan");
      this.add_point(208, 356, "Beth");
      this.add_point(259, 204, "Carl");
      this.add_point(363, 283, "Dave");
      this.add_point(110, 85, "Elle");
      this.connect(this.points[2], this.points[1]);
      this.connect(this.points[2], this.points[3]);
      this.connect(this.points[0], this.points[2]);
      this.connect(this.points[4], this.points[0]);
      this.connect(this.points[3], this.points[1]);
      this.sort_elements();
    }
    app.prototype.sort_elements = function() {
      var elem, _i, _len, _ref, _results;
      _ref = $('svg circle');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        _results.push($(elem).appendTo($('svg')[0]));
      }
      return _results;
    };
    app.prototype.canvas_dimensions = function() {
      this.wx = $(window).width();
      return this.wy = $(window).height();
    };
    app.prototype.add_point = function(x, y, name, id) {
      var newpoint;
      if (name == null) {
        name = "";
      }
      newpoint = new point(this.paper, x, y, name);
      if (id != null) {
        newpoint.id = id;
      }
      this.points_id_map[newpoint.id] = newpoint;
      this.points.push(newpoint);
      return newpoint;
    };
    app.prototype.connect = function(pointa, pointb, weight, direction) {
      var newcon;
      if (weight == null) {
        weight = 0;
      }
      if (direction == null) {
        direction = 0;
      }
      newcon = new connection(this.paper, pointa, pointb, weight, direction);
      this.connections.push(newcon);
      this.sort_elements();
      return newcon;
    };
    app.prototype.do_mouse_connection = function(obj) {
      var newcon, _ref;
      if (this.connect_mode === false) {
        _ref = [
          {
            id: '0'
          }, {
            id: '0'
          }
        ], this.connectpointa = _ref[0], this.connectpointb = _ref[1];
        this.connect_mode = true;
        return this.fade_out_toolbar("Click two nodes to connect them");
      } else {
        if (this.connectpointa.id === '0') {
          return this.connectpointa = obj;
        } else {
          this.connectpointb = obj;
          newcon = this.connect(this.connectpointa, this.connectpointb);
          this.connectpointa.r.animate({
            r: 5,
            fill: "#000"
          }, 100);
          this.connectpointb.r.animate({
            r: 5,
            fill: "#000"
          }, 100);
          newcon.spark();
          this.connect_mode = false;
          return this.fade_in_toolbar();
        }
      }
    };
    app.prototype.do_mouse_removal = function(obj) {
      if (this.remove_mode === false) {
        this.remove_mode = true;
        return this.fade_out_toolbar("Click a node to remove it");
      } else {
        obj.remove();
        this.remove_mode = false;
        return this.fade_in_toolbar();
      }
    };
    app.prototype.fade_out_toolbar = function(text) {
      return $('#designmode').animate({
        opacity: 0
      }, {
        complete: function() {
          $(this).css({
            height: 1
          });
          return $('#helptext').text(text).animate({
            opacity: 100
          });
        }
      });
    };
    app.prototype.fade_in_toolbar = function() {
      return $('#helptext').animate({
        opacity: 0
      }, {
        complete: function() {
          $(this).text("");
          return $('#designmode').css('height', '').animate({
            opacity: 100
          });
        }
      });
    };
    app.prototype.serialise_graph = function() {
      var comma, con, out, point, _i, _j, _len, _len2, _ref, _ref2;
      out = '{ "points": [';
      comma = "";
      _ref = this.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        point.id = point.id != null ? point.id : uniqueId();
        out += comma + (" { \"id\": \"" + point.id + "\", \"x\": \"" + point.x + "\", \"y\": \"" + point.y + "\", \"name\": \"" + point.name + "\" }");
        comma = ",";
      }
      out += ' ], "connections": [';
      comma = "";
      _ref2 = this.connections;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        con = _ref2[_j];
        out += comma + (" { \"a\": \"" + con.pointa.id + "\", \"b\": \"" + con.pointb.id + "\", \"weight\": \"" + con.weight + "\", \"direction\": \"" + con.direction + "\" }");
        comma = ",";
      }
      out += "] }";
      return base64Encode(out);
    };
    app.prototype.clear_graph = function() {
      var _ref;
      this.points_id_map = {};
      _ref = [[], []], this.points = _ref[0], this.connections = _ref[1];
      return this.paper.clear();
    };
    app.prototype.parse_string = function(str) {
      var con, json, obj, point, _i, _j, _len, _len2, _ref, _ref2, _results;
      this.clear_graph();
      json = base64Decode(str);
      obj = $.parseJSON(json);
      _ref = obj.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        this.add_point(point.x, point.y, point.name, point.id);
      }
      _ref2 = obj.connections;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        con = _ref2[_j];
        _results.push(this.connect(this.points_id_map[con.a], this.points_id_map[con.b], con.weight, con.direction));
      }
      return _results;
    };
    return app;
  })();
}).call(this);
