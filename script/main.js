(function() {
  var Main;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Main = (function() {
    function Main() {
      var alg, algo, i, _i, _len;
      this.design_mode = true;
      this.graph = new Graph();
      $('body').append('<div id="toolbar">\n    <h1>search<span>r</span></h1>\n    <ul id="designmode">\n        <li id="new" title="New Graph" />\n        <li id="save" title="Save Graph" />\n        <li id="load" title="Load Graph" />\n        <li id="add" title="Add a node" />\n        <li id="remove" title="Remove a node" />\n        <li id="connect" title="Connect two nodes" />\n        <li id="search" title="Switch to search mode" />\n    </ul>\n    <ul id="runmode">\n        <li id="setnodes" title="Set root and goal nodes" />\n        <li id="process" title="Process Graph" />\n        <li id="stepback" title="Step Back through animation" />\n        <li id="run" title="Run Animation" />\n        <li id="stop" title="Stop Animation" />\n        <li id="stepforward" title="Step Forward through animation" />\n        <li id="reset" title="Reset the animation" />\n        <li id="settings" title="Settings Dialog" />\n        <li id="design" title="Switch to design mode" />\n    </ul>\n    <div id="helptext" />\n</div>\n<div id="slidewrap">\n    <a id="slidetoggle">\n        <span>&#9679;</span>\n    </a>\n    <div id="slideout">\n        <h2 id="title">Algorithm</h2>\n        <ul id="list">\n            <li>\n                <h3>Algorithm:</h3>\n                <select id="algoselection" />\n            </li>\n            <li>\n                <h3>Completeness:</h3>\n                <p id="algodata_completeness">Blah</p>\n            </li>\n            <li>\n                <h3>Time Complexity:</h3>\n                <p id="algodata_time">Blah</p>\n            </li>\n            <li>\n                <h3>Space Complexity:</h3>\n                <p id="algodata_space">Blah</p>\n            </li>\n            <li>\n                <h3>Optimality:</h3>\n                <p id="algodata_optimality">Blah</p>\n            </li>\n        </ul>\n    </div>\n</div>\n<div id="algohelptext">Click for algorithm properties</div>\n<div id="copyright">\n    <a href="doc">Project Home</a>\n<div>');
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
      this.upload_obj = $('<a />').css({
        width: "32px",
        height: "32px",
        display: "block"
      }).appendTo('#load').upload({
        name: 'fileup',
        action: "io.php",
        params: {
          action: "load"
        },
        onComplete: __bind(function(response) {
          var data;
          data = $.parseJSON(response);
          return this.graph.parse_string(data.data);
        }, this),
        onSelect: function() {
          return this.submit();
        }
      });
      $('#slidetoggle').hover((function(e) {
        $('#algohelptext').css("display", "block");
        return $('#algohelptext').css("opacity", 100);
      }), function(e) {
        return $('#algohelptext').css("opacity", 0);
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
        $('<iframe name="download" id="download" />').appendTo('body').hide();
        $("<form method=\"POST\" action=\"io.php\" target=\"download\">\n    <input name=\"action\" value=\"save\" />\n    <input name=\"content\" value=\"" + (this.graph.serialise_graph()) + "\" />\n    <input id=\"dlsubmit\" type=\"submit\" />\n</form>").appendTo('body').hide();
        return $('#dlsubmit').click();
      }, this));
      $('#add').click(__bind(function(e) {
        var modal;
        modal = new Modal({
          title: "New Node",
          fields: {
            "name": {
              type: "text",
              label: "Node name"
            }
          },
          cancel: "Cancel",
          callback: __bind(function(r) {
            var node;
            node = this.graph.add_node(1, 1, r.name);
            return node.move_with_mouse();
          }, this)
        });
        return modal.show();
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
        $('#designmode').animate({
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
        return $('#slideout').animate({
          "margin-right": 0
        });
      }, this));
      $('#setnodes').click(__bind(function(e) {
        return alert("not yet implemented");
      }, this));
      $('#process').click(__bind(function(e) {
        var node, _i, _len, _ref;
        _ref = this.graph.nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          if (node.name === "Dave") {
            this.current_algo.root_node = node;
          }
          if (node.name === "Elle") {
            this.current_algo.goal_node = node;
          }
        }
        this.current_algo.search();
        return this.current_algo.create_traverse_info();
      }, this));
      $('#stepback').click(__bind(function(e) {
        return this.animate_obj.step_backward();
      }, this));
      $('#run').click(__bind(function(e) {
        return this.animate_obj.traverse();
      }, this));
      $('#stop').click(__bind(function(e) {
        return this.animate_obj.stop();
      }, this));
      $('#stepforward').click(__bind(function(e) {
        return this.animate_obj.step_forward();
      }, this));
      $('#reset').click(__bind(function(e) {
        return this.animate_obj.reset();
      }, this));
      $('#settings').click(__bind(function(e) {
        return alert("not yet implemented");
      }, this));
      $('#design').click(__bind(function(e) {
        this.design_mode = true;
        this.animate_obj.destroy();
        this.current_algo.destroy();
        $('#runmode').animate({
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
        return $('#slideout').animate({
          "margin-right": -300
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
      this.graph.add_node(224, 118, "Alan");
      this.graph.add_node(208, 356, "Beth");
      this.graph.add_node(259, 204, "Carl");
      this.graph.add_node(363, 283, "Dave");
      this.graph.add_node(110, 85, "Elle");
      this.graph.connect(this.graph.nodes[2], this.graph.nodes[1], 3, -1);
      this.graph.connect(this.graph.nodes[2], this.graph.nodes[3], 2, 1);
      this.graph.connect(this.graph.nodes[0], this.graph.nodes[2], 8, 0);
      this.graph.connect(this.graph.nodes[4], this.graph.nodes[0], 4, 0);
      this.graph.connect(this.graph.nodes[3], this.graph.nodes[1], 2, 1);
      this.graph.sort_elements();
    }
    Main.prototype.fade_out_toolbar = function(text, cancel_callback) {
      return $('#designmode').animate({
        opacity: 0
      }, {
        complete: function() {
          $(this).css({
            height: 1
          });
          $('#helptext').text(text).append('<ul>\n    <li id="cancel" title="Cancel operation" />\n</ul>').animate({
            opacity: 100
          });
          return $('#cancel').click(__bind(function(e) {
            return cancel_callback();
          }, this));
        }
      });
    };
    Main.prototype.fade_in_toolbar = function() {
      return $('#helptext').animate({
        opacity: 0
      }, {
        complete: function() {
          $(this).html("");
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
