(function() {
  var Context;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Context = (function() {
    Context.prototype.defaults = {
      x: 0,
      y: 0,
      autoshow: true,
      zindex: 1000
    };
    function Context(params) {
      var item, k, v, _ref, _ref2;
      this.options = {};
      $.extend(this.options, this.defaults);
      $.extend(this.options, params);
      _ref = this.bounds(this.options.x, this.options.y), this.options.x = _ref[0], this.options.y = _ref[1];
      this.div = $('<div class="context" />');
      this.ul = $('<ul />');
      this.div.append(this.ul);
      if (this.options.items) {
        _ref2 = this.options.items;
        for (k in _ref2) {
          v = _ref2[k];
          item = $("<li>" + k + "</li>");
          if (v instanceof Context) {
            item.append("<span class=\"submarker\">&gt;</span>");
            item.hover((__bind(function(e) {
              var func;
              v.ul.css({
                left: e.pageX,
                top: e.pageY
              });
              v.killthis = this;
              func = __bind(function() {
                return v.show();
              }, this);
              return setTimeout(func, 100);
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
        this.hide();
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
    Context.prototype.bounds = function(x, y, gutter) {
      if (gutter == null) {
        gutter = 75;
      }
      if (x > $(window).width() - gutter) {
        x = $(window).width() - gutter;
      }
      if (y > $(window).height() - gutter) {
        y = $(window).height() - gutter;
      }
      return [x, y];
    };
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
      $(this.div.node).css({
        "z-index": this.options.zindex++
      });
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
    Context.prototype.destroy = function(killparent) {
      if (killparent == null) {
        killparent = true;
      }
      return this.ul.animate({
        opacity: 0
      }, 250, 'linear', __bind(function() {
        this.div.remove();
        if (this.killthis && killparent) {
          this.killthis.destroy();
        }
        return delete this;
      }, this));
    };
    return Context;
  })();
  this.Context = Context;
}).call(this);
