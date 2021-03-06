"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class DomHandler {
  static innerWidth(el) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);
      width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      return width;
    }

    return 0;
  }

  static width(el) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);
      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      return width;
    }

    return 0;
  }

  static getWindowScrollTop() {
    let doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }

  static getWindowScrollLeft() {
    let doc = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  }

  static getOuterWidth(el, margin) {
    if (el) {
      let width = el.offsetWidth;

      if (margin) {
        let style = getComputedStyle(el);
        width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      }

      return width;
    }

    return 0;
  }

  static getOuterHeight(el, margin) {
    if (el) {
      let height = el.offsetHeight;

      if (margin) {
        let style = getComputedStyle(el);
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }

      return height;
    }

    return 0;
  }

  static getClientHeight(el, margin) {
    if (el) {
      let height = el.clientHeight;

      if (margin) {
        let style = getComputedStyle(el);
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }

      return height;
    }

    return 0;
  }

  static getViewport() {
    let win = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = win.innerWidth || e.clientWidth || g.clientWidth,
        h = win.innerHeight || e.clientHeight || g.clientHeight;
    return {
      width: w,
      height: h
    };
  }

  static getOffset(el) {
    if (el) {
      let rect = el.getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    }

    return {
      top: 'auto',
      left: 'auto'
    };
  }

  static generateZIndex() {
    this.zindex = this.zindex || 999;
    return ++this.zindex;
  }

  static getCurrentZIndex() {
    return this.zindex;
  }

  static index(element) {
    if (element) {
      let children = element.parentNode.childNodes;
      let num = 0;

      for (var i = 0; i < children.length; i++) {
        if (children[i] === element) return num;
        if (children[i].nodeType === 1) num++;
      }
    }

    return -1;
  }

  static addMultipleClasses(element, className) {
    if (element) {
      if (element.classList) {
        let styles = className.split(' ');

        for (let i = 0; i < styles.length; i++) {
          element.classList.add(styles[i]);
        }
      } else {
        let styles = className.split(' ');

        for (let i = 0; i < styles.length; i++) {
          element.className += ' ' + styles[i];
        }
      }
    }
  }

  static addClass(element, className) {
    if (element) {
      if (element.classList) element.classList.add(className);else element.className += ' ' + className;
    }
  }

  static removeClass(element, className) {
    if (element) {
      if (element.classList) element.classList.remove(className);else element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  static hasClass(element, className) {
    if (element) {
      if (element.classList) return element.classList.contains(className);else return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
    }
  }

  static find(element, selector) {
    return element ? Array.from(element.querySelectorAll(selector)) : [];
  }

  static findSingle(element, selector) {
    if (element) {
      return element.querySelector(selector);
    }

    return null;
  }

  static getHeight(el) {
    if (el) {
      let height = el.offsetHeight;
      let style = getComputedStyle(el);
      height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      return height;
    }

    return 0;
  }

  static getWidth(el) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);
      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
      return width;
    }

    return 0;
  }

  static absolutePosition(element, target) {
    if (element) {
      let elementDimensions = element.offsetParent ? {
        width: element.offsetWidth,
        height: element.offsetHeight
      } : this.getHiddenElementDimensions(element);
      let elementOuterHeight = elementDimensions.height;
      let elementOuterWidth = elementDimensions.width;
      let targetOuterHeight = target.offsetHeight;
      let targetOuterWidth = target.offsetWidth;
      let targetOffset = target.getBoundingClientRect();
      let windowScrollTop = this.getWindowScrollTop();
      let windowScrollLeft = this.getWindowScrollLeft();
      let viewport = this.getViewport();
      let top, left;

      if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
        top = targetOffset.top + windowScrollTop - elementOuterHeight;

        if (top < 0) {
          top = windowScrollTop;
        }
      } else {
        top = targetOuterHeight + targetOffset.top + windowScrollTop;
      }

      if (targetOffset.left + targetOuterWidth + elementOuterWidth > viewport.width) left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);else left = targetOffset.left + windowScrollLeft;
      element.style.top = top + 'px';
      element.style.left = left + 'px';
    }
  }

  static relativePosition(element, target, container) {
    let elementDimensions = element.offsetParent ? {
      width: element.offsetWidth,
      height: element.offsetHeight
    } : this.getHiddenElementDimensions(element);
    const targetHeight = target.offsetHeight;
    const targetOffset = target.getBoundingClientRect();
    const viewport = this.getViewport();
    viewport.top = 0;
    let containerDimensions = container ? {
      height: container.offsetHeight + container.getBoundingClientRect().top,
      width: container.offsetWidth + container.getBoundingClientRect().left,
      top: container.getBoundingClientRect().top
    } : viewport;
    let top, left, max_height;

    if (targetOffset.top + targetHeight + elementDimensions.height > containerDimensions.height) {
      top = -1 * elementDimensions.height;

      if (targetOffset.top + top < containerDimensions.top) {
        top = targetHeight;
        max_height = containerDimensions.height - targetHeight - targetOffset.top;
      }
    } else {
      top = targetHeight;
    }

    if (elementDimensions.width > containerDimensions.width) {
      // element wider then containerDimensions and cannot fit on screen (align at left side of containerDimensions)
      left = targetOffset.left * -1;
    } else if (targetOffset.left + elementDimensions.width > containerDimensions.width) {
      // element wider then containerDimensions but can be fit on screen (align at right side of containerDimensions)
      left = (targetOffset.left + elementDimensions.width - containerDimensions.width) * -1;
    } else {
      // element fits on screen (align with target)
      left = 0;
    }

    element.style.top = top + 'px';
    element.style.left = left + 'px';
    if (max_height) element.style["max-height"] = max_height + 'px';
  }

  static getHiddenElementOuterHeight(element) {
    if (element) {
      element.style.visibility = 'hidden';
      element.style.display = 'block';
      let elementHeight = element.offsetHeight;
      element.style.display = 'none';
      element.style.visibility = 'visible';
      return elementHeight;
    }

    return 0;
  }

  static getHiddenElementOuterWidth(element) {
    if (element) {
      element.style.visibility = 'hidden';
      element.style.display = 'block';
      let elementWidth = element.offsetWidth;
      element.style.display = 'none';
      element.style.visibility = 'visible';
      return elementWidth;
    }

    return 0;
  }

  static getHiddenElementDimensions(element) {
    let dimensions = {};

    if (element) {
      element.style.visibility = 'hidden';
      element.style.display = 'block';
      dimensions.width = element.offsetWidth;
      dimensions.height = element.offsetHeight;
      element.style.display = 'none';
      element.style.visibility = 'visible';
    }

    return dimensions;
  }

  static fadeIn(element, duration) {
    if (element) {
      element.style.opacity = 0;
      let last = +new Date();
      let opacity = 0;

      let tick = function tick() {
        opacity = +element.style.opacity + (new Date().getTime() - last) / duration;
        element.style.opacity = opacity;
        last = +new Date();

        if (+opacity < 1) {
          window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16);
        }
      };

      tick();
    }
  }

  static fadeOut(element, ms) {
    if (element) {
      let opacity = 1,
          interval = 50,
          duration = ms,
          gap = interval / duration;
      let fading = setInterval(() => {
        opacity -= gap;

        if (opacity <= 0) {
          opacity = 0;
          clearInterval(fading);
        }

        element.style.opacity = opacity;
      }, interval);
    }
  }

  static getUserAgent() {
    return navigator.userAgent;
  }

  static isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
  }

  static isAndroid() {
    return /(android)/i.test(navigator.userAgent);
  }

  static appendChild(element, target) {
    if (this.isElement(target)) target.appendChild(element);else if (target.el && target.el.nativeElement) target.el.nativeElement.appendChild(element);else throw new Error('Cannot append ' + target + ' to ' + element);
  }

  static scrollInView(container, item) {
    let borderTopValue = getComputedStyle(container).getPropertyValue('borderTopWidth');
    let borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
    let paddingTopValue = getComputedStyle(container).getPropertyValue('paddingTop');
    let paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    let containerRect = container.getBoundingClientRect();
    let itemRect = item.getBoundingClientRect();
    let offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    let scroll = container.scrollTop;
    let elementHeight = container.clientHeight;
    let itemHeight = this.getOuterHeight(item);

    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  }

  static clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
        window.getSelection().removeAllRanges();
      }
    } else if (document['selection'] && document['selection'].empty) {
      try {
        document['selection'].empty();
      } catch (error) {//ignore IE bug
      }
    }
  }

  static calculateScrollbarWidth(el) {
    if (el) {
      let style = getComputedStyle(el);
      return el.offsetWidth - el.clientWidth - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
    } else {
      if (this.calculatedScrollbarWidth != null) return this.calculatedScrollbarWidth;
      let scrollDiv = document.createElement("div");
      scrollDiv.className = "p-scrollbar-measure";
      document.body.appendChild(scrollDiv);
      let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      this.calculatedScrollbarWidth = scrollbarWidth;
      return scrollbarWidth;
    }
  }

  static getBrowser() {
    if (!this.browser) {
      let matched = this.resolveUserAgent();
      this.browser = {};

      if (matched.browser) {
        this.browser[matched.browser] = true;
        this.browser['version'] = matched.version;
      }

      if (this.browser['chrome']) {
        this.browser['webkit'] = true;
      } else if (this.browser['webkit']) {
        this.browser['safari'] = true;
      }
    }

    return this.browser;
  }

  static resolveUserAgent() {
    let ua = navigator.userAgent.toLowerCase();
    let match = /(chrome)[ ]([\w.]+)/.exec(ua) || /(webkit)[ ]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
    return {
      browser: match[1] || "",
      version: match[2] || "0"
    };
  }

  static isVisible(element) {
    return element && element.offsetParent != null;
  }

}

exports.default = DomHandler;