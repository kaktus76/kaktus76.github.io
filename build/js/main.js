/* Sticky-kit v1.1.2 */
(function() {
  var $, win;

  $ = this.jQuery || window.jQuery;

  win = $(window);

  $.fn.stick_in_parent = function(opts) {
    var doc, elm, enable_bottoming, fn, i, inner_scrolling, len, manual_spacer, offset_top, parent_selector, recalc_every, sticky_class;
    if (opts == null) {
      opts = {};
    }
    sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, recalc_every = opts.recalc_every, parent_selector = opts.parent, offset_top = opts.offset_top, manual_spacer = opts.spacer, enable_bottoming = opts.bottoming;
    if (offset_top == null) {
      offset_top = 0;
    }
    if (parent_selector == null) {
      parent_selector = void 0;
    }
    if (inner_scrolling == null) {
      inner_scrolling = true;
    }
    if (sticky_class == null) {
      sticky_class = "is_stuck";
    }
    doc = $(document);
    if (enable_bottoming == null) {
      enable_bottoming = true;
    }
    fn = function(elm, padding_bottom, parent_top, parent_height, top, height, el_float, detached) {
      var bottomed, detach, fixed, last_pos, last_scroll_height, offset, parent, recalc, recalc_and_tick, recalc_counter, spacer, tick;
      if (elm.data("sticky_kit")) {
        return;
      }
      elm.data("sticky_kit", true);
      last_scroll_height = doc.height();
      parent = elm.parent();
      if (parent_selector != null) {
        parent = parent.closest(parent_selector);
      }
      if (!parent.length) {
        throw "failed to find stick parent";
      }
      fixed = false;
      bottomed = false;
      spacer = manual_spacer != null ? manual_spacer && elm.closest(manual_spacer) : $("<div />");
      if (spacer) {
        spacer.css('position', elm.css('position'));
      }
      recalc = function() {
        var border_top, padding_top, restore;
        if (detached) {
          return;
        }
        last_scroll_height = doc.height();
        border_top = parseInt(parent.css("border-top-width"), 10);
        padding_top = parseInt(parent.css("padding-top"), 10);
        padding_bottom = parseInt(parent.css("padding-bottom"), 10);
        parent_top = parent.offset().top + border_top + padding_top;
        parent_height = parent.height();
        if (fixed) {
          fixed = false;
          bottomed = false;
          if (manual_spacer == null) {
            elm.insertAfter(spacer);
            spacer.detach();
          }
          elm.css({
            position: "",
            top: "",
            width: "",
            bottom: ""
          }).removeClass(sticky_class);
          restore = true;
        }
        top = elm.offset().top - (parseInt(elm.css("margin-top"), 10) || 0) - offset_top;
        height = elm.outerHeight(true);
        el_float = elm.css("float");
        if (spacer) {
          spacer.css({
            width: elm.outerWidth(true),
            height: height,
            display: elm.css("display"),
            "vertical-align": elm.css("vertical-align"),
            "float": el_float
          });
        }
        if (restore) {
          return tick();
        }
      };
      recalc();
      if (height === parent_height) {
        return;
      }
      last_pos = void 0;
      offset = offset_top;
      recalc_counter = recalc_every;
      tick = function() {
        var css, delta, recalced, scroll, will_bottom, win_height;
        if (detached) {
          return;
        }
        recalced = false;
        if (recalc_counter != null) {
          recalc_counter -= 1;
          if (recalc_counter <= 0) {
            recalc_counter = recalc_every;
            recalc();
            recalced = true;
          }
        }
        if (!recalced && doc.height() !== last_scroll_height) {
          recalc();
          recalced = true;
        }
        scroll = win.scrollTop();
        if (last_pos != null) {
          delta = scroll - last_pos;
        }
        last_pos = scroll;
        if (fixed) {
          if (enable_bottoming) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
            if (bottomed && !will_bottom) {
              bottomed = false;
              elm.css({
                position: "fixed",
                bottom: "",
                top: offset
              }).trigger("sticky_kit:unbottom");
            }
          }
          if (scroll < top) {
            fixed = false;
            offset = offset_top;
            if (manual_spacer == null) {
              if (el_float === "left" || el_float === "right") {
                elm.insertAfter(spacer);
              }
              spacer.detach();
            }
            css = {
              position: "",
              width: "",
              top: ""
            };
            elm.css(css).removeClass(sticky_class).trigger("sticky_kit:unstick");
          }
          if (inner_scrolling) {
            win_height = win.height();
            if (height + offset_top > win_height) {
              if (!bottomed) {
                offset -= delta;
                offset = Math.max(win_height - height, offset);
                offset = Math.min(offset_top, offset);
                if (fixed) {
                  elm.css({
                    top: offset + "px"
                  });
                }
              }
            }
          }
        } else {
          if (scroll > top) {
            fixed = true;
            css = {
              position: "fixed",
              top: offset
            };
            css.width = elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px";
            elm.css(css).addClass(sticky_class);
            if (manual_spacer == null) {
              elm.after(spacer);
              if (el_float === "left" || el_float === "right") {
                spacer.append(elm);
              }
            }
            elm.trigger("sticky_kit:stick");
          }
        }
        if (fixed && enable_bottoming) {
          if (will_bottom == null) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
          }
          if (!bottomed && will_bottom) {
            bottomed = true;
            if (parent.css("position") === "static") {
              parent.css({
                position: "relative"
              });
            }
            return elm.css({
              position: "absolute",
              bottom: padding_bottom,
              top: "auto"
            }).trigger("sticky_kit:bottom");
          }
        }
      };
      recalc_and_tick = function() {
        recalc();
        return tick();
      };
      detach = function() {
        detached = true;
        win.off("touchmove", tick);
        win.off("scroll", tick);
        win.off("resize", recalc_and_tick);
        $(document.body).off("sticky_kit:recalc", recalc_and_tick);
        elm.off("sticky_kit:detach", detach);
        elm.removeData("sticky_kit");
        elm.css({
          position: "",
          bottom: "",
          top: "",
          width: ""
        });
        parent.position("position", "");
        if (fixed) {
          if (manual_spacer == null) {
            if (el_float === "left" || el_float === "right") {
              elm.insertAfter(spacer);
            }
            spacer.remove();
          }
          return elm.removeClass(sticky_class);
        }
      };
      win.on("touchmove", tick);
      win.on("scroll", tick);
      win.on("resize", recalc_and_tick);
      $(document.body).on("sticky_kit:recalc", recalc_and_tick);
      elm.on("sticky_kit:detach", detach);
      return setTimeout(tick, 0);
    };
    for (i = 0, len = this.length; i < len; i++) {
      elm = this[i];
      fn($(elm));
    }
    return this;
  };

}).call(this);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFN0aWNreS1raXQgdjEuMS4yICovXHJcbihmdW5jdGlvbigpIHtcclxuICB2YXIgJCwgd2luO1xyXG5cclxuICAkID0gdGhpcy5qUXVlcnkgfHwgd2luZG93LmpRdWVyeTtcclxuXHJcbiAgd2luID0gJCh3aW5kb3cpO1xyXG5cclxuICAkLmZuLnN0aWNrX2luX3BhcmVudCA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuICAgIHZhciBkb2MsIGVsbSwgZW5hYmxlX2JvdHRvbWluZywgZm4sIGksIGlubmVyX3Njcm9sbGluZywgbGVuLCBtYW51YWxfc3BhY2VyLCBvZmZzZXRfdG9wLCBwYXJlbnRfc2VsZWN0b3IsIHJlY2FsY19ldmVyeSwgc3RpY2t5X2NsYXNzO1xyXG4gICAgaWYgKG9wdHMgPT0gbnVsbCkge1xyXG4gICAgICBvcHRzID0ge307XHJcbiAgICB9XHJcbiAgICBzdGlja3lfY2xhc3MgPSBvcHRzLnN0aWNreV9jbGFzcywgaW5uZXJfc2Nyb2xsaW5nID0gb3B0cy5pbm5lcl9zY3JvbGxpbmcsIHJlY2FsY19ldmVyeSA9IG9wdHMucmVjYWxjX2V2ZXJ5LCBwYXJlbnRfc2VsZWN0b3IgPSBvcHRzLnBhcmVudCwgb2Zmc2V0X3RvcCA9IG9wdHMub2Zmc2V0X3RvcCwgbWFudWFsX3NwYWNlciA9IG9wdHMuc3BhY2VyLCBlbmFibGVfYm90dG9taW5nID0gb3B0cy5ib3R0b21pbmc7XHJcbiAgICBpZiAob2Zmc2V0X3RvcCA9PSBudWxsKSB7XHJcbiAgICAgIG9mZnNldF90b3AgPSAwO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcmVudF9zZWxlY3RvciA9PSBudWxsKSB7XHJcbiAgICAgIHBhcmVudF9zZWxlY3RvciA9IHZvaWQgMDtcclxuICAgIH1cclxuICAgIGlmIChpbm5lcl9zY3JvbGxpbmcgPT0gbnVsbCkge1xyXG4gICAgICBpbm5lcl9zY3JvbGxpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHN0aWNreV9jbGFzcyA9PSBudWxsKSB7XHJcbiAgICAgIHN0aWNreV9jbGFzcyA9IFwiaXNfc3R1Y2tcIjtcclxuICAgIH1cclxuICAgIGRvYyA9ICQoZG9jdW1lbnQpO1xyXG4gICAgaWYgKGVuYWJsZV9ib3R0b21pbmcgPT0gbnVsbCkge1xyXG4gICAgICBlbmFibGVfYm90dG9taW5nID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGZuID0gZnVuY3Rpb24oZWxtLCBwYWRkaW5nX2JvdHRvbSwgcGFyZW50X3RvcCwgcGFyZW50X2hlaWdodCwgdG9wLCBoZWlnaHQsIGVsX2Zsb2F0LCBkZXRhY2hlZCkge1xyXG4gICAgICB2YXIgYm90dG9tZWQsIGRldGFjaCwgZml4ZWQsIGxhc3RfcG9zLCBsYXN0X3Njcm9sbF9oZWlnaHQsIG9mZnNldCwgcGFyZW50LCByZWNhbGMsIHJlY2FsY19hbmRfdGljaywgcmVjYWxjX2NvdW50ZXIsIHNwYWNlciwgdGljaztcclxuICAgICAgaWYgKGVsbS5kYXRhKFwic3RpY2t5X2tpdFwiKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBlbG0uZGF0YShcInN0aWNreV9raXRcIiwgdHJ1ZSk7XHJcbiAgICAgIGxhc3Rfc2Nyb2xsX2hlaWdodCA9IGRvYy5oZWlnaHQoKTtcclxuICAgICAgcGFyZW50ID0gZWxtLnBhcmVudCgpO1xyXG4gICAgICBpZiAocGFyZW50X3NlbGVjdG9yICE9IG51bGwpIHtcclxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQuY2xvc2VzdChwYXJlbnRfc2VsZWN0b3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghcGFyZW50Lmxlbmd0aCkge1xyXG4gICAgICAgIHRocm93IFwiZmFpbGVkIHRvIGZpbmQgc3RpY2sgcGFyZW50XCI7XHJcbiAgICAgIH1cclxuICAgICAgZml4ZWQgPSBmYWxzZTtcclxuICAgICAgYm90dG9tZWQgPSBmYWxzZTtcclxuICAgICAgc3BhY2VyID0gbWFudWFsX3NwYWNlciAhPSBudWxsID8gbWFudWFsX3NwYWNlciAmJiBlbG0uY2xvc2VzdChtYW51YWxfc3BhY2VyKSA6ICQoXCI8ZGl2IC8+XCIpO1xyXG4gICAgICBpZiAoc3BhY2VyKSB7XHJcbiAgICAgICAgc3BhY2VyLmNzcygncG9zaXRpb24nLCBlbG0uY3NzKCdwb3NpdGlvbicpKTtcclxuICAgICAgfVxyXG4gICAgICByZWNhbGMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYm9yZGVyX3RvcCwgcGFkZGluZ190b3AsIHJlc3RvcmU7XHJcbiAgICAgICAgaWYgKGRldGFjaGVkKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhc3Rfc2Nyb2xsX2hlaWdodCA9IGRvYy5oZWlnaHQoKTtcclxuICAgICAgICBib3JkZXJfdG9wID0gcGFyc2VJbnQocGFyZW50LmNzcyhcImJvcmRlci10b3Atd2lkdGhcIiksIDEwKTtcclxuICAgICAgICBwYWRkaW5nX3RvcCA9IHBhcnNlSW50KHBhcmVudC5jc3MoXCJwYWRkaW5nLXRvcFwiKSwgMTApO1xyXG4gICAgICAgIHBhZGRpbmdfYm90dG9tID0gcGFyc2VJbnQocGFyZW50LmNzcyhcInBhZGRpbmctYm90dG9tXCIpLCAxMCk7XHJcbiAgICAgICAgcGFyZW50X3RvcCA9IHBhcmVudC5vZmZzZXQoKS50b3AgKyBib3JkZXJfdG9wICsgcGFkZGluZ190b3A7XHJcbiAgICAgICAgcGFyZW50X2hlaWdodCA9IHBhcmVudC5oZWlnaHQoKTtcclxuICAgICAgICBpZiAoZml4ZWQpIHtcclxuICAgICAgICAgIGZpeGVkID0gZmFsc2U7XHJcbiAgICAgICAgICBib3R0b21lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYgKG1hbnVhbF9zcGFjZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBlbG0uaW5zZXJ0QWZ0ZXIoc3BhY2VyKTtcclxuICAgICAgICAgICAgc3BhY2VyLmRldGFjaCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxtLmNzcyh7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcIlwiLFxyXG4gICAgICAgICAgICB0b3A6IFwiXCIsXHJcbiAgICAgICAgICAgIHdpZHRoOiBcIlwiLFxyXG4gICAgICAgICAgICBib3R0b206IFwiXCJcclxuICAgICAgICAgIH0pLnJlbW92ZUNsYXNzKHN0aWNreV9jbGFzcyk7XHJcbiAgICAgICAgICByZXN0b3JlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdG9wID0gZWxtLm9mZnNldCgpLnRvcCAtIChwYXJzZUludChlbG0uY3NzKFwibWFyZ2luLXRvcFwiKSwgMTApIHx8IDApIC0gb2Zmc2V0X3RvcDtcclxuICAgICAgICBoZWlnaHQgPSBlbG0ub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcbiAgICAgICAgZWxfZmxvYXQgPSBlbG0uY3NzKFwiZmxvYXRcIik7XHJcbiAgICAgICAgaWYgKHNwYWNlcikge1xyXG4gICAgICAgICAgc3BhY2VyLmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiBlbG0ub3V0ZXJXaWR0aCh0cnVlKSxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGVsbS5jc3MoXCJkaXNwbGF5XCIpLFxyXG4gICAgICAgICAgICBcInZlcnRpY2FsLWFsaWduXCI6IGVsbS5jc3MoXCJ2ZXJ0aWNhbC1hbGlnblwiKSxcclxuICAgICAgICAgICAgXCJmbG9hdFwiOiBlbF9mbG9hdFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN0b3JlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgICAgcmVjYWxjKCk7XHJcbiAgICAgIGlmIChoZWlnaHQgPT09IHBhcmVudF9oZWlnaHQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgbGFzdF9wb3MgPSB2b2lkIDA7XHJcbiAgICAgIG9mZnNldCA9IG9mZnNldF90b3A7XHJcbiAgICAgIHJlY2FsY19jb3VudGVyID0gcmVjYWxjX2V2ZXJ5O1xyXG4gICAgICB0aWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGNzcywgZGVsdGEsIHJlY2FsY2VkLCBzY3JvbGwsIHdpbGxfYm90dG9tLCB3aW5faGVpZ2h0O1xyXG4gICAgICAgIGlmIChkZXRhY2hlZCkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZWNhbGNlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChyZWNhbGNfY291bnRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgICByZWNhbGNfY291bnRlciAtPSAxO1xyXG4gICAgICAgICAgaWYgKHJlY2FsY19jb3VudGVyIDw9IDApIHtcclxuICAgICAgICAgICAgcmVjYWxjX2NvdW50ZXIgPSByZWNhbGNfZXZlcnk7XHJcbiAgICAgICAgICAgIHJlY2FsYygpO1xyXG4gICAgICAgICAgICByZWNhbGNlZCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVjYWxjZWQgJiYgZG9jLmhlaWdodCgpICE9PSBsYXN0X3Njcm9sbF9oZWlnaHQpIHtcclxuICAgICAgICAgIHJlY2FsYygpO1xyXG4gICAgICAgICAgcmVjYWxjZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzY3JvbGwgPSB3aW4uc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgaWYgKGxhc3RfcG9zICE9IG51bGwpIHtcclxuICAgICAgICAgIGRlbHRhID0gc2Nyb2xsIC0gbGFzdF9wb3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhc3RfcG9zID0gc2Nyb2xsO1xyXG4gICAgICAgIGlmIChmaXhlZCkge1xyXG4gICAgICAgICAgaWYgKGVuYWJsZV9ib3R0b21pbmcpIHtcclxuICAgICAgICAgICAgd2lsbF9ib3R0b20gPSBzY3JvbGwgKyBoZWlnaHQgKyBvZmZzZXQgPiBwYXJlbnRfaGVpZ2h0ICsgcGFyZW50X3RvcDtcclxuICAgICAgICAgICAgaWYgKGJvdHRvbWVkICYmICF3aWxsX2JvdHRvbSkge1xyXG4gICAgICAgICAgICAgIGJvdHRvbWVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgZWxtLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgdG9wOiBvZmZzZXRcclxuICAgICAgICAgICAgICB9KS50cmlnZ2VyKFwic3RpY2t5X2tpdDp1bmJvdHRvbVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHNjcm9sbCA8IHRvcCkge1xyXG4gICAgICAgICAgICBmaXhlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvZmZzZXQgPSBvZmZzZXRfdG9wO1xyXG4gICAgICAgICAgICBpZiAobWFudWFsX3NwYWNlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsX2Zsb2F0ID09PSBcImxlZnRcIiB8fCBlbF9mbG9hdCA9PT0gXCJyaWdodFwiKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0uaW5zZXJ0QWZ0ZXIoc3BhY2VyKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgc3BhY2VyLmRldGFjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNzcyA9IHtcclxuICAgICAgICAgICAgICBwb3NpdGlvbjogXCJcIixcclxuICAgICAgICAgICAgICB3aWR0aDogXCJcIixcclxuICAgICAgICAgICAgICB0b3A6IFwiXCJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZWxtLmNzcyhjc3MpLnJlbW92ZUNsYXNzKHN0aWNreV9jbGFzcykudHJpZ2dlcihcInN0aWNreV9raXQ6dW5zdGlja1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpbm5lcl9zY3JvbGxpbmcpIHtcclxuICAgICAgICAgICAgd2luX2hlaWdodCA9IHdpbi5oZWlnaHQoKTtcclxuICAgICAgICAgICAgaWYgKGhlaWdodCArIG9mZnNldF90b3AgPiB3aW5faGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgaWYgKCFib3R0b21lZCkge1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0IC09IGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gTWF0aC5tYXgod2luX2hlaWdodCAtIGhlaWdodCwgb2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgIG9mZnNldCA9IE1hdGgubWluKG9mZnNldF90b3AsIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZml4ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgZWxtLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBvZmZzZXQgKyBcInB4XCJcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChzY3JvbGwgPiB0b3ApIHtcclxuICAgICAgICAgICAgZml4ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjc3MgPSB7XHJcbiAgICAgICAgICAgICAgcG9zaXRpb246IFwiZml4ZWRcIixcclxuICAgICAgICAgICAgICB0b3A6IG9mZnNldFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjc3Mud2lkdGggPSBlbG0uY3NzKFwiYm94LXNpemluZ1wiKSA9PT0gXCJib3JkZXItYm94XCIgPyBlbG0ub3V0ZXJXaWR0aCgpICsgXCJweFwiIDogZWxtLndpZHRoKCkgKyBcInB4XCI7XHJcbiAgICAgICAgICAgIGVsbS5jc3MoY3NzKS5hZGRDbGFzcyhzdGlja3lfY2xhc3MpO1xyXG4gICAgICAgICAgICBpZiAobWFudWFsX3NwYWNlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgZWxtLmFmdGVyKHNwYWNlcik7XHJcbiAgICAgICAgICAgICAgaWYgKGVsX2Zsb2F0ID09PSBcImxlZnRcIiB8fCBlbF9mbG9hdCA9PT0gXCJyaWdodFwiKSB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZXIuYXBwZW5kKGVsbSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsbS50cmlnZ2VyKFwic3RpY2t5X2tpdDpzdGlja1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpeGVkICYmIGVuYWJsZV9ib3R0b21pbmcpIHtcclxuICAgICAgICAgIGlmICh3aWxsX2JvdHRvbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbGxfYm90dG9tID0gc2Nyb2xsICsgaGVpZ2h0ICsgb2Zmc2V0ID4gcGFyZW50X2hlaWdodCArIHBhcmVudF90b3A7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoIWJvdHRvbWVkICYmIHdpbGxfYm90dG9tKSB7XHJcbiAgICAgICAgICAgIGJvdHRvbWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudC5jc3MoXCJwb3NpdGlvblwiKSA9PT0gXCJzdGF0aWNcIikge1xyXG4gICAgICAgICAgICAgIHBhcmVudC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIlxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlbG0uY3NzKHtcclxuICAgICAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogcGFkZGluZ19ib3R0b20sXHJcbiAgICAgICAgICAgICAgdG9wOiBcImF1dG9cIlxyXG4gICAgICAgICAgICB9KS50cmlnZ2VyKFwic3RpY2t5X2tpdDpib3R0b21cIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICByZWNhbGNfYW5kX3RpY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZWNhbGMoKTtcclxuICAgICAgICByZXR1cm4gdGljaygpO1xyXG4gICAgICB9O1xyXG4gICAgICBkZXRhY2ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBkZXRhY2hlZCA9IHRydWU7XHJcbiAgICAgICAgd2luLm9mZihcInRvdWNobW92ZVwiLCB0aWNrKTtcclxuICAgICAgICB3aW4ub2ZmKFwic2Nyb2xsXCIsIHRpY2spO1xyXG4gICAgICAgIHdpbi5vZmYoXCJyZXNpemVcIiwgcmVjYWxjX2FuZF90aWNrKTtcclxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpLm9mZihcInN0aWNreV9raXQ6cmVjYWxjXCIsIHJlY2FsY19hbmRfdGljayk7XHJcbiAgICAgICAgZWxtLm9mZihcInN0aWNreV9raXQ6ZGV0YWNoXCIsIGRldGFjaCk7XHJcbiAgICAgICAgZWxtLnJlbW92ZURhdGEoXCJzdGlja3lfa2l0XCIpO1xyXG4gICAgICAgIGVsbS5jc3Moe1xyXG4gICAgICAgICAgcG9zaXRpb246IFwiXCIsXHJcbiAgICAgICAgICBib3R0b206IFwiXCIsXHJcbiAgICAgICAgICB0b3A6IFwiXCIsXHJcbiAgICAgICAgICB3aWR0aDogXCJcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBhcmVudC5wb3NpdGlvbihcInBvc2l0aW9uXCIsIFwiXCIpO1xyXG4gICAgICAgIGlmIChmaXhlZCkge1xyXG4gICAgICAgICAgaWYgKG1hbnVhbF9zcGFjZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoZWxfZmxvYXQgPT09IFwibGVmdFwiIHx8IGVsX2Zsb2F0ID09PSBcInJpZ2h0XCIpIHtcclxuICAgICAgICAgICAgICBlbG0uaW5zZXJ0QWZ0ZXIoc3BhY2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcGFjZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gZWxtLnJlbW92ZUNsYXNzKHN0aWNreV9jbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICB3aW4ub24oXCJ0b3VjaG1vdmVcIiwgdGljayk7XHJcbiAgICAgIHdpbi5vbihcInNjcm9sbFwiLCB0aWNrKTtcclxuICAgICAgd2luLm9uKFwicmVzaXplXCIsIHJlY2FsY19hbmRfdGljayk7XHJcbiAgICAgICQoZG9jdW1lbnQuYm9keSkub24oXCJzdGlja3lfa2l0OnJlY2FsY1wiLCByZWNhbGNfYW5kX3RpY2spO1xyXG4gICAgICBlbG0ub24oXCJzdGlja3lfa2l0OmRldGFjaFwiLCBkZXRhY2gpO1xyXG4gICAgICByZXR1cm4gc2V0VGltZW91dCh0aWNrLCAwKTtcclxuICAgIH07XHJcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGVsbSA9IHRoaXNbaV07XHJcbiAgICAgIGZuKCQoZWxtKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxufSkuY2FsbCh0aGlzKTsiXSwiZmlsZSI6Im1haW4uanMifQ==
