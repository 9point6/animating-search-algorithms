(function() {
  var BiDirectional;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BiDirectional = (function() {
    __extends(BiDirectional, Algorithm);
    function BiDirectional() {
      BiDirectional.__super__.constructor.apply(this, arguments);
    }
    BiDirectional.prototype.name = "Bi-Directional Search";
    BiDirectional.prototype.pre_run = function() {
      console.log(this.alg1);
      console.log(this.alg2);
      this.alg1.root_node = this.root_node;
      this.alg1.goal_node = this.goal_node;
      this.alg2.root_node = this.goal_node;
      this.alg2.goal_node = this.root_node;
      this.alg1.search();
      return this.alg2.search();
    };
    BiDirectional.prototype.destroy = function() {
      var node, _i, _len, _ref;
      _ref = this.explored_nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        delete node.explored;
      }
      return BiDirectional.__super__.destroy.apply(this, arguments);
    };
    BiDirectional.prototype.search = function() {
      var item, item2, pointer, pointer2, traverse_info_goal, traverse_info_start, _i, _j, _len, _len2, _ref, _results;
      this.alg1.create_traverse_info();
      this.alg2.create_traverse_info();
      traverse_info_start = this.alg1.traverse_info.slice(0);
      traverse_info_goal = this.alg2.traverse_info.slice(0);
      pointer = 0;
      _results = [];
      for (_i = 0, _len = traverse_info_start.length; _i < _len; _i++) {
        item = traverse_info_start[_i];
        this.traverse_info.push(item);
        _ref = this.alg2.traverse_info;
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          item2 = _ref[_j];
          pointer2 = 0;
          if (item.id === item2.id) {
            this.traverse_info.push(traverse_info_start);
            return;
          }
          pointer2++;
          if (pointer2 = pointer) {
            break;
          }
        }
        this.traverse_info.push(traverse_info_goal.shift());
        _results.push(pointer++);
      }
      return _results;
    };
    BiDirectional.prototype.gen_info = function() {
      return ["Complete", "O(b<sup>m</sup>)", "O(bm)", "Not Optimal", "bidi"];
    };
    BiDirectional.prototype.run_info = function() {
      return alert("stuff");
    };
    BiDirectional.prototype.create_traverse_info = function() {
      return false;
    };
    return BiDirectional;
  })();
  this.BiDirectional = BiDirectional;
}).call(this);
