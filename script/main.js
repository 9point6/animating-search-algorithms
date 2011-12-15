(function() {
  var Main;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Main = (function() {
    function Main() {
      var alg, algo, i, _i, _len;
      this.design_mode = true;
      this.graph = new Graph();
      $('body').append('<div id="toolbar">\n    <h1>search<span>r</span></h1>\n    <ul id="designmode">\n        <li id="new" title="New Graph" />\n        <li id="save" title="Save Graph" />\n        <li id="load" title="Load Graph" />\n        <li id="add" title="Add a node" />\n        <li id="remove" title="Remove a node" />\n        <li id="connect" title="Connect two nodes" />\n        <li id="kamada" title="Run Kamada Kawai graph layout algorithm" />\n        <li class="settings" title="Settings Dialog" />\n        <li id="search" title="Switch to search mode" />\n    </ul>\n    <ul id="runmode">\n        <li id="setnodes" title="Set root and goal nodes" />\n        <li id="process" title="Process Graph" />\n        <li id="stepback" title="Step Back through animation" />\n        <li id="run" title="Run Animation" />\n        <li id="stop" title="Stop Animation" />\n        <li id="stepforward" title="Step Forward through animation" />\n        <li id="reset" title="Reset the animation" />\n        <li class="settings" title="Settings Dialog" />\n        <li id="design" title="Switch to design mode" />\n    </ul>\n    <div id="helptext" />\n</div>\n<div id="slidewrap">\n    <a id="slidetoggle">\n        <span>&#9679;</span>\n    </a>\n    <div id="slideout">\n        <h2 id="title">Algorithm</h2>\n        <ul id="list">\n            <li>\n                <h3>Algorithm:</h3>\n                <select id="algoselection" />\n            </li>\n            <li>\n                <h3>Completeness:</h3>\n                <p id="algodata_completeness">Blah</p>\n            </li>\n            <li>\n                <h3>Time Complexity:</h3>\n                <p id="algodata_time">Blah</p>\n            </li>\n            <li>\n                <h3>Space Complexity:</h3>\n                <p id="algodata_space">Blah</p>\n            </li>\n            <li>\n                <h3>Optimality:</h3>\n                <p id="algodata_optimality">Blah</p>\n            </li>\n        </ul>\n    </div>\n</div>\n<div id="algohelptext">Click for algorithm properties</div>\n<div id="copyright">\n    <a href="doc">Project Home</a>\n<div>');
      this.modal = new Modal({
        title: "Welcome to Searchr!",
        intro: "<p>\n    Welcome to Searchr, the best damn search algorithm animation\n    tool the world has ever seen*! We've designed it to be as\n    intuitive as possible, but here's a quick start guide so you\n    can get started as soon as possible.\n</p>\n<img src=\"img/welcome1.png\" alt=\"Toolbar Diagram\" />\n<p>\n    You can also manipulate node and edge properties by clicking\n    directly on them where a context sensitive menu will pop up.\n    Once you're in \"run mode\" the algorithm dialog will automatically\n    open; from here you can switch algorithms and view or edit their\n    properites\n</p>",
        okay: "Don't show this again!",
        cancel: "Okay, thanks!",
        callback: function(r) {
          return setCookie("welcome", "false");
        }
      });
      this.modal.div.css({
        width: 600,
        "margin-left": -300
      });
      if ("false" !== getCookie("welcome")) {
        this.modal.show();
      }
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
      this.setup_upload();
      $.getJSON('presets/index.json', {
        johnis: 'awesome'
      }, __bind(function(r) {
        var fdfdf, func, graph, i, _i, _len, _ref, _results;
        this.presets = r.graphs;
        i = 0;
        _ref = this.presets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          graph = _ref[_i];
          func = function(g) {
            return $.get("presets/" + g.url, {
              johnis: 'still_awesome'
            }, __bind(function(r) {
              return g.data = r;
            }, this));
          };
          func(graph);
          fdfdf = __bind(function() {
            return console.log(this.presets);
          }, this);
          _results.push(setTimeout(fdfdf, 250));
        }
        return _results;
      }, this));
      $('#slidetoggle').hover((function(e) {
        $('#algohelptext').css("display", "block");
        return $('#algohelptext').css("opacity", 100);
      }), function(e) {
        return $('#algohelptext').css("opacity", 0);
      });
      $('#algoselection').change(__bind(function(e) {
        var a, al, alg, combo, extras, func, goal, i, j, li, root, text, _i, _len;
        if (this.current_algo) {
          root = this.current_algo.root_node;
          goal = this.current_algo.goal_node;
          this.animate_obj.destroy();
          this.current_algo.destroy();
          this.current_algo = new ALGORITHMS[$('#algoselection').prop("value")]();
          this.current_algo.root_node = root;
          this.current_algo.goal_node = goal;
          this.animate_obj = new Animate;
          this.animate_obj.algorithm = this.current_algo;
        }
        alg = new ALGORITHMS[$('#algoselection').attr("value")];
        $('.algoextra').remove();
        $('#algodata_completeness').html(alg.gen_info()[0]);
        $('#algodata_time').html(alg.gen_info()[1]);
        $('#algodata_space').html(alg.gen_info()[2]);
        $('#algodata_optimality').html(alg.gen_info()[3]);
        if (alg.gen_info()[4] != null) {
          extras = $('#list');
          if (alg.gen_info()[4].indexOf('needsheuristic') !== -1) {
            extras.append(li = $("<li class=\"algoextra\" />"));
            li.append("<h3>Heuristic:</h3>");
            li.append(combo = $("<select id=\"algoheuristic\">"));
            combo.append("<option selected=\"selected\" value=\"0\">None</option>");
            combo.append("<option value=\"1\">Euclidian</option>");
            this.current_algo.heuristic_choice = 0;
            combo.change(__bind(function(e) {
              if (this.current_algo) {
                return this.current_algo.heuristic_choice = $(e.target).val();
              }
            }, this));
          }
          if (alg.gen_info()[4].indexOf('bidi') !== -1) {
            for (i = 1; i <= 2; i++) {
              extras.append(li = $("<li class=\"algoextra\" />"));
              li.append("<h3>Algorithm " + i + ":</h3>");
              li.append(combo = $("<select id=\"algobidi" + i + "\">"));
              j = 0;
              for (_i = 0, _len = ALGORITHMS.length; _i < _len; _i++) {
                al = ALGORITHMS[_i];
                a = new al();
                if (!(a instanceof BiDirectional)) {
                  combo.append("<option id=\"bd" + i + "-alg" + al.name + "\" value=\"" + (j++) + "\">" + a.name + "</option>");
                  func = __bind(function(combo, al, a, i) {
                    return combo.change(__bind(function(e) {
                      var combo1, combobox, func1, li1;
                      if (this.current_algo) {
                        combobox = $(e.target).attr("id").substr(8, 1);
                        this.current_algo.alg[combobox] = new ALGORITHMS[parseInt($(e.target).val())]();
                        this.current_algo.traverse_info = [];
                        if (a instanceof AStar) {
                          extras.append(li1 = $("<li class=\"algoextra\" />"));
                          li1.append("<h3>Heuristic " + i + "</h3>");
                          li1.append(combo1 = $('<select id=\"algoheuristic#{i}\" />'));
                          combo1.append("<option selected=\"selected\" value=\"0\">None</option>");
                          combo1.append("<option value=\"1\">Euclidian</option>");
                          this.current_algo.alg[combobox].heuristic_choice = 0;
                          func1 = __bind(function(combobox, combo1) {
                            return combo1.change(__bind(function(e) {
                              if (this.current_algo.alg[combobox]) {
                                return this.current_algo.alg[combobox].heuristic_choice = $(e.target).val();
                              }
                            }, this));
                          }, this);
                          return func1(combobox, combo1);
                        }
                      }
                    }, this));
                  }, this);
                  func(combo, al, a, i);
                }
                delete a;
              }
            }
          }
          if (alg.gen_info()[4].indexOf('needsdepth') !== -1) {
            extras.append(li = $("<li class=\"algoextra\" />"));
            li.append("<h3>Depth Limit</h3>");
            li.append(text = $("<input id=\"algodepth\" type=\"text\" value=\"3\" />"));
            this.current_algo.depth = 3;
            text.change(__bind(function(e) {
              if (this.current_algo) {
                return this.current_algo.depth = $(e.target).val();
              }
            }, this));
          }
          if (alg.gen_info()[4].indexOf('needsmaxdepth') !== -1) {
            extras.append(li = $("<li class=\"algoextra\" />"));
            li.append("<h3>Depth Limit</h3>");
            li.append(text = $("<input id=\"algomaxdepth\" type=\"text\" value=\"3\" />"));
            this.current_algo.max_depth = 3;
            text.change(__bind(function(e) {
              if (this.current_algo) {
                return this.current_algo.max_depth = $(e.target).val();
              }
            }, this));
          }
        }
        return delete alg;
      }, this));
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
      $('#kamada').click(__bind(function(e) {
        var func, i, kamada, lim, modal;
        i = 0;
        lim = 50 * this.graph.nodecount;
        modal = new Modal({
          title: "Please wait",
          intro: "Running Kamada Kawai <span id=\"kkprog\">" + i + "/" + lim + "</span>",
          okay: false
        });
        modal.show();
        $(".buttons", modal.div).css('text-align', 'left').append("<div id=\"kkprogbar\" />");
        $('#kkprogbar').css({
          width: 0
        });
        kamada = new KamadaKawai;
        kamada.prepare();
        func = __bind(function() {
          var dx, dxg, dxl, dy, dyg, dyl, e, j, mx, my, n, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _ref4;
          $('#kkprog').text("" + i + "/" + lim);
          $('#kkprogbar').css("width", i * 100 / lim + "%");
          for (j = 0; j <= 20; j++) {
            kamada.iterate();
          }
          i += j;
          if (i++ < lim) {
            return setTimeout(func, 5);
          } else {
            _ref = [Infinity, Infinity, 0, 0], dxl = _ref[0], dyl = _ref[1], dxg = _ref[2], dyg = _ref[3];
            _ref2 = this.graph.nodes;
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              n = _ref2[_i];
              dxl = Math.min(dxl, n.x);
              dyl = Math.min(dyl, n.y);
              dxg = Math.max(dxg, n.x);
              dyg = Math.max(dyg, n.y);
            }
            dx = dxl;
            dy = dyl;
            mx = (dxg - dxl) / 500;
            my = (dyg - dyl) / 500;
            _ref3 = this.graph.nodes;
            for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
              n = _ref3[_j];
              n.move(75 + (n.x - dx) / Math.max(mx, my), 75 + (n.y - dy) / Math.max(mx, my));
              _ref4 = n.edges;
              for (_k = 0, _len3 = _ref4.length; _k < _len3; _k++) {
                e = _ref4[_k];
                e.e.update_path();
              }
            }
            return modal.destroy();
          }
        }, this);
        return func();
      }, this));
      $('#search').click(__bind(function(e) {
        this.design_mode = false;
        this.current_algo = new ALGORITHMS[$('#algoselection').prop("value")]();
        if (this.current_algo instanceof AStar) {
          this.current_algo.heuristic_choice = $('#algoheuristic').val();
        }
        if (this.current_algo instanceof BiDirectional) {
          this.current_algo.alg[1] = new ALGORITHMS[parseInt($('#algobidi1').val())];
          this.current_algo.alg[2] = new ALGORITHMS[parseInt($('#algobidi2').val())];
          this.current_algo.traverse_info = [];
        }
        this.animate_obj = new Animate;
        this.animate_obj.algorithm = this.current_algo;
        $('#designmode').animate({
          opacity: 0
        }, {
          complete: function() {
            $(this).hide();
            return $('#runmode').show().animate({
              opacity: 100
            });
          }
        });
        return $('#slideout').animate({
          "margin-right": 0
        });
      }, this));
      $('#setnodes').click(__bind(function(e) {
        this.graph.remove_root_and_goal_nodes();
        this.fade_out_toolbar("Select root node", __bind(function() {
          if (this.current_algo.root_node != null) {
            this.current_algo.root_node.update_style("normal");
          }
          if (this.current_algo.goal_node != null) {
            this.current_algo.goal_node.update_style("normal");
          }
          this.graph.remove_root_and_goal_nodes();
          this.root_select_mode = false;
          this.goal_select_mode = false;
          this.fade_in_toolbar();
          this.current_algo.traverse_info = [];
          return this.animate_obj.reset();
        }, this));
        return this.root_select_mode = true;
      }, this));
      $('#process').click(__bind(function(e) {
        var modal;
        if ((this.current_algo.root_node != null) && (this.current_algo.goal_node != null)) {
          if (this.current_algo instanceof BiDirectional) {
            this.current_algo.pre_run();
          }
          this.current_algo.search();
          return this.current_algo.create_traverse_info();
        } else {
          modal = new Modal({
            title: "Root or goal nodes not selected",
            intro: "You need to set a goal and root node before running the algorithm."
          });
          return modal.show();
        }
      }, this));
      $('#stepback').click(__bind(function(e) {
        return this.animate_obj.step_backward();
      }, this));
      $('#run').click(__bind(function(e) {
        var modal;
        if (this.current_algo.traverse_info[0] != null) {
          return this.animate_obj.traverse();
        } else {
          modal = new Modal({
            title: "You have not run the algorithm",
            intro: "Press okay to run now and then animate",
            cancel: "Cancel",
            callback: __bind(function(r) {
              $('#process').click();
              if (this.current_algo.traverse_info[0] != null) {
                return $('#run').click();
              }
            }, this)
          });
          return modal.show();
        }
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
      $('.settings').click(__bind(function(e) {
        var modal;
        modal = new Modal({
          title: "Settings",
          fields: {
            'shownames': {
              type: 'radio',
              label: 'Show names',
              values: {
                "false": "No",
                "true": "Yes"
              },
              "default": "false"
            }
          },
          cancel: "Cancel",
          callback: __bind(function(r) {
            var node, _i, _j, _len, _len2, _ref, _ref2, _results, _results2;
            if (r.shownames === "true") {
              this.shownames = true;
              _ref = this.graph.nodes;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                node = _ref[_i];
                _results.push(node.showName(true));
              }
              return _results;
            } else {
              this.shownames = false;
              _ref2 = this.graph.nodes;
              _results2 = [];
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                node = _ref2[_j];
                _results2.push(node.showName(false));
              }
              return _results2;
            }
          }, this)
        });
        return modal.show();
      }, this));
      $('#design').click(__bind(function(e) {
        this.design_mode = true;
        this.graph.remove_root_and_goal_nodes();
        this.animate_obj.destroy();
        this.current_algo.destroy();
        $('#runmode').animate({
          opacity: 0
        }, {
          complete: function() {
            $(this).hide();
            return $('#designmode').show().animate({
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
    Main.prototype.setup_upload = function() {
      if (this.upload_obj) {
        delete this.upload_obj;
        $('#load a').remove();
      }
      return $('#load').click(__bind(function(e) {
        var context, func, g, presets, _i, _len, _ref;
        presets = {};
        _ref = this.presets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          g = _ref[_i];
          func = __bind(function(gr) {
            return presets[gr.name] = __bind(function() {
              return this.graph.parse_string(gr.data);
            }, this);
          }, this);
          func(g);
        }
        return context = new Context({
          x: e.pageX,
          y: e.pageY,
          items: {
            'Load from file...': __bind(function() {
              this.modal = new Modal({
                title: 'Upload a graph file',
                intro: '<a id="loadfile">click here to choose file</a>',
                okay: false,
                cancel: "Cancel"
              });
              this.modal.show();
              return $('#loadfile').upload({
                name: 'fileup',
                action: "io.php",
                params: {
                  action: "load"
                },
                onComplete: __bind(function(response) {
                  var data;
                  console.log("derp");
                  data = $.parseJSON(response);
                  this.graph.parse_string(data.data);
                  return this.modal.destroy();
                }, this),
                onSelect: function() {
                  console.log("herp");
                  return this.submit();
                }
              });
            }, this),
            'Presets': new Context({
              autoshow: false,
              items: presets
            })
          }
        });
      }, this));
    };
    Main.prototype.fade_out_toolbar = function(text, cancel_callback) {
      var tb;
      tb = this.design_mode ? $('#designmode') : $('#runmode');
      return tb.animate({
        opacity: 0
      }, {
        complete: function() {
          $(this).css({
            height: 1,
            "margin-top": -100
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
          var tb;
          $(this).html("");
          tb = APP.design_mode ? $('#designmode') : $('#runmode');
          return tb.css({
            height: '',
            "margin-top": ''
          }).animate({
            opacity: 100
          });
        }
      });
    };
    Main.prototype.change_help_text = function(text) {
      return $('#helptext').text(text);
    };
    return Main;
  })();
  this.Main = Main;
}).call(this);
