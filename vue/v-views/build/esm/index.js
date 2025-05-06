import { createElementBlock as U, openBlock as q, mergeProps as fe, renderSlot as S, Fragment as ge, renderList as G, normalizeClass as me, createTextVNode as $, toDisplayString as _e, inject as Y, reactive as W, onBeforeUnmount as ie, defineComponent as N, onMounted as X, onUnmounted as ve, createVNode as f, useSlots as oe, computed as V, toRaw as le, withDirectives as re, vModelText as ae, render as P, provide as Z, watch as ce, onBeforeMount as be, isVNode as ye } from "vue";
import { findParentByLocalName as xe } from "@rainbow_ljy/rainbow-element";
import { arrayRemove as ke, arrayLoopMap as He, animationDebounced as ee, arrayLoop as Ce } from "@rainbow_ljy/rainbow-js";
import { useResizeObserver as ue } from "@rainbow_ljy/v-hooks";
const Ee = ["value"], pe = ["trigger", "value", "onClick"], Le = {
  __name: "index",
  props: {
    trigger: { type: String, default: "click" },
    keyExtractor: { type: Function, default: (e, n) => n },
    listHook: { type: Object, default: () => ({}) }
  },
  setup(e) {
    return (n, c) => {
      var s;
      return q(), U("r-tabs", fe({
        value: e.listHook.value
      }, { ...n.$attrs }), [
        (q(!0), U(ge, null, G(((s = e.listHook) == null ? void 0 : s.list) ?? [], (t, i) => {
          var a, h;
          return q(), U("r-tab-item", {
            key: e.keyExtractor(t, i),
            trigger: e.trigger,
            value: (h = (a = e.listHook) == null ? void 0 : a.formatterValue) == null ? void 0 : h.call(a, t, i),
            class: me(["v-r-tab-item", "v-r-tab-item" + i]),
            onClick: (r) => {
              var l, _;
              return (_ = (l = e.listHook) == null ? void 0 : l.onSelect) == null ? void 0 : _.call(l, t, i);
            }
          }, [
            S(n.$slots, "default", {
              item: t,
              index: i
            }, () => {
              var r, l;
              return [
                $(_e((l = (r = e.listHook) == null ? void 0 : r.formatterLabel) == null ? void 0 : l.call(r, t, i)), 1)
              ];
            })
          ], 10, pe);
        }), 128)),
        S(n.$slots, "active")
      ], 16, Ee);
    };
  }
}, Ue = Le;
function K(e = {}) {
  var a, h;
  const n = Y("RScrollContext") || {}, c = W({
    onScrollTop: () => {
    },
    onScrollBottom: () => {
    },
    onScrollUp: () => {
    },
    onScrollDown: () => {
    },
    onScroll: () => {
    },
    onScrollend: () => {
    },
    onScrollRefresh: () => {
    },
    onScrollRefreshMove: () => {
    },
    onResize: () => {
    },
    onMounted: () => {
    },
    onTouchstart: () => {
    },
    onTouchend: () => {
    },
    onFlotage: () => {
    },
    ...e,
    destroy: i,
    getOffsetTop: s,
    dispatchFlotage: t,
    context: n
  });
  (h = (a = n == null ? void 0 : n.children) == null ? void 0 : a.push) == null || h.call(a, c);
  function s(r, l = 0) {
    return !n.element || !r || (l = l + r.offsetTop, r.offsetParent === n.element) ? l : s(r.offsetParent, l);
  }
  function t(...r) {
    n.children.forEach((l) => {
      l.onFlotage(...r);
    });
  }
  function i() {
    ke(n == null ? void 0 : n.children, c);
  }
  return ie(() => {
    i();
  }), c;
}
function se(e = {}) {
  const n = { ...e }, c = {
    width: t(),
    list: void 0,
    setColumns: r,
    afreshConfig: T,
    push: k,
    layout: B,
    setConfig: y,
    setWidth: s,
    afreshLayout: D,
    getMaxHeightItem: l,
    getMinHeightItem: _,
    setList: i
  };
  i();
  function s() {
    c.width = t();
  }
  function t() {
    return `calc( ${100 / n.columns}% - ${(n.columns - 1) * n.gap / n.columns}px )`;
  }
  function i() {
    c.list = a();
  }
  function a() {
    return He(n.columns, (u) => ({
      height: 0,
      width: c.width,
      left: g(u),
      top: 0,
      children: [],
      index: u
    }));
  }
  function h(u) {
    return n.minAutoWidth ? Math.floor(u / n.minAutoWidth) || 1 : n.columns;
  }
  function r(u) {
    n.columns = h(u), s(), i();
  }
  function l() {
    let u = c.list[0];
    return c.list.forEach((x) => {
      x.height > u.height && (u = x);
    }), u;
  }
  function _(u) {
    if (typeof u == "number") return c.list[u];
    let x = c.list[0];
    return c.list.forEach((E) => {
      E.height < x.height && (x = E);
    }), x;
  }
  function y(u) {
    Object.assign(n, u), n.columns = h(u.width);
  }
  function T(u) {
    y(u), s(), i();
  }
  function D(u, x = []) {
    y(u), s(), B(x);
  }
  function B(u = []) {
    i(), k(...u);
  }
  function k(...u) {
    u.forEach((x) => {
      if (!x || !x.style) return;
      let E = _();
      E.height && (E.height = E.height + n.gap), x.style.left = E.left, x.style.top = E.height + "px", E.height = E.height + x.offsetHeight;
    });
  }
  function g(u) {
    return `calc( ${100 / n.columns * u}% - ${(n.columns - 1) * n.gap / n.columns * u}px + ${u * n.gap}px )`;
  }
  return c;
}
function Me(e = (t, i) => t.right = i - 1, n = [], c, s) {
  const t = {
    left: 0,
    right: n.length - 1,
    result: -1
  };
  for (; t.left <= t.right; ) {
    const i = Math.floor((t.left + t.right) / 2), a = n[i];
    c(a) ? (t.result = i, e(t, i, a)) : s(a) ? t.left = i + 1 : t.right = i - 1;
  }
  return t.result;
}
function de(e = [], n, c) {
  return Me(
    (s, t) => {
      s.right = t - 1;
    },
    e,
    n,
    c
  );
}
const qe = /* @__PURE__ */ N({
  props: {
    triggerBottomDistance: {
      type: Number,
      default: 500
    },
    loadingHook: {
      type: Object,
      default: () => ({})
    },
    onErrorLoadClick: {
      type: Function
    },
    onBeginErrorClick: {
      type: Function
    }
  },
  emits: ["rollToBottom"],
  setup(e, n) {
    (() => {
      K({
        onScrollDown: g
      });
      function g(u) {
        const x = u.contentHeight - u.containerHeight - e.triggerBottomDistance;
        u.scrollTop >= x && n.emit("rollToBottom", u);
      }
    })();
    let c, s = document.createElement("div");
    X(t), ve(i);
    function t() {
      s = xe(["r-scroll", "r-scroll-view", "r-nested-scroll"], c.$el), s && s.addEventListener("scrollUp", a);
    }
    function i() {
      s && s.removeEventListener("scrollUp", a);
    }
    function a(g) {
      if (!s) return;
      const u = s.scrollHeight - s.offsetHeight - e.triggerBottomDistance;
      s.scrollTop >= u && n.emit("rollToBottom", g);
    }
    function h() {
      return S(n.slots, "loading", {}, () => [f("div", {
        class: "r-pagination-loading-loading"
      }, [f("div", {
        class: "r-pagination-loading-loading-prve"
      }, null), f("div", {
        class: "r-pagination-loading-loading-text"
      }, [$("加载中")]), f("div", {
        class: "r-pagination-loading-loading-next"
      }, null)])]);
    }
    function r() {
      return S(n.slots, "finished", {}, () => [f("div", {
        class: "r-pagination-loading-finished"
      }, [f("div", {
        class: "r-pagination-loading-finished-prve"
      }, null), f("div", {
        class: "r-pagination-loading-finished-text"
      }, [$("没有更多的了")]), f("div", {
        class: "r-pagination-loading-finished-next"
      }, null)])]);
    }
    function l() {
      return S(n.slots, "empty", {}, () => [f("div", {
        class: "r-pagination-loading-empty"
      }, [f("div", {
        class: "r-pagination-loading-empty-prve"
      }, null), f("div", {
        class: "r-pagination-loading-empty-text"
      }, [$("暂无相关数据，试试其他条件吧")]), f("div", {
        class: "r-pagination-loading-empty-next"
      }, null)])]);
    }
    function _() {
      return S(n.slots, "begin", {}, () => [f("div", {
        class: "r-pagination-loading-begin"
      }, [f("div", {
        class: "r-pagination-loading-begin-loading"
      }, [f("div", {
        class: "r-pagination-loading-begin-prve"
      }, null), f("div", {
        class: "r-pagination-loading-begin-text"
      }, [$("加载中")]), f("div", {
        class: "r-pagination-loading-begin-next"
      }, null)]), f("div", {
        class: "r-pagination-loading-begin-skeleton"
      }, [G(10, () => f("div", {
        class: "r-pagination-loading-begin-skeleton-item"
      }, null))])])]);
    }
    function y() {
      var g, u;
      e.onBeginErrorClick ? e.onBeginErrorClick(...arg) : (u = (g = e.loadingHook) == null ? void 0 : g.nextBeginSend) == null || u.call(g);
    }
    function T() {
      return S(n.slots, "error", {}, () => [f("div", {
        class: "r-pagination-loading-begin-error",
        onClick: y
      }, [f("div", {
        class: "r-pagination-loading-begin-error-prve"
      }, null), f("div", {
        class: "r-pagination-loading-begin-error-text"
      }, [$("出错了 点击重新加载")]), f("div", {
        class: "r-pagination-loading-begin-error-next"
      }, null)])]);
    }
    function D(...g) {
      var u, x;
      e.onErrorLoadClick ? e.onErrorLoadClick(...g) : (x = (u = e.loadingHook) == null ? void 0 : u.awaitSend) == null || x.call(u);
    }
    function B() {
      return S(n.slots, "errorLoad", {}, () => [f("div", {
        class: "r-pagination-loading-error",
        onClick: D
      }, [f("div", {
        class: "r-pagination-loading-error-prve"
      }, null), f("div", {
        class: "r-pagination-loading-error-text"
      }, [$("出错了 点击重新加载")]), f("div", {
        class: "r-pagination-loading-error-next"
      }, null)])]);
    }
    function k() {
      const g = e.loadingHook;
      if (g.begin === !0 && g.error === !0) return T();
      if (g.error === !0) return B();
      if (g.begin === !0) return _();
      if (g.empty === !0 && g.finished === !0) return l();
      if (g.finished === !0) return r();
      if (g.loading === !0) return h();
    }
    return (g, u) => {
      var x, E;
      return c = g, [(E = (x = n.slots) == null ? void 0 : x.default) == null ? void 0 : E.call(x), k()];
    };
  }
}), we = ["keyExtractor"], Ie = {
  __name: "index",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    keyExtractor: {
      type: Function,
      default: (e) => e.item
    },
    listHook: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(e, {
    emit: n
  }) {
    const c = oe(), s = n, t = e, i = V({
      set(l) {
        if (t.listHook.list) return t.listHook.list = l;
        s("update:modelValue", l);
      },
      get() {
        return t.listHook.list ? t.listHook.list : le(t.modelValue);
      }
    }), a = V(() => t.listHook.list ? t.listHook.list : t.modelValue), h = /* @__PURE__ */ N({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(l) {
        return () => {
          var _, y;
          return (y = (_ = l == null ? void 0 : l.slots) == null ? void 0 : _.item) == null ? void 0 : y.call(_, l.event);
        };
      }
    });
    function r(l) {
      l.item = a.value[l.index], P(f(h, {
        event: l,
        slots: c,
        key: t.keyExtractor(l),
        "data-key": t.keyExtractor(l)
      }, null), l.ele);
    }
    return (l, _) => re((q(), U("r-scroll-virtual-grid-list", {
      "onUpdate:modelValue": _[0] || (_[0] = (y) => i.value = y),
      onrenderItems: r,
      keyExtractor: t.keyExtractor
    }, [S(l.$slots, "default")], 8, we)), [[ae, i.value]]);
  }
}, We = Ie, Te = ["keyExtractor"], Be = {
  __name: "index",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    keyExtractor: {
      type: Function,
      default: (e) => e.item
    },
    listHook: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(e, {
    emit: n
  }) {
    const c = oe(), s = n, t = e, i = V({
      set(l) {
        if (t.listHook.list) return t.listHook.list = l;
        s("update:modelValue", l);
      },
      get() {
        return t.listHook.list ? t.listHook.list : le(t.modelValue);
      }
    }), a = V(() => t.listHook.list ? t.listHook.list : t.modelValue), h = /* @__PURE__ */ N({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(l) {
        return X(() => {
        }), () => {
          var _, y;
          return (y = (_ = l == null ? void 0 : l.slots) == null ? void 0 : _.item) == null ? void 0 : y.call(_, l.event);
        };
      }
    });
    function r(l) {
      l.item = a.value[l.index], P(f(h, {
        event: l,
        slots: c,
        key: t.keyExtractor(l),
        "data-key": t.keyExtractor(l)
      }, null), l.ele);
    }
    return (l, _) => re((q(), U("r-scroll-virtual-falls-list", {
      "onUpdate:modelValue": _[0] || (_[0] = (y) => i.value = y),
      onrenderItems: r,
      keyExtractor: t.keyExtractor
    }, [S(l.$slots, "default")], 8, Te)), [[ae, i.value]]);
  }
}, Ge = Be, Ne = {
  avgHeight: {
    type: Number,
    default: 300
  },
  // 每个item高度
  keyExtractor: {
    type: Function,
    default: ({
      index: e
    }) => e
  },
  columns: {
    type: Number,
    default: 1
  },
  // 一行几个item
  gap: {
    type: Number,
    default: 10
  },
  // 列表之间空格的间距
  inline: Boolean,
  minWidth: Number,
  listHook: Object,
  list: Array,
  preLoadsCount: {
    type: Number,
    default: 100
  },
  preLoadCount: {
    type: Number,
    default: 50
  },
  renderCount: {
    type: Number,
    default: 30
  }
}, Se = /* @__PURE__ */ N({
  props: {
    list: Array
  },
  setup(e, n) {
    return () => G(e.list || [], () => null);
  }
}), te = /* @__PURE__ */ N({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(e, n) {
    let c;
    ue(() => c.$el, s);
    function s(t) {
      var h, r, l, _, y;
      const i = ((r = (h = t == null ? void 0 : t[0]) == null ? void 0 : h.target) == null ? void 0 : r.offsetHeight) ?? 0, a = ((_ = (l = e.item) == null ? void 0 : l.__cache__) == null ? void 0 : _.height) ?? 0;
      i !== 0 && a !== i && (y = e.item) != null && y.__cache__ && (e.item.__cache__.height = i, e.item.__cache__.isResize = !0, n.emit("heightChange", i, a, t));
    }
    return (t) => {
      var i, a;
      return c = t, f("div", {
        class: "r-scroll-virtual-falls-list-item-content"
      }, [(a = (i = e == null ? void 0 : e.slots) == null ? void 0 : i.default) == null ? void 0 : a.call(i, e)]);
    };
  }
}), Xe = /* @__PURE__ */ N({
  props: {
    ...Ne
  },
  setup(e, n) {
    const c = se(e), s = V(() => (e.listHook ? e.listHook.list : e.list) || []);
    let t = !1, i, a = 0, h = c.getMinHeightItem(), r = {
      nodeMap: /* @__PURE__ */ new Map(),
      currentDivNode: void 0,
      item: void 0
    };
    const l = W({
      nodeMap: /* @__PURE__ */ new Map(),
      index: 0,
      list: []
    }), _ = m(), y = W({
      context: n,
      slots: n.slots,
      renderItems: E,
      layout: F
    });
    Z("RScrollVirtualFallsListContext", y), n.expose(y), ce(() => s.value.slice(l.index, l.index + e.renderCount), p);
    const T = K({
      onScroll: M,
      onResize: L
    }), D = () => {
      var d, o;
      return ((o = (d = T == null ? void 0 : T.context) == null ? void 0 : d.element) == null ? void 0 : o.scrollTop) ?? 0;
    }, B = V(() => s.value.length ? (e.avgHeight + e.gap) * Math.ceil(s.value.length / e.columns) - e.gap : 0), k = () => -window.innerHeight + T.getOffsetTop(i), g = () => window.innerHeight * 2 + T.getOffsetTop(i);
    function u(d) {
      return de(s.value, (o) => o.__cache__ ? o.__cache__.vTop <= d && d <= o.__cache__.vBottom : !1, (o) => o.__cache__ ? o.__cache__.vTop < d : !1);
    }
    function x(d) {
      var A, O, H;
      const o = s.value[a];
      if (!o) return;
      let C = h;
      o.__cache__ || (o.__cache__ = {}), o.__cache__.columns = c.list.map((w) => ({
        ...w
      })), C.height && (C.height = C.height + e.gap), o.__cache__.top = C.height, o.__cache__.left = C.left, o.__cache__.width = C.width, o.__cache__.columnIndex = C.index, o.__cache__.index = a;
      let b;
      r.nodeMap.has(o) ? (b = r.nodeMap.get(o), b.setAttribute("data-index", a), P(f(te, {
        item: o,
        index: a,
        slots: n.slots,
        key: e.keyExtractor({
          item: o,
          index: a
        }),
        onHeightChange: I
      }, null), b), r.currentDivNode && (r.currentDivNode.nextSibling === b || i.insertBefore(b, r.currentDivNode.nextSibling)), r.currentDivNode = b, r.nodeMap.delete(o)) : (b = document.createElement("div"), b.setAttribute("data-index", a), b.classList.add("r-scroll-virtual-falls-list-item"), P(f(te, {
        item: o,
        index: a,
        slots: n.slots,
        key: e.keyExtractor({
          item: o,
          index: a
        }),
        onHeightChange: I
      }, null), b), r.currentDivNode ? (i.insertBefore(b, r.currentDivNode.nextSibling), r.currentDivNode = b) : (i.insertBefore(b, i.firstChild), r.currentDivNode = b)), b.style.top = ((A = o == null ? void 0 : o.__cache__) == null ? void 0 : A.top) + "px", b.style.left = (O = o == null ? void 0 : o.__cache__) == null ? void 0 : O.left, b.style.width = (H = o == null ? void 0 : o.__cache__) == null ? void 0 : H.width, o.__cache__.height = b.offsetHeight, C.height = C.height + b.offsetHeight, o.__cache__.bottom = C.height, o.__cache__.vTop = o.__cache__.top + k(), o.__cache__.vBottom = o.__cache__.bottom + g(), o.__cache__.columns2 = c.list.map((w) => ({
        ...w
      })), a++, h = c.getMinHeightItem(), l.nodeMap.set(o, b);
    }
    function E() {
      let d = 0;
      for (l.nodeMap = /* @__PURE__ */ new Map(), r.currentDivNode = void 0, _.stop(); d < e.renderCount; )
        x(), d++;
      r.nodeMap.forEach((o) => {
        o.remove();
      }), r.currentDivNode = void 0, r.nodeMap = l.nodeMap, j(), _.start();
    }
    function F(d) {
      let o = u(D());
      o === -1 && (o = 0);
      let C = s.value[o];
      if (!C || !d && r.item === C) return;
      a = o, t = !0, l.index = a;
      let b = C.__cache__;
      o === 0 ? (c.setList(), h = c.getMinHeightItem()) : (c.list = b.columns, h = c.getMinHeightItem(b.columnIndex)), r.item = C, E(), t = !1;
    }
    function R() {
      F(!0);
    }
    function z() {
      const d = s.value[a];
      if (!d) return;
      let o = h;
      d.__cache__ || (d.__cache__ = {});
      const C = d.__cache__.height || e.avgHeight;
      d.__cache__.columns = c.list.map((b) => ({
        ...b
      })), o.height && (o.height = o.height + e.gap), d.__cache__.top = o.height, d.__cache__.left = o.left, d.__cache__.width = o.width, d.__cache__.columnIndex = o.index, d.__cache__.index = a, d.__cache__.height = C, o.height = o.height + C, d.__cache__.bottom = o.height, d.__cache__.columns2 = c.list.map((b) => ({
        ...b
      })), d.__cache__.vTop = d.__cache__.top + k(), d.__cache__.vBottom = d.__cache__.bottom + g(), a++, h = c.getMinHeightItem();
    }
    function j(d = e.preLoadsCount) {
      let o = 0;
      for (; o < d; )
        z(), o++;
    }
    function v() {
      var C, b;
      const d = (b = (C = s.value.at(-1)) == null ? void 0 : C.__cache__) == null ? void 0 : b.columns2;
      if (!d) return B.value;
      let o = d[0];
      return d.forEach((A) => {
        A.height > o.height && (o = A);
      }), o.height;
    }
    function m() {
      let d;
      function o(O) {
        if (a >= s.value.length) {
          b();
          return;
        }
        O.timeRemaining() > 0 && (j(e.preLoadCount), O.didTimeout || (d = requestIdleCallback(o)));
      }
      function C() {
        d = requestIdleCallback(o);
      }
      function b() {
        cancelIdleCallback(d);
      }
      function A() {
        requestIdleCallback(o);
      }
      return {
        start: C,
        stop: b,
        trigger: A
      };
    }
    X(() => {
      E();
    });
    function I() {
      R();
    }
    function M() {
      F();
    }
    function L() {
      F();
    }
    function p() {
      t || R();
    }
    return () => f("div", null, [f(Se, {
      list: s.value.slice(l.index, l.index + e.renderCount)
    }, null), f("div", {
      style: {
        height: v() + "px"
      },
      "data-length": s.value.length,
      ref: (d) => i = d,
      class: "r-scroll-virtual-falls-list"
    }, null)]);
  }
}), Ve = {
  avgHeight: {
    type: Number,
    default: 200
  },
  // 每个item高度
  keyExtractor: {
    type: Function,
    default: ({
      index: e
    }) => e
  },
  columns: {
    type: Number,
    default: 1
  },
  // 一行几个item
  gap: {
    type: Number,
    default: 10
  },
  // 列表之间空格的间距
  inline: Boolean,
  minWidth: Number,
  listHook: Object,
  list: Array,
  preLoadsCount: {
    type: Number,
    default: 100
  },
  renderCount: {
    type: Number,
    default: 30
  }
}, De = /* @__PURE__ */ N({
  props: {
    list: Array
  },
  setup(e, n) {
    return () => (G(e.list || [], (c, s) => null), null);
  }
}), Fe = /* @__PURE__ */ N({
  props: {
    list: Array
  },
  setup(e, n) {
    return () => f(De, {
      list: e.list
    }, null);
  }
}), ne = /* @__PURE__ */ N({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(e, n) {
    let c;
    ue(() => c.$el, s);
    function s(t) {
      var h, r, l, _, y;
      const i = ((r = (h = t == null ? void 0 : t[0]) == null ? void 0 : h.target) == null ? void 0 : r.offsetHeight) ?? 0, a = ((_ = (l = e.item) == null ? void 0 : l.__cache__) == null ? void 0 : _.height) ?? 0;
      i !== 0 && a !== i && (y = e.item) != null && y.__cache__ && (e.item.__cache__.height = i, e.item.__cache__.isResize = !0, n.emit("heightChange", i, a, t));
    }
    return (t) => {
      var i, a;
      return c = t, f("div", {
        class: "r-scroll-virtual-falls-list-item-content"
      }, [(a = (i = e == null ? void 0 : e.slots) == null ? void 0 : i.default) == null ? void 0 : a.call(i, e)]);
    };
  }
}), Je = /* @__PURE__ */ N({
  props: {
    ...Ve
  },
  setup(e, n) {
    let c, s = !1;
    const t = se(e), i = V(() => (e.listHook ? e.listHook.list : e.list) || []), a = F(), h = {
      nodeMap: /* @__PURE__ */ new Map(),
      DivPointer: void 0,
      item: void 0
    }, r = W({
      context: n,
      slots: n.slots,
      index: 0,
      endIndex: 0,
      column: t.getMinHeightItem(),
      endColumn: t.getMinHeightItem(),
      nodeMap: /* @__PURE__ */ new Map(),
      renderList: [],
      renderItems: g
    });
    Z("RScrollVirtualFallsListContext", r), n.expose(r);
    const l = ee(j), _ = ee(R), y = K({
      onScroll: z,
      onResize: l
    }), T = () => {
      var v, m;
      return ((m = (v = y == null ? void 0 : y.context) == null ? void 0 : v.element) == null ? void 0 : m.scrollTop) ?? 0;
    }, D = V(() => i.value.length ? (e.avgHeight + e.gap) * Math.ceil(i.value.length / e.columns) - e.gap : 0), B = () => -window.innerHeight + y.getOffsetTop(c), k = () => window.innerHeight * 2 + y.getOffsetTop(c);
    function g() {
      if (!c) return;
      a.stop();
      let v = r.column;
      r.nodeMap = /* @__PURE__ */ new Map(), h.DivPointer = void 0, r.renderList.forEach((m, I) => {
        m.__cache__ || (m.__cache__ = {});
        const M = r.index + I, L = m.__cache__;
        L.columns = t.list.map((d) => ({
          ...d
        })), v.height && (v.height = v.height + e.gap), L.top = v.height, L.left = v.left, L.width = v.width, L.columnIndex = v.index;
        let p;
        h.nodeMap.has(m) ? (p = h.nodeMap.get(m), p.setAttribute("data-index", M), P(f(ne, {
          item: m,
          index: M,
          slots: n.slots,
          key: e.keyExtractor({
            item: m,
            index: M
          }),
          onHeightChange: _
        }, null), p), h.DivPointer && (h.DivPointer.nextSibling === p || c.insertBefore(p, h.DivPointer.nextSibling)), h.DivPointer = p, h.nodeMap.delete(m)) : (p = document.createElement("div"), p.setAttribute("data-index", M), p.classList.add("r-scroll-virtual-falls-list-item"), P(f(ne, {
          item: m,
          index: M,
          slots: n.slots,
          key: e.keyExtractor({
            item: m,
            index: M
          }),
          onHeightChange: _
        }, null), p), h.DivPointer ? (c.insertBefore(p, h.DivPointer.nextSibling), h.DivPointer = p) : (c.insertBefore(p, c.firstChild), h.DivPointer = p)), p.style.top = L.top + "px", p.style.left = L.left, p.style.width = L.width, L.height = p.offsetHeight, v.height = v.height + p.offsetHeight, L.bottom = v.height, L.vTop = L.top + B(), L.vBottom = L.bottom + k(), L.columns2 = t.list.map((d) => ({
          ...d
        })), r.endIndex = M + 1, v = t.getMinHeightItem(), r.endColumn = v, r.nodeMap.set(m, p);
      }), h.nodeMap.forEach((m) => m.remove()), h.DivPointer = void 0, h.nodeMap = r.nodeMap, s = !1, a.rePreLoads(), a.start();
    }
    function u(v) {
      let m = x(T());
      m === -1 && (m = 0);
      let I = i.value[m];
      if (!I || !v && h.item === I) return;
      s = !0, r.index = m;
      let M = I.__cache__;
      m === 0 ? (t.setList(), r.column = t.getMinHeightItem()) : (t.list = M.columns, r.column = t.getMinHeightItem(M.columnIndex)), r.renderList = i.value.slice(r.index, r.index + e.renderCount), h.item = I, g();
    }
    function x(v) {
      return de(i.value, (m) => m.__cache__ ? m.__cache__.vTop <= v && v <= m.__cache__.vBottom : !1, (m) => m.__cache__ ? m.__cache__.vTop < v : !1);
    }
    function E() {
      var I, M;
      const v = (M = (I = i.value.at(-1)) == null ? void 0 : I.__cache__) == null ? void 0 : M.columns2;
      if (!v) return D.value;
      let m = v[0];
      return v.forEach((L) => {
        L.height > m.height && (m = L);
      }), m.height;
    }
    function F() {
      let v, m = 0, I;
      const M = requestIdleCallback || requestAnimationFrame, L = requestIdleCallback ? cancelIdleCallback : cancelAnimationFrame;
      function p() {
        m = r.endIndex, I = r.endColumn, o();
      }
      function d() {
        const H = i.value[m];
        if (!H) return;
        let w = I;
        H.__cache__ || (H.__cache__ = {});
        const J = H.__cache__.height || e.avgHeight;
        H.__cache__.columns = t.list.map((Q) => ({
          ...Q
        })), w.height && (w.height = w.height + e.gap), H.__cache__.top = w.height, H.__cache__.left = w.left, H.__cache__.width = w.width, H.__cache__.columnIndex = w.index, H.__cache__.height = J, w.height = w.height + J, H.__cache__.bottom = w.height, H.__cache__.columns2 = t.list.map((Q) => ({
          ...Q
        })), H.__cache__.vTop = H.__cache__.top + B(), H.__cache__.vBottom = H.__cache__.bottom + k(), m++, I = t.getMinHeightItem();
      }
      function o(H = e.preLoadsCount) {
        let w = 0;
        for (; w < e.preLoadsCount; )
          d(), w++;
      }
      function C(H) {
        if (m >= i.value.length) {
          A();
          return;
        }
        if (typeof H == "object" && H.timeRemaining && H.timeRemaining() > 0 || typeof H == "number") {
          try {
            o(10);
          } catch (J) {
            console.error("Error in callback:", J);
          }
          (typeof H == "object" && !H.didTimeout || typeof H == "number") && (v = M(C));
        }
      }
      function b() {
        v = M(C);
      }
      function A() {
        v && (L(v), v = null);
      }
      function O() {
        M(C);
      }
      return {
        start: b,
        stop: A,
        trigger: O,
        preLoads: o,
        preLoad: d,
        rePreLoads: p
      };
    }
    X(() => {
    }), ie(() => {
      a.stop();
    });
    function R() {
      u(!0);
    }
    function z() {
      u();
    }
    function j() {
      u(!0);
    }
    return ce(() => i.value.slice(r.index, r.index + e.renderCount), () => {
      s || u(!0);
    }), () => f("div", null, [f(Fe, {
      list: i.value.slice(r.index, r.index + e.renderCount)
    }, null), f("div", {
      style: {
        height: E() + "px"
      },
      "data-length": i.value.length,
      ref: (v) => c = v,
      class: "r-scroll-virtual-falls-list"
    }, null)]);
  }
});
function Re(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !ye(e);
}
const he = {
  bothEndsHeight: {
    type: Number,
    default: 0
  },
  //列表 两端的高度
  avgHeight: {
    type: Number,
    default: 120
  },
  // 每个item高度
  keyExtractor: {
    type: Function,
    default: ({
      index: e
    }) => e
  },
  columns: {
    type: Number,
    default: 1
  },
  // 一行几个item
  gap: {
    type: Number,
    default: 10
  },
  // 列表之间空格的间距
  minAutoWidth: Number,
  listHook: Object,
  list: Array,
  openAnimationFrame: Boolean
  //
}, Ae = /* @__PURE__ */ N({
  props: {
    item: [Object, Array, String, Number],
    index: Number
  },
  setup(e, n) {
    const c = Y("RScrollVirtualGridListContext") || {};
    let s;
    const t = new IntersectionObserver(([a]) => {
      a.isIntersecting && (c.context.emit("itemVisible", e), i());
    });
    function i() {
      typeof e.item == "object" && e.item.__markVisible !== c.markVisible && (e.item.__markVisible = c.markVisible, c.context.emit("itemMarkVisible", e));
    }
    return X(() => {
      t.observe(s);
    }), be(() => {
      t.disconnect();
    }), () => f("div", {
      ref: (a) => s = a
    }, [S(n.slots, "default", e)]);
  }
}), Oe = /* @__PURE__ */ N({
  props: {
    ...he
  },
  setup(e, n) {
    const c = Y("RScrollVirtualGridListContext") || {};
    function s(t) {
      typeof t.item == "object" && t.item.__markCount !== c.markCount && (t.item.__markCount = c.markCount, c.context.emit("itemMarkRender", t));
    }
    return () => G(c.renderList, (t, i) => {
      let a;
      return s(t), f(Ae, {
        "data-index": t.index,
        class: "r-scroll-virtual-grid-list-item",
        style: t.style,
        item: t.item,
        index: t.index,
        key: e.keyExtractor(t)
      }, Re(a = S(c.slots, "default", t)) ? a : {
        default: () => [a]
      });
    });
  }
}), Ke = /* @__PURE__ */ N({
  props: {
    ...he
  },
  emits: ["itemMarkRender", "itemMarkVisible", "itemVisible"],
  setup(e, n) {
    let c = {
      index: void 0
    }, s;
    const t = () => window.innerHeight, i = V(() => `calc( ${100 / e.columns}% - ${(e.columns - 1) * e.gap / e.columns}px )`), a = V(() => (e.listHook ? e.listHook.list : e.list) || []), h = V(() => a.value.length ? (e.avgHeight + e.gap) * Math.ceil(a.value.length / e.columns) - e.gap + e.bothEndsHeight * 2 : 0), r = K({
      onScroll(k, g) {
        B();
      },
      onResize(k, g) {
        B();
      }
    }), l = W({
      context: n,
      slots: n.slots,
      itemWidth: i,
      height: h,
      renderList: [],
      markCount: 0,
      markVisible: 0
      // onRender: () => undefined,
      // addMarkCount() {
      //   mCtx.markCount++;
      // },
      // doAddMark() {
      //   mCtx.addMarkCount();
      //   mCtx.doMark();
      // },
      // doMark() {
      //   mCtx.renderList.forEach(({ item }) => {
      //     item.__markCount = mCtx.markCount;
      //   });
      // },
    });
    Z("RScrollVirtualGridListContext", l), n.expose(l);
    function _(k) {
      return `calc( ${100 / e.columns * k}% - ${(e.columns - 1) * e.gap / e.columns * k}px + ${k * e.gap}px )`;
    }
    function y(k, g = 0, u = []) {
      return r.context.element.scrollTop, r.getOffsetTop(s), k >= a.value.length ? u : (Ce(e.columns, (x) => {
        if (k >= 0) {
          const E = Math.floor(k / e.columns);
          let F = E * (e.avgHeight + e.gap) + e.bothEndsHeight + "px";
          E === 0 && (F = e.bothEndsHeight + "px");
          const R = _(x), z = i.value, j = e.avgHeight + "px";
          u.push({
            index: k,
            style: {
              top: F,
              left: R,
              width: z,
              height: j
            },
            item: a.value[k]
          });
        }
        k++;
      }), g = g + e.avgHeight + e.gap, g < window.innerHeight + t() * 2 ? y(k, g, u) : u);
    }
    function T(k = !0) {
      if (!r.context.element) return;
      const g = r.context.element.scrollTop, u = r.getOffsetTop(s);
      if (u - g - window.innerHeight - t() > 0) return;
      let E = Math.floor(t() / (e.avgHeight + e.gap)) * e.columns, R = Math.floor((g - u) / (e.avgHeight + e.gap)) * e.columns - E;
      c.index === R && k || (c.index = R, l.renderList = y(R));
    }
    let D;
    function B(k = !0) {
      if (!e.openAnimationFrame) return T(k);
      cancelAnimationFrame(D), D = requestAnimationFrame(() => {
        T(k);
      });
    }
    return () => (B(!1), f("div", {
      "data-length": a.value.length,
      ref: (k) => s = k,
      style: {
        height: h.value + "px"
      },
      class: "r-scroll-virtual-grid-list"
    }, [f(Oe, {
      keyExtractor: e.keyExtractor
    }, null)]));
  }
});
export {
  Xe as RScrollVirtualFallsListV2,
  Je as RScrollVirtualFallsListV3,
  Ke as RScrollVirtualGridList,
  qe as VRPaginationLoading,
  Ue as VRTabs,
  Ge as VRVirtualFallsList,
  We as VRVirtualGridList
};
//# sourceMappingURL=index.js.map
