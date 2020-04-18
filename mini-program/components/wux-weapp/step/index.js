"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
  _classNames2 = _interopRequireDefault(require("../helpers/classNames"));

function _interopRequireDefault(t) {
  return t && t.__esModule ? t : {
    default: t
  }
}

function _defineProperty(t, e, n) {
  return e in t ? Object.defineProperty(t, e, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = n, t
}
var defaultStatus = ["wait", "process", "finish", "error"],
  defaultIcon = "ios-checkmark";
(0, _baseComponent.default)({
  relations: {
    "../steps/index": {
      type: "parent"
    }
  },
  properties: {
    prefixCls: {
      type: String,
      value: "wux-step"
    },
    status: {
      type: String,
      value: ""
    },
    title: {
      type: String,
      value: ""
    },
    content: {
      type: String,
      value: ""
    },
    icon: {
      type: String,
      value: ""
    }
  },
  data: {
    width: "100%",
    length: 1,
    index: 0,
    current: 0,
    direction: "horizontal"
  },
  computed: {
    classes: ["prefixCls, direction", function (t, e) {
      return {
        wrap: (0, _classNames2.default)(t, _defineProperty({}, "".concat(t, "--").concat(e), e)),
        hd: "".concat(t, "__hd"),
        icon: "".concat(t, "__icon"),
        thumb: "".concat(t, "__thumb"),
        bd: "".concat(t, "__bd"),
        title: "".concat(t, "__title"),
        content: "".concat(t, "__content"),
        ft: "".concat(t, "__ft")
      }
    }]
  },
  methods: {
    updateCurrent: function (t) {
      var e = 0 < arguments.length && void 0 !== t ? t : {},
        n = "horizontal" === e.direction ? 100 / e.length + "%" : "100%",
        a = defaultStatus.indexOf(this.data.status),
        i = e.index < e.current || this.data.icon,
        r = this.data.icon || defaultIcon,
        c = -1 !== a ? defaultStatus[a] : e.index < e.current ? "finish" : e.index === e.current ? "process" : "",
        o = "".concat(this.data.prefixCls, "--").concat(c),
        s = Object.assign({
          width: n,
          className: o,
          hasIcon: i,
          thumb: r
        }, e);
      this.setData(s)
    }
  },
  attached: function () {
    this.updateCurrent(this.data)
  }
});