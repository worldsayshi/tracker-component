'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tracker = void 0;if (!Package['tracker']) throw new Error('Tracker is required for Tracker.Component (add it with: `meteor add tracker`).');else Tracker = Package['tracker'].Tracker;

Tracker.Component = function (_React$Component) {
  (0, _inherits3.default)(_class, _React$Component);

  function _class(props) {
    (0, _classCallCheck3.default)(this, _class);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_class).call(this, props));

    _this.__subs = {}, _this.__comps = {};_this.__allcomps = [];_this.__live = false;
    _this.__subscribe = props && props.subscribe || Meteor.subscribe;
    return _this;
  }

  (0, _createClass3.default)(_class, [{
    key: 'subscribe',
    value: function subscribe(name) {
      for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        options[_key - 1] = arguments[_key];
      }

      return this.__subs[(0, _stringify2.default)(arguments)] = this.__subscribe.apply(this, [name].concat(options));
    }
  }, {
    key: 'autorun',
    value: function autorun(fn) {
      var _this2 = this;

      this.__stateKeys = [];
      var c = Tracker.autorun(function (c) {
        _this2.__live = true;fn(c);_this2.__live = false;
      });
      this.__allcomps.push(c);
      this.__stateKeys.forEach(function (stateKey) {
        _this2.__comps[stateKey] = [].concat((0, _toConsumableArray3.default)(_this2.__comps[stateKey]), [c]);
      });

      this.__stateKeys = null;
    }
  }, {
    key: 'getState',
    value: function getState(stateKey) {
      this.__stateKeys.push(stateKey);
      return this.state[stateKey];
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      // Always invalidate when props are changed
      // Assuming that the reference will change when the props change!
      if (prevProps !== this.props) {
        this.__allcomps.forEach(function (c) {
          c.invalidate();
        });
      }
    }
  }, {
    key: 'subscriptionsReady',
    value: function subscriptionsReady() {
      var _this3 = this;

      return !(0, _keys2.default)(this.__subs).some(function (id) {
        return !_this3.__subs[id].ready();
      });
    }
  }, {
    key: 'setState',
    value: function setState(state) {
      var _this4 = this;

      (0, _keys2.default)(state).forEach(function (stateKey) {
        return _this4.__comps[stateKey] && _this4.__comps[stateKey].forEach(function (c) {
          return c.invalidate();
        });
      });

      if (!this._reactInternalInstance) {
        return this.state = (0, _assign2.default)({}, this.state, state);
      } else {
        return (0, _get3.default)((0, _getPrototypeOf2.default)(_class.prototype), 'setState', this).apply(this, arguments);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this5 = this;

      (0, _keys2.default)(this.__subs).forEach(function (sub) {
        return _this5.__subs[sub].stop();
      });
      (0, _keys2.default)(this.__comps).forEach(function (stateKey) {
        return _this5.__comps[stateKey] && _this5.__comps[stateKey].forEach(function (c) {
          return c.stop();
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var children = this.props.children;

      var comp = (children instanceof Array ? children : [children]).map(function (c) {
        return _react2.default.cloneElement(c, _this6.state);
      });
      return comp.length == 1 ? comp[0] : _react2.default.createElement(
        'div',
        null,
        comp
      );
    }
  }]);
  return _class;
}(_react2.default.Component);

exports.default = Tracker;