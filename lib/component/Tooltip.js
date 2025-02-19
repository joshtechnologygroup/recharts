"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tooltip = void 0;

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _uniqBy2 = _interopRequireDefault(require("lodash/uniqBy"));

var _react = _interopRequireWildcard(require("react"));

var _reactSmooth = require("react-smooth");

var _classnames = _interopRequireDefault(require("classnames"));

var _DefaultTooltipContent = require("./DefaultTooltipContent");

var _Global = require("../util/Global");

var _DataUtils = require("../util/DataUtils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var CLS_PREFIX = 'recharts-tooltip-wrapper';
var EPS = 1;

function defaultUniqBy(entry) {
  return entry.dataKey;
}

function getUniqPayload(option, payload) {
  if (option === true) {
    return (0, _uniqBy2["default"])(payload, defaultUniqBy);
  }

  if ((0, _isFunction2["default"])(option)) {
    return (0, _uniqBy2["default"])(payload, option);
  }

  return payload;
}

function renderContent(content, props) {
  if ( /*#__PURE__*/_react["default"].isValidElement(content)) {
    return /*#__PURE__*/_react["default"].cloneElement(content, props);
  }

  if ((0, _isFunction2["default"])(content)) {
    return /*#__PURE__*/_react["default"].createElement(content, props);
  }

  return /*#__PURE__*/_react["default"].createElement(_DefaultTooltipContent.DefaultTooltipContent, props);
}

var Tooltip = /*#__PURE__*/function (_PureComponent) {
  _inherits(Tooltip, _PureComponent);

  var _super = _createSuper(Tooltip);

  function Tooltip() {
    var _this;

    _classCallCheck(this, Tooltip);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      boxWidth: -1,
      boxHeight: -1,
      dismissed: false,
      dismissedAtCoordinate: {
        x: 0,
        y: 0
      }
    };
    _this.wrapperNode = void 0;

    _this.getTranslate = function (_ref) {
      var key = _ref.key,
          tooltipDimension = _ref.tooltipDimension,
          viewBoxDimension = _ref.viewBoxDimension;
      var _this$props = _this.props,
          allowEscapeViewBox = _this$props.allowEscapeViewBox,
          coordinate = _this$props.coordinate,
          offset = _this$props.offset,
          position = _this$props.position,
          viewBox = _this$props.viewBox;

      if (position && (0, _DataUtils.isNumber)(position[key])) {
        return position[key];
      }

      var restricted = coordinate[key] - tooltipDimension - offset;
      var unrestricted = coordinate[key] + offset;

      if (allowEscapeViewBox[key]) {
        return unrestricted;
      }

      var tooltipBoundary = coordinate[key] + tooltipDimension + offset;
      var viewBoxBoundary = viewBox[key] + viewBoxDimension;

      if (tooltipBoundary > viewBoxBoundary) {
        return Math.max(restricted, viewBox[key]);
      }

      return Math.max(unrestricted, viewBox[key]);
    };

    return _this;
  }

  _createClass(Tooltip, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateBBox();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.updateBBox();
    }
  }, {
    key: "updateBBox",
    value: function updateBBox() {
      var _this$state = this.state,
          boxWidth = _this$state.boxWidth,
          boxHeight = _this$state.boxHeight,
          dismissed = _this$state.dismissed;

      if (dismissed) {
        this.wrapperNode.blur();

        if (this.props.coordinate.x !== this.state.dismissedAtCoordinate.x || this.props.coordinate.y !== this.state.dismissedAtCoordinate.y) {
          this.setState({
            dismissed: false
          });
        }
      } else {
        this.wrapperNode.focus();
      }

      if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
        var box = this.wrapperNode.getBoundingClientRect();

        if (Math.abs(box.width - boxWidth) > EPS || Math.abs(box.height - boxHeight) > EPS) {
          this.setState({
            boxWidth: box.width,
            boxHeight: box.height
          });
        }
      } else if (boxWidth !== -1 || boxHeight !== -1) {
        this.setState({
          boxWidth: -1,
          boxHeight: -1
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames,
          _this2 = this;

      var _this$props2 = this.props,
          payload = _this$props2.payload,
          isAnimationActive = _this$props2.isAnimationActive,
          animationDuration = _this$props2.animationDuration,
          animationEasing = _this$props2.animationEasing,
          filterNull = _this$props2.filterNull,
          payloadUniqBy = _this$props2.payloadUniqBy;
      var finalPayload = getUniqPayload(payloadUniqBy, filterNull && payload && payload.length ? payload.filter(function (entry) {
        return !(0, _isNil2["default"])(entry.value);
      }) : payload);
      var hasPayload = finalPayload && finalPayload.length;
      var _this$props3 = this.props,
          content = _this$props3.content,
          viewBox = _this$props3.viewBox,
          coordinate = _this$props3.coordinate,
          position = _this$props3.position,
          active = _this$props3.active,
          wrapperStyle = _this$props3.wrapperStyle;

      var outerStyle = _objectSpread({
        pointerEvents: 'none',
        visibility: !this.state.dismissed && active && hasPayload ? 'visible' : 'hidden',
        position: 'absolute',
        top: 0,
        left: 0
      }, wrapperStyle);

      var translateX, translateY;

      if (position && (0, _DataUtils.isNumber)(position.x) && (0, _DataUtils.isNumber)(position.y)) {
        translateX = position.x;
        translateY = position.y;
      } else {
        var _this$state2 = this.state,
            boxWidth = _this$state2.boxWidth,
            boxHeight = _this$state2.boxHeight;

        if (boxWidth > 0 && boxHeight > 0 && coordinate) {
          translateX = this.getTranslate({
            key: 'x',
            tooltipDimension: boxWidth,
            viewBoxDimension: viewBox.width
          });
          translateY = this.getTranslate({
            key: 'y',
            tooltipDimension: boxHeight,
            viewBoxDimension: viewBox.height
          });
        } else {
          outerStyle.visibility = 'hidden';
        }
      }

      outerStyle = _objectSpread(_objectSpread({}, (0, _reactSmooth.translateStyle)({
        transform: this.props.useTranslate3d ? "translate3d(".concat(translateX, "px, ").concat(translateY, "px, 0)") : "translate(".concat(translateX, "px, ").concat(translateY, "px)")
      })), outerStyle);

      if (isAnimationActive && active) {
        outerStyle = _objectSpread(_objectSpread({}, (0, _reactSmooth.translateStyle)({
          transition: "transform ".concat(animationDuration, "ms ").concat(animationEasing)
        })), outerStyle);
      }

      var cls = (0, _classnames["default"])(CLS_PREFIX, (_classNames = {}, _defineProperty(_classNames, "".concat(CLS_PREFIX, "-right"), (0, _DataUtils.isNumber)(translateX) && coordinate && (0, _DataUtils.isNumber)(coordinate.x) && translateX >= coordinate.x), _defineProperty(_classNames, "".concat(CLS_PREFIX, "-left"), (0, _DataUtils.isNumber)(translateX) && coordinate && (0, _DataUtils.isNumber)(coordinate.x) && translateX < coordinate.x), _defineProperty(_classNames, "".concat(CLS_PREFIX, "-bottom"), (0, _DataUtils.isNumber)(translateY) && coordinate && (0, _DataUtils.isNumber)(coordinate.y) && translateY >= coordinate.y), _defineProperty(_classNames, "".concat(CLS_PREFIX, "-top"), (0, _DataUtils.isNumber)(translateY) && coordinate && (0, _DataUtils.isNumber)(coordinate.y) && translateY < coordinate.y), _classNames));
      return (
        /*#__PURE__*/
        // ESLint is disabled to allow listening to the `Escape` key. Refer to
        // https://github.com/recharts/recharts/pull/2925
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        _react["default"].createElement("div", {
          tabIndex: -1,
          role: "dialog",
          onKeyDown: function onKeyDown(event) {
            if (event.key === 'Escape') {
              _this2.setState({
                dismissed: true,
                dismissedAtCoordinate: _objectSpread(_objectSpread({}, _this2.state.dismissedAtCoordinate), {}, {
                  x: _this2.props.coordinate.x,
                  y: _this2.props.coordinate.y
                })
              });
            }
          },
          className: cls,
          style: outerStyle,
          ref: function ref(node) {
            _this2.wrapperNode = node;
          }
        }, renderContent(content, _objectSpread(_objectSpread({}, this.props), {}, {
          payload: finalPayload
        })))
      );
    }
  }]);

  return Tooltip;
}(_react.PureComponent);

exports.Tooltip = Tooltip;
Tooltip.displayName = 'Tooltip';
Tooltip.defaultProps = {
  active: false,
  allowEscapeViewBox: {
    x: false,
    y: false
  },
  offset: 10,
  viewBox: {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0
  },
  coordinate: {
    x: 0,
    y: 0
  },
  cursorStyle: {},
  separator: ' : ',
  wrapperStyle: {},
  contentStyle: {},
  itemStyle: {},
  labelStyle: {},
  cursor: true,
  trigger: 'hover',
  isAnimationActive: !_Global.Global.isSsr,
  animationEasing: 'ease',
  animationDuration: 400,
  filterNull: true,
  useTranslate3d: false
};