(function() {
  var Algorithm;
  Algorithm = (function() {
    Algorithm.prototype.root_node = null;
    Algorithm.prototype.goal_node = null;
    Algorithm.prototype.explored_nodes = [];
    Algorithm.prototype.traverse_info = [];
    Algorithm.prototype.name = "Algorithm";
    function Algorithm() {
      false;
    }
    Algorithm.prototype.destroy = function() {
      return delete this;
    };
    Algorithm.prototype.search = function() {
      throw "Search not implemented";
    };
    Algorithm.prototype.gen_info = function() {
      throw "General info not implemented";
    };
    Algorithm.prototype.run_info = function() {
      throw "Run info not implemented";
    };
    Algorithm.prototype.contains = function(a, obj) {
      var i;
      i = a.length;
      while (i--) {
        if (a[i] === obj) {
          return true;
        }
      }
      return false;
    };
    return Algorithm;
  })();
  this.Algorithm = Algorithm;
}).call(this);
