(function() {
  var Modal;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Modal = (function() {
    Modal.prototype.defaults = {
      title: false,
      intro: false,
      fields: false,
      okay: "Okay",
      cancel: false,
      animations: {
        background: {
          "in": function(elem) {
            return $(elem).animate({
              opacity: 100
            });
          },
          out: function(elem) {
            return $(elem).animate({
              opacity: 0
            }, 250, "linear", __bind(function() {
              return $(elem).hide();
            }, this));
          },
          "default": function(elem) {
            return $(elem).css({
              opacity: 0
            });
          }
        },
        dialog: {
          "in": function(elem) {
            return $(elem).animate({
              "margin-top": 0
            });
          },
          out: function(elem) {
            return $(elem).animate({
              "margin-top": -1000
            });
          },
          "default": function(elem) {
            return $(elem).css({
              "margin-top": -1000
            });
          }
        }
      }
    };
    function Modal(params) {
      var buttons, cancel, fdiv, field, first, fr, input, k, label, llabel, selector, submit, submit_h, submit_hk, v, _ref, _ref2, _ref3;
      this.options = {};
      $.extend(this.options, this.defaults);
      $.extend(this.options, params);
      this.wrap = $('<div />').addClass("modal");
      this.div = $('<div />').appendTo(this.wrap);
      if (this.options.title) {
        this.div.append("<h2>" + this.options.title + "</h2>");
      }
      if (this.options.intro) {
        this.div.append("<div class=\"intro\">" + this.options.intro + "</div>");
      }
      submit_h = __bind(function(e) {
        this.options.animations.background.out(this.wrap);
        this.options.animations.dialog.out(this.div);
        if (this.options.callback) {
          this.options.callback(this["return"]());
          return this.destroy();
        }
      }, this);
      submit_hk = __bind(function(e) {
        if (event.which === 13) {
          return submit_h(e);
        }
      }, this);
      if (this.options.fields) {
        fdiv = $("<div class=\"fields\" />");
        this.div.append(fdiv);
        _ref = this.options.fields;
        for (fr in _ref) {
          field = _ref[fr];
          if ((_ref2 = field["default"]) == null) {
            field["default"] = "";
          }
          label = $("<label />");
          fdiv.append(label);
          label.append("<span>" + field.label + ":</span>");
          if (field.type === "radio") {
            first = true;
            _ref3 = field.values;
            for (k in _ref3) {
              v = _ref3[k];
              llabel = $('<label />');
              label.append(llabel);
              input = $("<input type=\"radio\" id=\"modf-" + fr + "\" name=\"modf-" + fr + "\" class=\"modal_fields\"\n    value=\"" + k + "\" " + (first ? 'checked="checked"' : "") + "/>");
              llabel.append(input);
              llabel.append("<span>" + v + "</span>");
              input.keypress(submit_hk);
              first = false;
            }
            if (field["default"]) {
              selector = "input.modal_fields[name=\"modf-" + fr + "\"][value=\"" + field["default"] + "\"]";
              $(selector, label).attr("checked", "checked");
            }
          } else {
            input = $("<input />").addClass("modal_fields");
            input.attr({
              type: field.type,
              id: "modf-" + fr,
              value: field["default"]
            });
            input.keypress(submit_hk);
            label.append(input);
          }
          fdiv.append("<br class=\"clear\" />");
        }
      }
      buttons = $("<div class=\"buttons\" />");
      this.div.append(buttons);
      if (this.options.okay) {
        submit = $("<button type=\"button\">" + this.options.okay + "</button>");
        buttons.append(submit);
        submit.click(submit_h);
        submit.keypress(submit_hk);
      }
      if (this.options.cancel) {
        cancel = $("<button type=\"button\">" + this.options.cancel + "</button>");
        buttons.append(cancel);
        cancel.click(__bind(function(e) {
          this.options.animations.background.out(this.wrap);
          return this.options.animations.dialog.out(this.div);
        }, this));
      }
      this.options.animations.background["default"](this.wrap);
      this.options.animations.dialog["default"](this.div);
      $('body').append(this.wrap);
    }
    Modal.prototype.show = function() {
      this.options.animations.background["in"](this.wrap);
      this.options.animations.dialog["in"](this.div);
      if (this.options.fields) {
        return $('input.modal_fields')[0].focus();
      }
    };
    Modal.prototype.destroy = function() {
      var func;
      this.options.animations.background.out(this.wrap);
      this.options.animations.dialog.out(this.div);
      func = __bind(function() {
        this.div.remove();
        this.wrap.remove();
        return delete this;
      }, this);
      return setTimeout(func, 250);
    };
    Modal.prototype["return"] = function() {
      var elem, key, ret, _i, _j, _len, _len2, _ref, _ref2;
      ret = {};
      _ref = $("input.modal_fields:not([type=\"radio\"])", this.div);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem = $(elem);
        key = elem.attr("id").substring(5);
        ret[key] = elem.val();
      }
      _ref2 = $("input.modal_fields:checked", this.div);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        elem = _ref2[_j];
        elem = $(elem);
        key = elem.attr("id").substring(5);
        ret[key] = elem.val();
      }
      return ret;
    };
    return Modal;
  })();
  this.Modal = Modal;
}).call(this);
