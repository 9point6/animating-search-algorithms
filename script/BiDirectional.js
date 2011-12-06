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
      return this._search(this.alg1, this.alg2);
    };
    BiDirectional.prototype._search = function(algorithm1, algorithm2) {
      var i, j, traverse_goal, traverse_info_goal, traverse_info_start, traverse_start, _i, _j, _len, _len2, _ref, _ref2, _results;
      this.alg1 = algorithm1;
      this.alg2 = algorithm2;
      traverse_info_start = algorithm1.traverse_info;
      traverse_info_goal = algorithm2.traverse_info;
      _ref = traverse_info_start.length;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _ref2 = traverse_info_goal.length;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          j = _ref2[_j];
          traverse_start = traverse_info_start[i];
          traverse_goal = traverse_info_goal[j];
          if (traverse_start !== traverse_goal) {
            traverse_info.push(traverse_start);
            traverse_info.push(traverse_goal);
          } else {
            traverse_info.push(traverse_start);
            return;
          }
        }
      }
      return _results;
    };
    BiDirectional.prototype.gen_info = function() {
      this.alg1.gen_info();
      return this.alg2.gen_info();
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
