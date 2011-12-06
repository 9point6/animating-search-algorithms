(function() {
  var Heuristics;
  Heuristics = (function() {
    function Heuristics() {}
    Heuristics.prototype.choice = function(num_choice, node_from, node_to) {
      switch (num_choice) {
        case 0:
          return 0;
        case 1:
          return this.euclidean_distance(node_from, node_to);
      }
    };
    Heuristics.prototype.euclidean_distance = function(node_from, node_to) {
      var a, b, c;
      a = node_from.x - node_to.x;
      b = node_from.y - node_to.y;
      a = Math.pow(a, 2);
      b = Math.pow(b, 2);
      c = a + b;
      return Math.sqrt(c);
    };
    return Heuristics;
  })();
  this.Heuristics = Heuristics;
}).call(this);
