(function() {
  var Context;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Context = (function() {
    Context.prototype.defaults = {
      x: 0,
      y: 0
    };
    function Context(params) {
      var item, k, v, _ref;
      this.options = {};
      $.extend(this.options, this.defaults);
      $.extend(this.options, params);
      this.div = $('<div class="context" />');
      this.ul = $('<ul />');
      this.div.append(this.ul);
      if (this.options.items) {
        _ref = this.options.items;
        for (k in _ref) {
          v = _ref[k];
          item = $("<li>" + k + "</li>");
          item.click(v);
          item.click(__bind(function(e) {
            return this.destroy();
          }, this));
          this.ul.append(item);
        }
      } else {
        throw "No menu items!";
      }
      $('body').append(this.div);
      this.ul.css({
        left: this.options.x,
        top: this.options.y,
        opacity: 0
      });
      this.ul.animate({
        opacity: 1
      }, 250);
      this.div.click(__bind(function(e) {
        return this.destroy();
      }, this));
    }
    Context.prototype.destroy = function() {
      return this.ul.animate({
        opacity: 0
      }, 250, 'linear', __bind(function() {
        this.div.remove();
        return delete this;
      }, this));
    };
    return Context;
  })();
  this.Context = Context;
}).call(this);
