(function() {
  var Context;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Context = (function() {
    Context.prototype.defaults = {
      x: 0,
      y: 0,
      autoshow: true
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
          if (v instanceof Context) {
            item.hover((__bind(function(e) {
              v.ul.css({
                left: e.pageX,
                top: e.pageY
              });
              v.killthis = this;
              return v.show();
            }, this)), function(e) {});
          } else {
            item.click(v);
            item.click(__bind(function(e) {
              return this.destroy();
            }, this));
          }
          this.ul.append(item);
        }
      } else {
        throw "No menu items!";
      }
      this.div.click(__bind(function(e) {
        return this.destroy();
      }, this));
      this.ul.css({
        left: this.options.x,
        top: this.options.y,
        opacity: 0
      });
      if (this.options.autoshow) {
        this.show();
      }
    }
    Context.prototype.show = function(root) {
      if (root == null) {
        root = null;
      }
      $('body').append(this.div);
      if (root != null) {
        this.ul.css({
          left: $(root).position().left,
          top: $(root).position().top
        });
      }
      return this.ul.animate({
        opacity: 1
      }, 250);
    };
    Context.prototype.hide = function() {
      return this.ul.animate({
        opacity: 0
      }, 250, 'linear', __bind(function() {
        return this.div.hide();
      }, this));
    };
    Context.prototype.destroy = function() {
      return this.ul.animate({
        opacity: 0
      }, 250, 'linear', __bind(function() {
        this.div.remove();
        if (this.killthis) {
          this.killthis.destroy();
        }
        return delete this;
      }, this));
    };
    return Context;
  })();
  this.Context = Context;
}).call(this);
