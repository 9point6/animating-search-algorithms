var app;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
app = (function() {
  function app() {
    this.graph = new graph();
    $('body').append('<div id="toolbar">\n    <h1>search<span>r</span></h1>\n    <ul id="designmode">\n        <li id="new" title="New Graph" />\n        <li id="save" title="Save Graph" />\n        <li id="load" title="Load Graph" />\n        <li id="add" title="Add a node" />\n        <li id="remove" title="Remove a node" />\n        <li id="connect" title="Connect two nodes" />\n        <li id="search" title="Switch to search mode" />\n    </ul>\n    <ul id="runmode">\n        <li id="process" title="Process Graph" />\n        <li id="run" title="Run Animation" />\n        <li id="design" title="Switch to design mode" />\n    </ul>\n    <div id="helptext" />\n</div>\n<div id="copyright">\n    <a href="doc">Project Home</a>\n<div>');
    $('#helptext').css({
      opacity: 0
    });
    $('#runmode').css({
      opacity: 0,
      display: "none"
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
      this.current_algo = new algorithms[1];
      this.animate_obj = new animate;
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
      this.current_algo.root_node = this.graph.points[2];
      this.current_algo.goal_node = this.graph.points[3];
      this.current_algo.search();
      this.current_algo.create_traverse_info();
      console.log(this.current_algo.traverse_info);
      console.log(this.current_algo.explored_nodes);
      return this.animate_obj.step_forward();
    }, this));
    $('#run').click(__bind(function(e) {
      return alert("Function not added yet!");
    }, this));
    $('#design').click(__bind(function(e) {
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
  return app;
})();