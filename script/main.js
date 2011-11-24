(function() {
  var Main;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Main = (function() {
    function Main() {
      var alg, algo, i, _i, _len;
      this.design_mode = true;
      this.graph = new Graph();
      $('body').append('<div id="toolbar">\n    <h1>search<span>r</span></h1>\n    <ul id="designmode">\n        <li id="new" title="New Graph" />\n        <li id="save" title="Save Graph" />\n        <li id="load" title="Load Graph" />\n        <li id="add" title="Add a node" />\n        <li id="remove" title="Remove a node" />\n        <li id="connect" title="Connect two nodes" />\n        <li id="search" title="Switch to search mode" />\n    </ul>\n    <ul id="runmode">\n        <li id="process" title="Process Graph" />\n        <li id="run" title="Run Animation" />\n        <li id="design" title="Switch to design mode" />\n    </ul>\n    <div id="helptext" />\n</div>\n<div id="slidewrap">\n    <a id="slidetoggle"><span>&#9679;</span></a>\n    <div id="slideout">\n        <h2 id="title">Algorithm</h2>\n        <ul id="list">\n            <li>\n                <h3>Algorithm:</h3>\n                <select id="algoselection" />\n            </li>\n            <li>\n                <h3>Completeness:</h3>\n                <p id="algodata_completeness">Blah</p>\n            </li>\n            <li>\n                <h3>Time Complexity:</h3>\n                <p id="algodata_time">Blah</p>\n            </li>\n            <li>\n                <h3>Space Complexity:</h3>\n                <p id="algodata_space">Blah</p>\n            </li>\n            <li>\n                <h3>Optimality:</h3>\n                <p id="algodata_optimality">Blah</p>\n            </li>\n        </ul>\n    </div>\n</div>\n<div id="copyright">\n    <a href="doc">Project Home</a>\n<div>');
      $('#helptext').css({
        opacity: 0
      });
      $('#runmode').css({
        opacity: 0,
        display: "none"
      });
      $('#slideout').css({
        "margin-right": -300
      });
      $('#algoselection').change(function(e) {
        var alg;
        alg = new ALGORITHMS[$(this).attr("value")];
        $('#algodata_completeness').html(alg.gen_info()[0]);
        $('#algodata_time').html(alg.gen_info()[1]);
        $('#algodata_space').html(alg.gen_info()[2]);
        $('#algodata_optimality').html(alg.gen_info()[3]);
        return delete alg;
      });
      $('#new').click(__bind(function(e) {
        return this.graph.clear_graph();
      }, this));
      $('#save').click(__bind(function(e) {
        return prompt("Copy this string to save the graph", this.graph.serialise_graph());
      }, this));
      $('#load').click(__bind(function(e) {
        return this.graph.parse_string(prompt("Paste a saved graph string here"));
      }, this));
      $('#add').click(__bind(function(e) {
        var pnt;
        pnt = this.graph.add_point(1, 1, prompt("What will this point be named?"));
        return pnt.move_with_mouse();
      }, this));
      $('#remove').click(__bind(function(e) {
        return this.graph.do_mouse_removal();
      }, this));
      $('#connect').click(__bind(function(e) {
        return this.graph.do_mouse_connection();
      }, this));
      $('#search').click(__bind(function(e) {
        this.design_mode = false;
        this.current_algo = new ALGORITHMS[$('#algoselection').prop("value")];
        this.animate_obj = new Animate;
        this.animate_obj.algorithm = this.current_algo;
        return $('#designmode').animate({
          opacity: 0
        }, {
          complete: function() {
            $(this).css({
              display: 'none'
            });
            return $('#runmode').css('display', 'block').animate({
              opacity: 100
            });
          }
        });
      }, this));
      $('#process').click(__bind(function(e) {
        var point, _i, _len, _ref;
        _ref = this.graph.points;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          point = _ref[_i];
          if (point.name === "Dave") {
            this.current_algo.root_node = point;
          }
          if (point.name === "Elle") {
            this.current_algo.goal_node = point;
          }
        }
        this.current_algo.search();
        return this.current_algo.create_traverse_info();
      }, this));
      $('#run').click(__bind(function(e) {
        return this.animate_obj.step_forward();
      }, this));
      $('#design').click(__bind(function(e) {
        this.design_mode = true;
        this.animate_obj.destroy();
        this.current_algo.destroy();
        return $('#runmode').animate({
          opacity: 0
        }, {
          complete: function() {
            $(this).css({
              display: 'none'
            });
            return $('#designmode').css('display', 'block').animate({
              opacity: 100
            });
          }
        });
      }, this));
      $('#slidetoggle').click(__bind(function(e) {
        if ($('#slideout').css("margin-right") === "-300px") {
          return $('#slideout').animate({
            "margin-right": 0
          });
        } else {
          return $('#slideout').animate({
            "margin-right": -300
          });
        }
      }, this));
      i = 0;
      for (_i = 0, _len = ALGORITHMS.length; _i < _len; _i++) {
        algo = ALGORITHMS[_i];
        alg = new algo();
        $('#algoselection').append("<option id=\"alg" + algo.name + "\" value=\"" + (i++) + "\">" + alg.name + "</option>");
        delete alg;
      }
      $('#algDFS').attr("selected", "selected");
      $('#algoselection').change();
      this.graph.add_point(224, 118, "Alan");
      this.graph.add_point(208, 356, "Beth");
      this.graph.add_point(259, 204, "Carl");
      this.graph.add_point(363, 283, "Dave");
      this.graph.add_point(110, 85, "Elle");
      this.graph.connect(this.graph.points[2], this.graph.points[1]);
      this.graph.connect(this.graph.points[2], this.graph.points[3]);
      this.graph.connect(this.graph.points[0], this.graph.points[2]);
      this.graph.connect(this.graph.points[4], this.graph.points[0]);
      this.graph.connect(this.graph.points[3], this.graph.points[1]);
      this.graph.sort_elements();
    }
    Main.prototype.fade_out_toolbar = function(text) {
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
    Main.prototype.fade_in_toolbar = function() {
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
    return Main;
  })();
  this.Main = Main;
}).call(this);
