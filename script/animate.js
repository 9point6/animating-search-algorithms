var animate;
animate = (function() {
  function animate(raphael) {
    this.raphael = raphael;
    this.r = this.raphael;
  }
  animate.prototype.traverse = function(algorithm) {
    var connection, _i, _len, _ref, _results;
    _ref = algorithm.explored_connections;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      connection = _ref[_i];
      _results.push(connection.p);
    }
    return _results;
  };
  animate.prototype.node = function(node, colour, size) {
    return false;
  };
  animate.prototype.connection = function(connection, colour) {
    return false;
  };
  return animate;
})();