(function() {
  var Graph;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Graph = (function() {
    Graph.prototype.connect_mode = false;
    Graph.prototype.remove_mode = false;
    function Graph() {
      this.do_mouse_removal = __bind(this.do_mouse_removal, this);
      this.do_mouse_connection = __bind(this.do_mouse_connection, this);      var _ref;
      _ref = [[], []], this.nodes = _ref[0], this.edges = _ref[1];
      this.nodes_id_map = {};
      this.nodecount = 0;
      this.edgecount = 0;
      this.edgewsum = 0;
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
      var edge, node, _i, _j, _len, _len2, _ref, _ref2, _results;
      _ref = this.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.update_style("normal");
      }
      _ref2 = this.edges;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        edge = _ref2[_j];
        _results.push(edge.update_style("normal"));
      }
      return _results;
    };
    Graph.prototype.remove_root_and_goal_nodes = function(root, goal) {
      var node, _i, _len, _ref, _results;
      if (root == null) {
        root = true;
      }
      if (goal == null) {
        goal = true;
      }
      _ref = this.nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.unsetGoalRoot(root, goal));
      }
      return _results;
    };
    Graph.prototype.add_node = function(x, y, name, id) {
      var newnode;
      if (name == null) {
        name = "";
      }
      newnode = new Node(this.paper, parseInt(x), parseInt(y), name);
      console.log("" + name + " - " + id);
      if (id != null) {
        newnode.id = id;
      }
      this.nodes_id_map[newnode.id] = newnode;
      this.nodes.push(newnode);
      this.nodecount++;
      return newnode;
    };
    Graph.prototype.connect = function(nodea, nodeb, weight, direction) {
      var newedge;
      if (weight == null) {
        weight = 1;
      }
      if (direction == null) {
        direction = 0;
      }
      weight = parseInt(weight);
      direction = parseInt(direction);
      newedge = new Edge(this.paper, nodea, nodeb, weight, direction);
      this.edges.push(newedge);
      this.edgecount++;
      this.edgewsum += parseInt(weight);
      this.edgewavg = this.edgewsum / this.edgecount;
      this.sort_elements();
      return newedge;
    };
    Graph.prototype.do_mouse_connection = function(obj) {
      var a, b, edge, not_connected, _i, _len, _ref, _ref2;
      if (this.connect_mode === false) {
        _ref = [
          {
            id: '0'
          }, {
            id: '0'
          }
        ], this.edgena = _ref[0], this.edgenb = _ref[1];
        this.connect_mode = true;
        return APP.fade_out_toolbar("Click two nodes to connect", __bind(function() {
          this.remove_styles();
          this.connect_mode = false;
          return APP.fade_in_toolbar();
        }, this));
      } else {
        if (this.edgena.id === '0') {
          return this.edgena = obj;
        } else {
          if (this.edgena.id !== obj.id) {
            not_connected = true;
            _ref2 = this.edges;
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              edge = _ref2[_i];
              a = edge.nodea.id;
              b = edge.nodeb.id;
              if ((a === this.edgena.id && b === obj.id) || (b === this.edgena.id && a === obj.id)) {
                not_connected = false;
              }
            }
            if (not_connected) {
              this.edgenb = obj;
              this.modal = new Modal({
                title: "New connection",
                fields: {
                  "weight": {
                    type: "text",
                    label: "Edge weight",
                    "default": 1
                  },
                  "direction": {
                    type: "radio",
                    label: "Edge Direction",
                    values: {
                      "0": "Undirected",
                      "-1": "'" + this.edgenb.name + "' to '" + this.edgena.name + "'",
                      "1": "'" + this.edgena.name + "' to '" + this.edgenb.name + "'"
                    }
                  }
                },
                callback: __bind(function(r) {
                  var newedge;
                  newedge = this.connect(this.edgena, this.edgenb, r.weight, r.direction);
                  this.edgena.r.animate({
                    r: 5,
                    fill: "#000"
                  }, 100);
                  this.edgenb.r.animate({
                    r: 5,
                    fill: "#000"
                  }, 100);
                  newedge.spark();
                  this.connect_mode = false;
                  return APP.fade_in_toolbar();
                }, this)
              });
              return this.modal.show();
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
        return APP.fade_out_toolbar("Click a node to remove it", __bind(function() {
          this.remove_mode = false;
          return APP.fade_in_toolbar();
        }, this));
      } else {
        obj.remove();
        this.remove_mode = false;
        return APP.fade_in_toolbar();
      }
    };
    Graph.prototype.serialise_graph = function() {
      var comma, edge, node, out, _i, _j, _len, _len2, _ref, _ref2;
      out = '{ "nodes": [';
      comma = "";
      _ref = this.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.id = node.id != null ? node.id : uniqueId();
        out += comma + (" { \"id\": \"" + node.id + "\", \"x\": \"" + node.x + "\", \"y\": \"" + node.y + "\", \"name\": \"" + node.name + "\" }");
        comma = ",";
      }
      out += ' ], "edges": [';
      comma = "";
      _ref2 = this.edges;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        edge = _ref2[_j];
        out += comma + (" { \"a\": \"" + edge.nodea.id + "\", \"b\": \"" + edge.nodeb.id + "\", \"weight\": \"" + edge.weight + "\", \"direction\": \"" + edge.direction + "\" }");
        comma = ",";
      }
      out += "] }";
      return base64Encode(out);
    };
    Graph.prototype.clear_graph = function() {
      var edge, node, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      _ref = this.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        delete node;
      }
      _ref2 = this.edges;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        edge = _ref2[_j];
        delete edge;
      }
      this.nodes_id_map = {};
      _ref3 = [[], []], this.nodes = _ref3[0], this.edges = _ref3[1];
      this.nodecount = 0;
      this.edgecount = 0;
      this.edgewsum = 0;
      return this.paper.clear();
    };
    Graph.prototype.parse_string = function(str) {
      var edge, json, node, obj, _i, _j, _len, _len2, _ref, _ref2, _results;
      this.clear_graph();
      json = base64Decode(str);
      obj = $.parseJSON(json);
      _ref = obj.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        this.add_node(node.x, node.y, node.name, node.id);
      }
      _ref2 = obj.edges;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        edge = _ref2[_j];
        _results.push(this.connect(this.nodes_id_map[edge.a], this.nodes_id_map[edge.b], edge.weight, edge.direction));
      }
      return _results;
    };
    return Graph;
  })();
  this.Graph = Graph;
}).call(this);
