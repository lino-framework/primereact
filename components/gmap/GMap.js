"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GMap = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GMap extends _react.Component {
  initMap() {
    this.map = new google.maps.Map(this.container, this.props.options);

    if (this.props.onMapReady) {
      this.props.onMapReady({
        map: this.map
      });
    }

    this.initOverlays(this.props.overlays);
    this.bindMapEvent('click', this.props.onMapClick);
    this.bindMapEvent('dragend', this.props.onMapDragEnd);
    this.bindMapEvent('zoom_changed', this.props.onZoomChanged);
  }

  initOverlays(overlays) {
    if (overlays) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = overlays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let overlay = _step.value;
          overlay.setMap(this.map);
          this.bindOverlayEvents(overlay);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }

  bindOverlayEvents(overlay) {
    overlay.addListener('click', event => {
      if (this.props.onOverlayClick) {
        this.props.onOverlayClick({
          originalEvent: event,
          overlay: overlay,
          map: this.map
        });
      }
    });

    if (overlay.getDraggable()) {
      this.bindDragEvents(overlay);
    }
  }

  bindDragEvents(overlay) {
    this.bindDragEvent(overlay, 'dragstart', this.props.onOverlayDragStart);
    this.bindDragEvent(overlay, 'drag', this.props.onOverlayDrag);
    this.bindDragEvent(overlay, 'dragend', this.props.onOverlayDragEnd);
  }

  bindMapEvent(eventName, callback) {
    this.map.addListener(eventName, event => {
      if (callback) {
        callback(event);
      }
    });
  }

  bindDragEvent(overlay, eventName, callback) {
    overlay.addListener(eventName, event => {
      if (callback) {
        callback({
          originalEvent: event,
          overlay: overlay,
          map: this.map
        });
      }
    });
  }

  getMap() {
    return this.map;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.overlays !== this.props.overlays) {
      if (prevProps.overlays) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = prevProps.overlays[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            let overlay = _step2.value;
            google.maps.event.clearInstanceListeners(overlay);
            overlay.setMap(null);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      this.initOverlays(this.props.overlays);
    }
  }

  componentDidMount() {
    this.initMap();
  }

  render() {
    return _react.default.createElement("div", {
      ref: el => this.container = el,
      style: this.props.style,
      className: this.props.className
    });
  }

}

exports.GMap = GMap;

_defineProperty(GMap, "defaultProps", {
  options: null,
  overlays: null,
  style: null,
  className: null,
  onMapReady: null,
  onMapClick: null,
  onMapDragEnd: null,
  onZoomChanged: null,
  onOverlayDragStart: null,
  onOverlayDrag: null,
  onOverlayDragEnd: null,
  onOverlayClick: null
});

_defineProperty(GMap, "propTypes", {
  options: _propTypes.default.object,
  overlays: _propTypes.default.array,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  onMapReady: _propTypes.default.func,
  onMapClick: _propTypes.default.func,
  onMapDragEnd: _propTypes.default.func,
  onZoomChanged: _propTypes.default.func,
  onOverlayDragStart: _propTypes.default.func,
  onOverlayDrag: _propTypes.default.func,
  onOverlayDragEnd: _propTypes.default.func,
  onOverlayClick: _propTypes.default.func
});