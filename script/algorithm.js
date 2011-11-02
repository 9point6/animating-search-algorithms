var algorithm;
algorithm = (function() {
  algorithm.prototype.root_node = null;
  algorithm.prototype.goal_node = null;
  algorithm.prototype.explored_nodes = [];
  algorithm.prototype.traverse_info = [];
  function algorithm() {
    false;
  }
  algorithm.prototype.search = function() {
    throw "Search not implemented";
  };
  algorithm.prototype.gen_info = function() {
    throw "General info not implemented";
  };
  algorithm.prototype.run_info = function() {
    throw "Run info not implemented";
  };
  return algorithm;
})();