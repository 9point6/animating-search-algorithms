(function() {
  var Graph;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Graph = (function() {
    Graph.prototype.connect_mode = false;
    Graph.prototype.remove_mode = false;
    function Graph() {
      this.do_mouse_removal = __bind(this.do_mouse_removal, this);
      this.do_mouse_connection = __bind(this.do_mouse_connection, this);      var _ref;
      _ref = [[], []], this.points = _ref[0], this.connections = _ref[1];
      this.points_id_map = {};
      this.canvas_dimensions();
      $(window).resize(__bind(function(e) {
        this.canvas_dimensions();
        return this.paper.setSize(this.wx, this.wy);
      }, this));
      this.paper = Raphael(0, 0, this.wx, this.wy);
    }
    Graph.prototype.sort_elements = function() {
      var elem, _i, _len, _ref, _results;
      _ref = $('svg circle');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        _results.push($(elem).appendTo($('svg')[0]));
      }
      return _results;
    };
    Graph.prototype.canvas_dimensions = function() {
      this.wx = $(window).width();
      return this.wy = $(window).height();
    };
    Graph.prototype.remove_styles = function() {
      var connection, point, _i, _j, _len, _len2, _ref, _ref2, _results;
      _ref = this.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        point.update_style("normal");
      }
      _ref2 = this.connections;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        connection = _ref2[_j];
        _results.push(connection.update_style("normal"));
      }
      return _results;
    };
    Graph.prototype.add_point = function(x, y, name, id) {
      var newpoint;
      if (name == null) {
        name = "";
      }
      newpoint = new Point(this.paper, x, y, name);
      if (id != null) {
        newpoint.id = id;
      }
      this.points_id_map[newpoint.id] = newpoint;
      this.points.push(newpoint);
      return newpoint;
    };
    Graph.prototype.connect = function(pointa, pointb, weight, direction) {
      var newcon;
      if (weight == null) {
        weight = 0;
      }
      if (direction == null) {
        direction = 0;
      }
      newcon = new Connection(this.paper, pointa, pointb, weight, direction);
      this.connections.push(newcon);
      this.sort_elements();
      return newcon;
    };
    Graph.prototype.do_mouse_connection = function(obj) {
      var a, b, con, newcon, not_connected, _i, _len, _ref, _ref2;
      if (this.connect_mode === false) {
        _ref = [
          {
            id: '0'
          }, {
            id: '0'
          }
        ], this.conpa = _ref[0], this.conpb = _ref[1];
        this.connect_mode = true;
        return APP.fade_out_toolbar("Click two nodes to connect");
      } else {
        if (this.conpa.id === '0') {
          return this.conpa = obj;
        } else {
          if (this.conpa.id !== obj.id) {
            not_connected = true;
            _ref2 = this.connections;
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              con = _ref2[_i];
              a = con.pointa.id;
              b = con.pointb.id;
              if ((a === this.conpa.id && b === obj.id) || (b === this.conpa.id && a === obj.id)) {
                not_connected = false;
              }
            }
            if (not_connected) {
              this.conpb = obj;
              newcon = this.connect(this.conpa, this.conpb);
              this.conpa.r.animate({
                r: 5,
                fill: "#000"
              }, 100);
              this.conpb.r.animate({
                r: 5,
                fill: "#000"
              }, 100);
              newcon.spark();
              this.connect_mode = false;
              return APP.fade_in_toolbar();
            } else {
              return obj.update_style("normal");
            }
          }
        }
      }
    };
    Graph.prototype.do_mouse_removal = function(obj) {
      if (this.remove_mode === false) {
        this.remove_mode = true;
        return APP.fade_out_toolbar("Click a node to remove it");
      } else {
        obj.remove();
        this.remove_mode = false;
        return APP.fade_in_toolbar();
      }
    };
    Graph.prototype.serialise_graph = function() {
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
    Graph.prototype.clear_graph = function() {
      var connection, points, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      _ref = this.points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        points = _ref[_i];
        delete point;
      }
      _ref2 = this.connections;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        connection = _ref2[_j];
        delete connection;
      }
      this.points_id_map = {};
      _ref3 = [[], []], this.points = _ref3[0], this.connections = _ref3[1];
      return this.paper.clear();
    };
    Graph.prototype.parse_string = function(str) {
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
    return Graph;
  })();
  this.Graph = Graph;
}).call(this);
