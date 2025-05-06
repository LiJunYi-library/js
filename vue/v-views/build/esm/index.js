import { createElementBlock as U, openBlock as W, mergeProps as de, renderSlot as S, Fragment as he, renderList as G, normalizeClass as fe, createTextVNode as O, toDisplayString as ge, inject as K, reactive as q, onBeforeUnmount as te, defineComponent as N, onMounted as X, onUnmounted as me, createVNode as f, useSlots as ne, computed as V, toRaw as ie, withDirectives as oe, vModelText as le, render as P, provide as Q, watch as re, onBeforeMount as _e, isVNode as ve } from "vue";
import { findParentByLocalName as be } from "@rainbow_ljy/rainbow-element";
import { arrayRemove as xe, arrayLoopMap as ye, animationDebounced as Y, arrayLoop as ke } from "@rainbow_ljy/rainbow-js";
import { useResizeObserver as ae } from "@rainbow_ljy/v-hooks";
const He = ["value"], Ce = ["trigger", "value", "onClick"], Ee = {
  __name: "index",
  props: {
    trigger: { type: String, default: "click" },
    keyExtractor: { type: Function, default: (e, n) => n },
    listHook: { type: Object, default: () => ({}) }
  },
  setup(e) {
    return (n, c) => {
      var s;
      return W(), U("r-tabs", de({
        value: e.listHook.value
      }, { ...n.$attrs }), [
        (W(!0), U(he, null, G(((s = e.listHook) == null ? void 0 : s.list) ?? [], (t, i) => {
          var a, h;
          return W(), U("r-tab-item", {
            key: e.keyExtractor(t, i),
            trigger: e.trigger,
            value: (h = (a = e.listHook) == null ? void 0 : a.formatterValue) == null ? void 0 : h.call(a, t, i),
            class: fe(["v-r-tab-item", "v-r-tab-item" + i]),
            onClick: (r) => {
              var o, _;
              return (_ = (o = e.listHook) == null ? void 0 : o.onSelect) == null ? void 0 : _.call(o, t, i);
            }
          }, [
            S(n.$slots, "default", {
              item: t,
              index: i
            }, () => {
              var r, o;
              return [
                O(ge((o = (r = e.listHook) == null ? void 0 : r.formatterLabel) == null ? void 0 : o.call(r, t, i)), 1)
              ];
            })
          ], 10, Ce);
        }), 128)),
        S(n.$slots, "active")
      ], 16, He);
    };
  }
}, Pe = Ee;
function J(e = {}) {
  var a, h;
  const n = K("RScrollContext") || {}, c = q({
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
  function s(r, o = 0) {
    return !n.element || !r || (o = o + r.offsetTop, r.offsetParent === n.element) ? o : s(r.offsetParent, o);
  }
  function t(...r) {
    n.children.forEach((o) => {
      o.onFlotage(...r);
    });
  }
  function i() {
    xe(n == null ? void 0 : n.children, c);
  }
  return te(() => {
    i();
  }), c;
}
function ce(e = {}) {
  const n = { ...e }, c = {
    width: t(),
    list: void 0,
    setColumns: r,
    afreshConfig: B,
    push: k,
    layout: T,
    setConfig: b,
    setWidth: s,
    afreshLayout: D,
    getMaxHeightItem: o,
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
    return ye(n.columns, (u) => ({
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
  function o() {
    let u = c.list[0];
    return c.list.forEach((y) => {
      y.height > u.height && (u = y);
    }), u;
  }
  function _(u) {
    if (typeof u == "number") return c.list[u];
    let y = c.list[0];
    return c.list.forEach((L) => {
      L.height < y.height && (y = L);
    }), y;
  }
  function b(u) {
    Object.assign(n, u), n.columns = h(u.width);
  }
  function B(u) {
    b(u), s(), i();
  }
  function D(u, y = []) {
    b(u), s(), T(y);
  }
  function T(u = []) {
    i(), k(...u);
  }
  function k(...u) {
    u.forEach((y) => {
      if (!y || !y.style) return;
      let L = _();
      L.height && (L.height = L.height + n.gap), y.style.left = L.left, y.style.top = L.height + "px", L.height = L.height + y.offsetHeight;
    });
  }
  function g(u) {
    return `calc( ${100 / n.columns * u}% - ${(n.columns - 1) * n.gap / n.columns * u}px + ${u * n.gap}px )`;
  }
  return c;
}
function Le(e = (t, i) => t.right = i - 1, n = [], c, s) {
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
function ue(e = [], n, c) {
  return Le(
    (s, t) => {
      s.right = t - 1;
    },
    e,
    n,
    c
  );
}
const ze = /* @__PURE__ */ N({
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
      J({
        onScrollDown: g
      });
      function g(u) {
        const y = u.contentHeight - u.containerHeight - e.triggerBottomDistance;
        u.scrollTop >= y && n.emit("rollToBottom", u);
      }
    })();
    let c, s = document.createElement("div");
    X(t), me(i);
    function t() {
      s = be(["r-scroll", "r-scroll-view", "r-nested-scroll"], c.$el), s && s.addEventListener("scrollUp", a);
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
      }, [O("加载中")]), f("div", {
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
      }, [O("没有更多的了")]), f("div", {
        class: "r-pagination-loading-finished-next"
      }, null)])]);
    }
    function o() {
      return S(n.slots, "empty", {}, () => [f("div", {
        class: "r-pagination-loading-empty"
      }, [f("div", {
        class: "r-pagination-loading-empty-prve"
      }, null), f("div", {
        class: "r-pagination-loading-empty-text"
      }, [O("暂无相关数据，试试其他条件吧")]), f("div", {
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
      }, [O("加载中")]), f("div", {
        class: "r-pagination-loading-begin-next"
      }, null)]), f("div", {
        class: "r-pagination-loading-begin-skeleton"
      }, [G(10, () => f("div", {
        class: "r-pagination-loading-begin-skeleton-item"
      }, null))])])]);
    }
    function b() {
      var g, u;
      e.onBeginErrorClick ? e.onBeginErrorClick(...arg) : (u = (g = e.loadingHook) == null ? void 0 : g.nextBeginSend) == null || u.call(g);
    }
    function B() {
      return S(n.slots, "error", {}, () => [f("div", {
        class: "r-pagination-loading-begin-error",
        onClick: b
      }, [f("div", {
        class: "r-pagination-loading-begin-error-prve"
      }, null), f("div", {
        class: "r-pagination-loading-begin-error-text"
      }, [O("出错了 点击重新加载")]), f("div", {
        class: "r-pagination-loading-begin-error-next"
      }, null)])]);
    }
    function D(...g) {
      var u, y;
      e.onErrorLoadClick ? e.onErrorLoadClick(...g) : (y = (u = e.loadingHook) == null ? void 0 : u.awaitSend) == null || y.call(u);
    }
    function T() {
      return S(n.slots, "errorLoad", {}, () => [f("div", {
        class: "r-pagination-loading-error",
        onClick: D
      }, [f("div", {
        class: "r-pagination-loading-error-prve"
      }, null), f("div", {
        class: "r-pagination-loading-error-text"
      }, [O("出错了 点击重新加载")]), f("div", {
        class: "r-pagination-loading-error-next"
      }, null)])]);
    }
    function k() {
      const g = e.loadingHook;
      if (g.begin === !0 && g.error === !0) return B();
      if (g.error === !0) return T();
      if (g.begin === !0) return _();
      if (g.empty === !0 && g.finished === !0) return o();
      if (g.finished === !0) return r();
      if (g.loading === !0) return h();
    }
    return (g, u) => {
      var y, L;
      return c = g, [(L = (y = n.slots) == null ? void 0 : y.default) == null ? void 0 : L.call(y), k()];
    };
  }
}), pe = ["keyExtractor"], Me = {
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
    const c = ne(), s = n, t = e, i = V({
      set(o) {
        if (t.listHook.list) return t.listHook.list = o;
        s("update:modelValue", o);
      },
      get() {
        return t.listHook.list ? t.listHook.list : ie(t.modelValue);
      }
    }), a = V(() => t.listHook.list ? t.listHook.list : t.modelValue), h = /* @__PURE__ */ N({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(o) {
        return () => {
          var _, b;
          return (b = (_ = o == null ? void 0 : o.slots) == null ? void 0 : _.item) == null ? void 0 : b.call(_, o.event);
        };
      }
    });
    function r(o) {
      o.item = a.value[o.index], P(f(h, {
        event: o,
        slots: c,
        key: t.keyExtractor(o),
        "data-key": t.keyExtractor(o)
      }, null), o.ele);
    }
    return (o, _) => oe((W(), U("r-scroll-virtual-grid-list", {
      "onUpdate:modelValue": _[0] || (_[0] = (b) => i.value = b),
      onrenderItems: r,
      keyExtractor: t.keyExtractor
    }, [S(o.$slots, "default")], 8, pe)), [[le, i.value]]);
  }
}, Ue = Me, we = ["keyExtractor"], Ie = {
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
    const c = ne(), s = n, t = e, i = V({
      set(o) {
        if (t.listHook.list) return t.listHook.list = o;
        s("update:modelValue", o);
      },
      get() {
        return t.listHook.list ? t.listHook.list : ie(t.modelValue);
      }
    }), a = V(() => t.listHook.list ? t.listHook.list : t.modelValue), h = /* @__PURE__ */ N({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(o) {
        return X(() => {
        }), () => {
          var _, b;
          return (b = (_ = o == null ? void 0 : o.slots) == null ? void 0 : _.item) == null ? void 0 : b.call(_, o.event);
        };
      }
    });
    function r(o) {
      o.item = a.value[o.index], P(f(h, {
        event: o,
        slots: c,
        key: t.keyExtractor(o),
        "data-key": t.keyExtractor(o)
      }, null), o.ele);
    }
    return (o, _) => oe((W(), U("r-scroll-virtual-falls-list", {
      "onUpdate:modelValue": _[0] || (_[0] = (b) => i.value = b),
      onrenderItems: r,
      keyExtractor: t.keyExtractor
    }, [S(o.$slots, "default")], 8, we)), [[le, i.value]]);
  }
}, We = Ie, Be = {
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
}, Te = /* @__PURE__ */ N({
  props: {
    list: Array
  },
  setup(e, n) {
    return () => G(e.list || [], () => null);
  }
}), Z = /* @__PURE__ */ N({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(e, n) {
    let c;
    ae(() => c.$el, s);
    function s(t) {
      var h, r, o, _, b;
      const i = ((r = (h = t == null ? void 0 : t[0]) == null ? void 0 : h.target) == null ? void 0 : r.offsetHeight) ?? 0, a = ((_ = (o = e.item) == null ? void 0 : o.__cache__) == null ? void 0 : _.height) ?? 0;
      i !== 0 && a !== i && (b = e.item) != null && b.__cache__ && (e.item.__cache__.height = i, e.item.__cache__.isResize = !0, n.emit("heightChange", i, a, t));
    }
    return (t) => {
      var i, a;
      return c = t, f("div", {
        class: "r-scroll-virtual-falls-list-item-content"
      }, [(a = (i = e == null ? void 0 : e.slots) == null ? void 0 : i.default) == null ? void 0 : a.call(i, e)]);
    };
  }
}), qe = /* @__PURE__ */ N({
  props: {
    ...Be
  },
  setup(e, n) {
    const c = ce(e), s = V(() => (e.listHook ? e.listHook.list : e.list) || []);
    let t = !1, i, a = 0, h = c.getMinHeightItem(), r = {
      nodeMap: /* @__PURE__ */ new Map(),
      currentDivNode: void 0,
      item: void 0
    };
    const o = q({
      nodeMap: /* @__PURE__ */ new Map(),
      index: 0,
      list: []
    }), _ = m(), b = q({
      context: n,
      slots: n.slots,
      renderItems: L,
      layout: F
    });
    Q("RScrollVirtualFallsListContext", b), n.expose(b), re(() => s.value.slice(o.index, o.index + e.renderCount), C);
    const B = J({
      onScroll: w,
      onResize: p
    }), D = () => {
      var d, l;
      return ((l = (d = B == null ? void 0 : B.context) == null ? void 0 : d.element) == null ? void 0 : l.scrollTop) ?? 0;
    }, T = V(() => s.value.length ? (e.avgHeight + e.gap) * Math.ceil(s.value.length / e.columns) - e.gap : 0), k = () => -window.innerHeight + B.getOffsetTop(i), g = () => window.innerHeight * 2 + B.getOffsetTop(i);
    function u(d) {
      return ue(s.value, (l) => l.__cache__ ? l.__cache__.vTop <= d && d <= l.__cache__.vBottom : !1, (l) => l.__cache__ ? l.__cache__.vTop < d : !1);
    }
    function y(d) {
      var H, M, j;
      const l = s.value[a];
      if (!l) return;
      let E = h;
      l.__cache__ || (l.__cache__ = {}), l.__cache__.columns = c.list.map((A) => ({
        ...A
      })), E.height && (E.height = E.height + e.gap), l.__cache__.top = E.height, l.__cache__.left = E.left, l.__cache__.width = E.width, l.__cache__.columnIndex = E.index, l.__cache__.index = a;
      let v;
      r.nodeMap.has(l) ? (v = r.nodeMap.get(l), v.setAttribute("data-index", a), P(f(Z, {
        item: l,
        index: a,
        slots: n.slots,
        key: e.keyExtractor({
          item: l,
          index: a
        }),
        onHeightChange: I
      }, null), v), r.currentDivNode && (r.currentDivNode.nextSibling === v || i.insertBefore(v, r.currentDivNode.nextSibling)), r.currentDivNode = v, r.nodeMap.delete(l)) : (v = document.createElement("div"), v.setAttribute("data-index", a), v.classList.add("r-scroll-virtual-falls-list-item"), P(f(Z, {
        item: l,
        index: a,
        slots: n.slots,
        key: e.keyExtractor({
          item: l,
          index: a
        }),
        onHeightChange: I
      }, null), v), r.currentDivNode ? (i.insertBefore(v, r.currentDivNode.nextSibling), r.currentDivNode = v) : (i.insertBefore(v, i.firstChild), r.currentDivNode = v)), v.style.top = ((H = l == null ? void 0 : l.__cache__) == null ? void 0 : H.top) + "px", v.style.left = (M = l == null ? void 0 : l.__cache__) == null ? void 0 : M.left, v.style.width = (j = l == null ? void 0 : l.__cache__) == null ? void 0 : j.width, l.__cache__.height = v.offsetHeight, E.height = E.height + v.offsetHeight, l.__cache__.bottom = E.height, l.__cache__.vTop = l.__cache__.top + k(), l.__cache__.vBottom = l.__cache__.bottom + g(), l.__cache__.columns2 = c.list.map((A) => ({
        ...A
      })), a++, h = c.getMinHeightItem(), o.nodeMap.set(l, v);
    }
    function L() {
      let d = 0;
      for (o.nodeMap = /* @__PURE__ */ new Map(), r.currentDivNode = void 0, _.stop(); d < e.renderCount; )
        y(), d++;
      r.nodeMap.forEach((l) => {
        l.remove();
      }), r.currentDivNode = void 0, r.nodeMap = o.nodeMap, $(), _.start();
    }
    function F(d) {
      let l = u(D());
      l === -1 && (l = 0);
      let E = s.value[l];
      if (!E || !d && r.item === E) return;
      a = l, t = !0, o.index = a;
      let v = E.__cache__;
      l === 0 ? (c.setList(), h = c.getMinHeightItem()) : (c.list = v.columns, h = c.getMinHeightItem(v.columnIndex)), r.item = E, L(), t = !1;
    }
    function R() {
      F(!0);
    }
    function z() {
      const d = s.value[a];
      if (!d) return;
      let l = h;
      d.__cache__ || (d.__cache__ = {});
      const E = d.__cache__.height || e.avgHeight;
      d.__cache__.columns = c.list.map((v) => ({
        ...v
      })), l.height && (l.height = l.height + e.gap), d.__cache__.top = l.height, d.__cache__.left = l.left, d.__cache__.width = l.width, d.__cache__.columnIndex = l.index, d.__cache__.index = a, d.__cache__.height = E, l.height = l.height + E, d.__cache__.bottom = l.height, d.__cache__.columns2 = c.list.map((v) => ({
        ...v
      })), d.__cache__.vTop = d.__cache__.top + k(), d.__cache__.vBottom = d.__cache__.bottom + g(), a++, h = c.getMinHeightItem();
    }
    function $(d = e.preLoadsCount) {
      let l = 0;
      for (; l < d; )
        z(), l++;
    }
    function x() {
      var E, v;
      const d = (v = (E = s.value.at(-1)) == null ? void 0 : E.__cache__) == null ? void 0 : v.columns2;
      if (!d) return T.value;
      let l = d[0];
      return d.forEach((H) => {
        H.height > l.height && (l = H);
      }), l.height;
    }
    function m() {
      let d;
      function l(M) {
        if (a >= s.value.length) {
          v();
          return;
        }
        M.timeRemaining() > 0 && ($(e.preLoadCount), M.didTimeout || (d = requestIdleCallback(l)));
      }
      function E() {
        d = requestIdleCallback(l);
      }
      function v() {
        cancelIdleCallback(d);
      }
      function H() {
        requestIdleCallback(l);
      }
      return {
        start: E,
        stop: v,
        trigger: H
      };
    }
    X(() => {
      L();
    });
    function I() {
      R();
    }
    function w() {
      F();
    }
    function p() {
      F();
    }
    function C() {
      t || R();
    }
    return () => f("div", null, [f(Te, {
      list: s.value.slice(o.index, o.index + e.renderCount)
    }, null), f("div", {
      style: {
        height: x() + "px"
      },
      "data-length": s.value.length,
      ref: (d) => i = d,
      class: "r-scroll-virtual-falls-list"
    }, null)]);
  }
}), Ne = {
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
}, Se = /* @__PURE__ */ N({
  props: {
    list: Array
  },
  setup(e, n) {
    return () => (G(e.list || [], (c, s) => null), null);
  }
}), Ve = /* @__PURE__ */ N({
  props: {
    list: Array
  },
  setup(e, n) {
    return () => f(Se, {
      list: e.list
    }, null);
  }
}), ee = /* @__PURE__ */ N({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(e, n) {
    let c;
    ae(() => c.$el, s);
    function s(t) {
      var h, r, o, _, b;
      const i = ((r = (h = t == null ? void 0 : t[0]) == null ? void 0 : h.target) == null ? void 0 : r.offsetHeight) ?? 0, a = ((_ = (o = e.item) == null ? void 0 : o.__cache__) == null ? void 0 : _.height) ?? 0;
      i !== 0 && a !== i && (b = e.item) != null && b.__cache__ && (e.item.__cache__.height = i, e.item.__cache__.isResize = !0, n.emit("heightChange", i, a, t));
    }
    return (t) => {
      var i, a;
      return c = t, f("div", {
        class: "r-scroll-virtual-falls-list-item-content"
      }, [(a = (i = e == null ? void 0 : e.slots) == null ? void 0 : i.default) == null ? void 0 : a.call(i, e)]);
    };
  }
}), Ge = /* @__PURE__ */ N({
  props: {
    ...Ne
  },
  setup(e, n) {
    let c, s = !1;
    const t = ce(e), i = V(() => (e.listHook ? e.listHook.list : e.list) || []), a = F(), h = {
      nodeMap: /* @__PURE__ */ new Map(),
      DivPointer: void 0,
      item: void 0
    }, r = q({
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
    Q("RScrollVirtualFallsListContext", r), n.expose(r);
    const o = Y($), _ = Y(R), b = J({
      onScroll: z,
      onResize: o
    }), B = () => {
      var x, m;
      return ((m = (x = b == null ? void 0 : b.context) == null ? void 0 : x.element) == null ? void 0 : m.scrollTop) ?? 0;
    }, D = V(() => i.value.length ? (e.avgHeight + e.gap) * Math.ceil(i.value.length / e.columns) - e.gap : 0), T = () => -window.innerHeight + b.getOffsetTop(c), k = () => window.innerHeight * 2 + b.getOffsetTop(c);
    function g() {
      if (!c) return;
      a.stop();
      let x = r.column;
      r.nodeMap = /* @__PURE__ */ new Map(), h.DivPointer = void 0, r.renderList.forEach((m, I) => {
        m.__cache__ || (m.__cache__ = {});
        const w = r.index + I, p = m.__cache__;
        p.columns = t.list.map((d) => ({
          ...d
        })), x.height && (x.height = x.height + e.gap), p.top = x.height, p.left = x.left, p.width = x.width, p.columnIndex = x.index;
        let C;
        h.nodeMap.has(m) ? (C = h.nodeMap.get(m), C.setAttribute("data-index", w), P(f(ee, {
          item: m,
          index: w,
          slots: n.slots,
          key: e.keyExtractor({
            item: m,
            index: w
          }),
          onHeightChange: _
        }, null), C), h.DivPointer && (h.DivPointer.nextSibling === C || c.insertBefore(C, h.DivPointer.nextSibling)), h.DivPointer = C, h.nodeMap.delete(m)) : (C = document.createElement("div"), C.setAttribute("data-index", w), C.classList.add("r-scroll-virtual-falls-list-item"), P(f(ee, {
          item: m,
          index: w,
          slots: n.slots,
          key: e.keyExtractor({
            item: m,
            index: w
          }),
          onHeightChange: _
        }, null), C), h.DivPointer ? (c.insertBefore(C, h.DivPointer.nextSibling), h.DivPointer = C) : (c.insertBefore(C, c.firstChild), h.DivPointer = C)), C.style.top = p.top + "px", C.style.left = p.left, C.style.width = p.width, p.height = C.offsetHeight, x.height = x.height + C.offsetHeight, p.bottom = x.height, p.vTop = p.top + T(), p.vBottom = p.bottom + k(), p.columns2 = t.list.map((d) => ({
          ...d
        })), r.endIndex = w + 1, x = t.getMinHeightItem(), r.endColumn = x, r.nodeMap.set(m, C);
      }), h.nodeMap.forEach((m) => m.remove()), h.DivPointer = void 0, h.nodeMap = r.nodeMap, s = !1, a.rePreLoads(), a.start();
    }
    function u(x) {
      let m = y(B());
      m === -1 && (m = 0);
      let I = i.value[m];
      if (!I || !x && h.item === I) return;
      s = !0, r.index = m;
      let w = I.__cache__;
      m === 0 ? (t.setList(), r.column = t.getMinHeightItem()) : (t.list = w.columns, r.column = t.getMinHeightItem(w.columnIndex)), r.renderList = i.value.slice(r.index, r.index + e.renderCount), h.item = I, g();
    }
    function y(x) {
      return ue(i.value, (m) => m.__cache__ ? m.__cache__.vTop <= x && x <= m.__cache__.vBottom : !1, (m) => m.__cache__ ? m.__cache__.vTop < x : !1);
    }
    function L() {
      var I, w;
      const x = (w = (I = i.value.at(-1)) == null ? void 0 : I.__cache__) == null ? void 0 : w.columns2;
      if (!x) return D.value;
      let m = x[0];
      return x.forEach((p) => {
        p.height > m.height && (m = p);
      }), m.height;
    }
    function F() {
      let x, m = 0, I;
      function w() {
        m = r.endIndex, I = r.endColumn, C();
      }
      function p() {
        const H = i.value[m];
        if (!H) return;
        let M = I;
        H.__cache__ || (H.__cache__ = {});
        const j = H.__cache__.height || e.avgHeight;
        H.__cache__.columns = t.list.map((A) => ({
          ...A
        })), M.height && (M.height = M.height + e.gap), H.__cache__.top = M.height, H.__cache__.left = M.left, H.__cache__.width = M.width, H.__cache__.columnIndex = M.index, H.__cache__.height = j, M.height = M.height + j, H.__cache__.bottom = M.height, H.__cache__.columns2 = t.list.map((A) => ({
          ...A
        })), H.__cache__.vTop = H.__cache__.top + T(), H.__cache__.vBottom = H.__cache__.bottom + k(), m++, I = t.getMinHeightItem();
      }
      function C(H = e.preLoadsCount) {
        let M = 0;
        for (; M < e.preLoadsCount; )
          p(), M++;
      }
      function d(H) {
        if (m >= i.value.length) {
          E();
          return;
        }
        H.timeRemaining() > 0 && (C(10), H.didTimeout || (x = requestIdleCallback(d)));
      }
      function l() {
        x = requestIdleCallback(d);
      }
      function E() {
        cancelIdleCallback(x);
      }
      function v() {
        requestIdleCallback(d);
      }
      return {
        start: l,
        stop: E,
        trigger: v,
        preLoads: C,
        preLoad: p,
        rePreLoads: w
      };
    }
    X(() => {
    }), te(() => {
      a.stop();
    });
    function R() {
      u(!0);
    }
    function z() {
      u();
    }
    function $() {
      u(!0);
    }
    return re(() => i.value.slice(r.index, r.index + e.renderCount), () => {
      s || u(!0);
    }), () => f("div", null, [f(Ve, {
      list: i.value.slice(r.index, r.index + e.renderCount)
    }, null), f("div", {
      style: {
        height: L() + "px"
      },
      "data-length": i.value.length,
      ref: (x) => c = x,
      class: "r-scroll-virtual-falls-list"
    }, null)]);
  }
});
function De(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !ve(e);
}
const se = {
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
}, Fe = /* @__PURE__ */ N({
  props: {
    item: [Object, Array, String, Number],
    index: Number
  },
  setup(e, n) {
    const c = K("RScrollVirtualGridListContext") || {};
    let s;
    const t = new IntersectionObserver(([a]) => {
      a.isIntersecting && (c.context.emit("itemVisible", e), i());
    });
    function i() {
      typeof e.item == "object" && e.item.__markVisible !== c.markVisible && (e.item.__markVisible = c.markVisible, c.context.emit("itemMarkVisible", e));
    }
    return X(() => {
      t.observe(s);
    }), _e(() => {
      t.disconnect();
    }), () => f("div", {
      ref: (a) => s = a
    }, [S(n.slots, "default", e)]);
  }
}), Re = /* @__PURE__ */ N({
  props: {
    ...se
  },
  setup(e, n) {
    const c = K("RScrollVirtualGridListContext") || {};
    function s(t) {
      typeof t.item == "object" && t.item.__markCount !== c.markCount && (t.item.__markCount = c.markCount, c.context.emit("itemMarkRender", t));
    }
    return () => G(c.renderList, (t, i) => {
      let a;
      return s(t), f(Fe, {
        "data-index": t.index,
        class: "r-scroll-virtual-grid-list-item",
        style: t.style,
        item: t.item,
        index: t.index,
        key: e.keyExtractor(t)
      }, De(a = S(c.slots, "default", t)) ? a : {
        default: () => [a]
      });
    });
  }
}), Xe = /* @__PURE__ */ N({
  props: {
    ...se
  },
  emits: ["itemMarkRender", "itemMarkVisible", "itemVisible"],
  setup(e, n) {
    let c = {
      index: void 0
    }, s;
    const t = () => window.innerHeight, i = V(() => `calc( ${100 / e.columns}% - ${(e.columns - 1) * e.gap / e.columns}px )`), a = V(() => (e.listHook ? e.listHook.list : e.list) || []), h = V(() => a.value.length ? (e.avgHeight + e.gap) * Math.ceil(a.value.length / e.columns) - e.gap + e.bothEndsHeight * 2 : 0), r = J({
      onScroll(k, g) {
        T();
      },
      onResize(k, g) {
        T();
      }
    }), o = q({
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
    Q("RScrollVirtualGridListContext", o), n.expose(o);
    function _(k) {
      return `calc( ${100 / e.columns * k}% - ${(e.columns - 1) * e.gap / e.columns * k}px + ${k * e.gap}px )`;
    }
    function b(k, g = 0, u = []) {
      return r.context.element.scrollTop, r.getOffsetTop(s), k >= a.value.length ? u : (ke(e.columns, (y) => {
        if (k >= 0) {
          const L = Math.floor(k / e.columns);
          let F = L * (e.avgHeight + e.gap) + e.bothEndsHeight + "px";
          L === 0 && (F = e.bothEndsHeight + "px");
          const R = _(y), z = i.value, $ = e.avgHeight + "px";
          u.push({
            index: k,
            style: {
              top: F,
              left: R,
              width: z,
              height: $
            },
            item: a.value[k]
          });
        }
        k++;
      }), g = g + e.avgHeight + e.gap, g < window.innerHeight + t() * 2 ? b(k, g, u) : u);
    }
    function B(k = !0) {
      if (!r.context.element) return;
      const g = r.context.element.scrollTop, u = r.getOffsetTop(s);
      if (u - g - window.innerHeight - t() > 0) return;
      let L = Math.floor(t() / (e.avgHeight + e.gap)) * e.columns, R = Math.floor((g - u) / (e.avgHeight + e.gap)) * e.columns - L;
      c.index === R && k || (c.index = R, o.renderList = b(R));
    }
    let D;
    function T(k = !0) {
      if (!e.openAnimationFrame) return B(k);
      cancelAnimationFrame(D), D = requestAnimationFrame(() => {
        B(k);
      });
    }
    return () => (T(!1), f("div", {
      "data-length": a.value.length,
      ref: (k) => s = k,
      style: {
        height: h.value + "px"
      },
      class: "r-scroll-virtual-grid-list"
    }, [f(Re, {
      keyExtractor: e.keyExtractor
    }, null)]));
  }
});
export {
  qe as RScrollVirtualFallsListV2,
  Ge as RScrollVirtualFallsListV3,
  Xe as RScrollVirtualGridList,
  ze as VRPaginationLoading,
  Pe as VRTabs,
  We as VRVirtualFallsList,
  Ue as VRVirtualGridList
};
//# sourceMappingURL=index.js.map
