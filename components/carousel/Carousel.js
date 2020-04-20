"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Carousel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _UniqueComponentId = _interopRequireDefault(require("../utils/UniqueComponentId"));

var _DomHandler = _interopRequireDefault(require("../utils/DomHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CarouselItem extends _react.Component {
  render() {
    const content = this.props.template(this.props.item);
    const itemClassName = (0, _classnames.default)(this.props.className, 'p-carousel-item', {
      'p-carousel-item-active': this.props.active,
      'p-carousel-item-start': this.props.start,
      'p-carousel-item-end': this.props.end
    });
    return _react.default.createElement("div", {
      className: itemClassName
    }, content);
  }

}

_defineProperty(CarouselItem, "defaultProps", {
  template: null,
  item: null,
  active: false,
  start: false,
  end: false,
  className: null
});

_defineProperty(CarouselItem, "propTypes", {
  template: _propTypes.default.func,
  item: _propTypes.default.any,
  active: _propTypes.default.bool,
  start: _propTypes.default.bool,
  end: _propTypes.default.bool,
  className: _propTypes.default.string
});

class Carousel extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      numVisible: props.numVisible,
      numScroll: props.numScroll,
      totalShiftedItems: props.page * props.numScroll * -1
    };

    if (!this.props.onPageChange) {
      this.state = _objectSpread({}, this.state, {
        page: props.page
      });
    }

    this.navBackward = this.navBackward.bind(this);
    this.navForward = this.navForward.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.totalDots = 0;
    this.remainingItems = 0;
    this.allowAutoplay = !!this.props.autoplayInterval;
    this.circular = this.props.circular || this.allowAutoplay;
    this.id = this.props.id || (0, _UniqueComponentId.default)();
  }

  step(dir, page) {
    let totalShiftedItems = this.state.totalShiftedItems;
    const isCircular = this.isCircular();

    if (page != null) {
      totalShiftedItems = this.state.numScroll * page * -1;

      if (isCircular) {
        totalShiftedItems -= this.state.numVisible;
      }

      this.isRemainingItemsAdded = false;
    } else {
      totalShiftedItems += this.state.numScroll * dir;

      if (this.isRemainingItemsAdded) {
        totalShiftedItems += this.remainingItems - this.state.numScroll * dir;
        this.isRemainingItemsAdded = false;
      }

      let originalShiftedItems = isCircular ? totalShiftedItems + this.state.numVisible : totalShiftedItems;
      page = Math.abs(Math.floor(originalShiftedItems / this.state.numScroll));
    }

    if (isCircular && this.state.page === this.totalDots - 1 && dir === -1) {
      totalShiftedItems = -1 * (this.props.value.length + this.state.numVisible);
      page = 0;
    } else if (isCircular && this.state.page === 0 && dir === 1) {
      totalShiftedItems = 0;
      page = this.totalDots - 1;
    } else if (page === this.totalDots - 1 && this.remainingItems > 0) {
      totalShiftedItems += this.remainingItems * -1 - this.state.numScroll * dir;
      this.isRemainingItemsAdded = true;
    }

    if (this.itemsContainer) {
      _DomHandler.default.removeClass(this.itemsContainer, 'p-items-hidden');

      this.itemsContainer.style.transform = this.isVertical() ? "translate3d(0, ".concat(totalShiftedItems * (100 / this.state.numVisible), "%, 0)") : "translate3d(".concat(totalShiftedItems * (100 / this.state.numVisible), "%, 0, 0)");
      this.itemsContainer.style.transition = 'transform 500ms ease 0s';
    }

    if (this.props.onPageChange) {
      this.setState({
        totalShiftedItems
      });
      this.props.onPageChange({
        page
      });
    } else {
      this.setState({
        page,
        totalShiftedItems
      });
    }
  }

  calculatePosition() {
    if (this.itemsContainer && this.responsiveOptions) {
      let windowWidth = window.innerWidth;
      let matchedResponsiveData = {
        numVisible: this.props.numVisible,
        numScroll: this.props.numScroll
      };

      for (let i = 0; i < this.responsiveOptions.length; i++) {
        let res = this.responsiveOptions[i];

        if (parseInt(res.breakpoint, 10) >= windowWidth) {
          matchedResponsiveData = res;
        }
      }

      let state = {};

      if (this.state.numScroll !== matchedResponsiveData.numScroll) {
        let page = this.getPage();
        page = Math.floor(page * this.state.numScroll / matchedResponsiveData.numScroll);
        let totalShiftedItems = matchedResponsiveData.numScroll * page * -1;

        if (this.isCircular()) {
          totalShiftedItems -= matchedResponsiveData.numVisible;
        }

        state = {
          totalShiftedItems,
          numScroll: matchedResponsiveData.numScroll
        };

        if (this.props.onPageChange) {
          this.props.onPageChange({
            page
          });
        } else {
          state = _objectSpread({}, state, {
            page
          });
        }
      }

      if (this.state.numVisible !== matchedResponsiveData.numVisible) {
        state = _objectSpread({}, state, {
          numVisible: matchedResponsiveData.numVisible
        });
      }

      if (Object.keys(state).length) {
        this.setState(state);
      }
    }
  }

  navBackward(e, page) {
    if (this.circular || this.getPage() !== 0) {
      this.step(1, page);
    }

    this.allowAutoplay = false;

    if (e.cancelable) {
      e.preventDefault();
    }
  }

  navForward(e, page) {
    if (this.circular || this.getPage() < this.totalDots - 1) {
      this.step(-1, page);
    }

    this.allowAutoplay = false;

    if (e.cancelable) {
      e.preventDefault();
    }
  }

  onDotClick(e, page) {
    let currentPage = this.getPage();

    if (page > currentPage) {
      this.navForward(e, page);
    } else if (page < currentPage) {
      this.navBackward(e, page);
    }
  }

  onTransitionEnd() {
    if (this.itemsContainer) {
      _DomHandler.default.addClass(this.itemsContainer, 'p-items-hidden');

      this.itemsContainer.style.transition = '';

      if ((this.state.page === 0 || this.state.page === this.totalDots - 1) && this.isCircular()) {
        this.itemsContainer.style.transform = this.isVertical() ? "translate3d(0, ".concat(this.state.totalShiftedItems * (100 / this.state.numVisible), "%, 0)") : "translate3d(".concat(this.state.totalShiftedItems * (100 / this.state.numVisible), "%, 0, 0)");
      }
    }
  }

  onTouchStart(e) {
    let touchobj = e.changedTouches[0];
    this.startPos = {
      x: touchobj.pageX,
      y: touchobj.pageY
    };
  }

  onTouchMove(e) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }

  onTouchEnd(e) {
    let touchobj = e.changedTouches[0];

    if (this.isVertical()) {
      this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
    } else {
      this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
    }
  }

  changePageOnTouch(e, diff) {
    if (diff < 0) {
      // left
      this.navForward(e);
    } else {
      // right
      this.navBackward(e);
    }
  }

  bindDocumentListeners() {
    if (!this.documentResizeListener) {
      this.documentResizeListener = () => {
        this.calculatePosition();
      };

      window.addEventListener('resize', this.documentResizeListener);
    }
  }

  unbindDocumentListeners() {
    if (this.documentResizeListener) {
      window.removeEventListener('resize', this.documentResizeListener);
      this.documentResizeListener = null;
    }
  }

  isVertical() {
    return this.props.orientation === 'vertical';
  }

  isCircular() {
    return this.circular && this.props.value.length >= this.state.numVisible;
  }

  getPage() {
    return this.props.onPageChange ? this.props.page : this.state.page;
  }

  getTotalDots() {
    return this.props.value ? Math.ceil((this.props.value.length - this.state.numVisible) / this.state.numScroll) + 1 : 0;
  }

  isAutoplay() {
    return this.props.autoplayInterval && this.allowAutoplay;
  }

  startAutoplay() {
    this.interval = setInterval(() => {
      if (this.state.page === this.totalDots - 1) {
        this.step(-1, 0);
      } else {
        this.step(-1, this.state.page + 1);
      }
    }, this.props.autoplayInterval);
  }

  stopAutoplay() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  createStyle() {
    if (!this.carouselStyle) {
      this.carouselStyle = document.createElement('style');
      this.carouselStyle.type = 'text/css';
      document.body.appendChild(this.carouselStyle);
    }

    let innerHTML = "\n            #".concat(this.id, " .p-carousel-item {\n                flex: 1 0 ").concat(100 / this.state.numVisible, "%\n            }\n        ");

    if (this.props.responsiveOptions) {
      this.responsiveOptions = [...this.props.responsiveOptions];
      this.responsiveOptions.sort((data1, data2) => {
        const value1 = data1.breakpoint;
        const value2 = data2.breakpoint;
        let result = null;
        if (value1 == null && value2 != null) result = -1;else if (value1 != null && value2 == null) result = 1;else if (value1 == null && value2 == null) result = 0;else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, {
          numeric: true
        });else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        return -1 * result;
      });

      for (let i = 0; i < this.responsiveOptions.length; i++) {
        let res = this.responsiveOptions[i];
        innerHTML += "\n                    @media screen and (max-width: ".concat(res.breakpoint, ") {\n                        #").concat(this.id, " .p-carousel-item {\n                            flex: 1 0 ").concat(100 / res.numVisible, "%\n                        }\n                    } \n                ");
      }
    }

    this.carouselStyle.innerHTML = innerHTML;
  }

  componentDidMount() {
    this.createStyle();
    this.calculatePosition();

    if (this.props.responsiveOptions) {
      this.bindDocumentListeners();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const isCircular = this.isCircular();
    let stateChanged = false;
    let totalShiftedItems = this.state.totalShiftedItems;

    if (this.props.autoplayInterval) {
      this.stopAutoplay();
    }

    if (prevState.numScroll !== this.state.numScroll || prevState.numVisible !== this.state.numVisible || prevProps.value.length !== this.props.value.length) {
      this.remainingItems = (this.props.value.length - this.state.numVisible) % this.state.numScroll;
      let page = this.getPage();

      if (this.totalDots !== 0 && page >= this.totalDots) {
        page = this.totalDots - 1;

        if (this.props.onPageChange) {
          this.props.onPageChange({
            page
          });
        } else {
          this.setState({
            page
          });
        }

        stateChanged = true;
      }

      totalShiftedItems = page * this.state.numScroll * -1;

      if (isCircular) {
        totalShiftedItems -= this.state.numVisible;
      }

      if (page === this.totalDots - 1 && this.remainingItems > 0) {
        totalShiftedItems += -1 * this.remainingItems + this.state.numScroll;
        this.isRemainingItemsAdded = true;
      } else {
        this.isRemainingItemsAdded = false;
      }

      if (totalShiftedItems !== this.state.totalShiftedItems) {
        this.setState({
          totalShiftedItems
        });
        stateChanged = true;
      }

      this.itemsContainer.style.transform = this.isVertical() ? "translate3d(0, ".concat(totalShiftedItems * (100 / this.state.numVisible), "%, 0)") : "translate3d(".concat(totalShiftedItems * (100 / this.state.numVisible), "%, 0, 0)");
    }

    if (isCircular) {
      if (this.state.page === 0) {
        totalShiftedItems = -1 * this.state.numVisible;
      } else if (totalShiftedItems === 0) {
        totalShiftedItems = -1 * this.props.value.length;

        if (this.remainingItems > 0) {
          this.isRemainingItemsAdded = true;
        }
      }

      if (totalShiftedItems !== this.state.totalShiftedItems) {
        this.setState({
          totalShiftedItems
        });
        stateChanged = true;
      }
    }

    if (!stateChanged && this.isAutoplay()) {
      this.startAutoplay();
    }
  }

  componentWillUnmount() {
    if (this.props.responsiveOptions) {
      this.unbindDocumentListeners();
    }

    if (this.props.autoplayInterval) {
      this.stopAutoplay();
    }
  }

  renderItems() {
    if (this.props.value && this.props.value.length) {
      const isCircular = this.isCircular();
      let clonedItemsForStarting = null;
      let clonedItemsForFinishing = null;

      if (isCircular) {
        let clonedElements = null;
        clonedElements = this.props.value.slice(-1 * this.state.numVisible);
        clonedItemsForStarting = clonedElements.map((item, index) => {
          let isActive = this.state.totalShiftedItems * -1 === this.props.value.length + this.state.numVisible,
              start = index === 0,
              end = index === clonedElements.length - 1;
          return _react.default.createElement(CarouselItem, {
            key: index + '_scloned',
            className: "p-carousel-item-cloned",
            template: this.props.itemTemplate,
            item: item,
            active: isActive,
            start: start,
            end: end
          });
        });
        clonedElements = this.props.value.slice(0, this.state.numVisible);
        clonedItemsForFinishing = clonedElements.map((item, index) => {
          let isActive = this.state.totalShiftedItems === 0,
              start = index === 0,
              end = index === clonedElements.length - 1;
          return _react.default.createElement(CarouselItem, {
            key: index + '_fcloned',
            className: "p-carousel-item-cloned",
            template: this.props.itemTemplate,
            item: item,
            active: isActive,
            start: start,
            end: end
          });
        });
      }

      let items = this.props.value.map((item, index) => {
        let firstIndex = isCircular ? -1 * (this.state.totalShiftedItems + this.state.numVisible) : this.state.totalShiftedItems * -1,
            lastIndex = firstIndex + this.state.numVisible - 1,
            isActive = firstIndex <= index && lastIndex >= index,
            start = firstIndex === index,
            end = lastIndex === index;
        return _react.default.createElement(CarouselItem, {
          key: index,
          template: this.props.itemTemplate,
          item: item,
          active: isActive,
          start: start,
          end: end
        });
      });
      return _react.default.createElement(_react.default.Fragment, null, clonedItemsForStarting, items, clonedItemsForFinishing);
    }
  }

  renderHeader() {
    if (this.props.header) {
      return _react.default.createElement("div", {
        className: "p-carousel-header"
      }, this.props.header);
    }

    return null;
  }

  renderFooter() {
    if (this.props.footer) {
      return _react.default.createElement("div", {
        className: "p-carousel-footer"
      }, this.props.footer);
    }

    return null;
  }

  renderContent() {
    const items = this.renderItems();
    const height = this.isVertical() ? this.props.verticalViewPortHeight : 'auto';
    const backwardNavigator = this.renderBackwardNavigator();
    const forwardNavigator = this.renderForwardNavigator();
    const containerClassName = (0, _classnames.default)('p-carousel-container', this.props.containerClassName);
    return _react.default.createElement("div", {
      className: containerClassName
    }, backwardNavigator, _react.default.createElement("div", {
      className: "p-carousel-items-content",
      style: {
        'height': height
      }
    }, _react.default.createElement("div", {
      ref: el => this.itemsContainer = el,
      className: "p-carousel-items-container",
      onTransitionEnd: this.onTransitionEnd,
      onTouchStart: this.onTouchStart,
      onTouchMove: this.onTouchMove,
      onTouchEnd: this.onTouchEnd
    }, items)), forwardNavigator);
  }

  renderBackwardNavigator() {
    let isDisabled = (!this.circular || this.props.value.length < this.state.numVisible) && this.getPage() === 0;
    let buttonClassName = (0, _classnames.default)('p-carousel-prev p-button', {
      'p-disabled': isDisabled
    }),
        iconClassName = (0, _classnames.default)('p-carousel-prev-icon pi', {
      'pi-chevron-left': !this.isVertical(),
      'pi-chevron-up': this.isVertical()
    });
    return _react.default.createElement("button", {
      className: buttonClassName,
      onClick: this.navBackward,
      disabled: isDisabled
    }, _react.default.createElement("span", {
      className: iconClassName
    }));
  }

  renderForwardNavigator() {
    let isDisabled = (!this.circular || this.props.value.length < this.state.numVisible) && (this.getPage() === this.totalDots - 1 || this.totalDots === 0);
    let buttonClassName = (0, _classnames.default)('p-carousel-next p-button', {
      'p-disabled': isDisabled
    }),
        iconClassName = (0, _classnames.default)('p-carousel-prev-icon pi', {
      'pi-chevron-right': !this.isVertical(),
      'pi-chevron-down': this.isVertical()
    });
    return _react.default.createElement("button", {
      className: buttonClassName,
      onClick: this.navForward,
      disabled: isDisabled
    }, _react.default.createElement("span", {
      className: iconClassName
    }));
  }

  renderDot(index) {
    let isActive = this.getPage() === index,
        dotItemClassName = (0, _classnames.default)('p-carousel-dot-item', {
      'p-highlight': isActive
    }),
        iconClassName = (0, _classnames.default)('p-carousel-dot-icon pi', {
      'pi-circle-on': isActive,
      'pi-circle-off': !isActive
    });
    return _react.default.createElement("li", {
      className: dotItemClassName,
      key: 'p-carousel-dot-' + index
    }, _react.default.createElement("button", {
      className: "p-link",
      onClick: e => this.onDotClick(e, index)
    }, _react.default.createElement("span", {
      className: iconClassName
    })));
  }

  renderDots() {
    const dotsContainerClassName = (0, _classnames.default)('p-carousel-dots-container p-reset', this.props.dotsContainerClassName);
    let dots = [];

    for (let i = 0; i < this.totalDots; i++) {
      dots.push(this.renderDot(i));
    }

    return _react.default.createElement("ul", {
      className: dotsContainerClassName
    }, dots);
  }

  render() {
    const className = (0, _classnames.default)('p-carousel p-component', {
      'p-carousel-vertical': this.isVertical(),
      'p-carousel-horizontal': !this.isVertical()
    }, this.props.className);
    const contentClassName = (0, _classnames.default)('p-carousel-content', this.props.contentClassName);
    this.totalDots = this.getTotalDots();
    const content = this.renderContent();
    const dots = this.renderDots();
    const header = this.renderHeader();
    const footer = this.renderFooter();
    return _react.default.createElement("div", {
      id: this.id,
      className: className,
      style: this.props.style
    }, header, _react.default.createElement("div", {
      className: contentClassName
    }, content, dots), footer);
  }

}

exports.Carousel = Carousel;

_defineProperty(Carousel, "defaultProps", {
  id: null,
  value: null,
  page: 0,
  header: null,
  footer: null,
  style: null,
  className: null,
  itemTemplate: null,
  circular: false,
  autoplayInterval: 0,
  numVisible: 1,
  numScroll: 1,
  responsiveOptions: null,
  orientation: "horizontal",
  verticalViewPortHeight: "300px",
  contentClassName: null,
  containerClassName: null,
  dotsContainerClassName: null,
  onPageChange: null
});

_defineProperty(Carousel, "propTypes", {
  id: _propTypes.default.string,
  value: _propTypes.default.any,
  page: _propTypes.default.number,
  header: _propTypes.default.any,
  footer: _propTypes.default.any,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  itemTemplate: _propTypes.default.any,
  circular: _propTypes.default.bool,
  autoplayInterval: _propTypes.default.number,
  numVisible: _propTypes.default.number,
  numScroll: _propTypes.default.number,
  responsiveOptions: _propTypes.default.array,
  orientation: _propTypes.default.string,
  verticalViewPortHeight: _propTypes.default.string,
  contentClassName: _propTypes.default.string,
  containerClassName: _propTypes.default.string,
  dotsContainerClassName: _propTypes.default.string,
  onPageChange: _propTypes.default.func
});