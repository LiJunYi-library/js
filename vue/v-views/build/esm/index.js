import { createElementBlock as R, openBlock as A, mergeProps as st, renderSlot as L, Fragment as ct, renderList as j, normalizeClass as dt, createTextVNode as S, toDisplayString as ft, inject as q, reactive as X, onBeforeUnmount as tt, defineComponent as M, onMounted as N, onUnmounted as gt, createVNode as c, useSlots as et, computed as T, toRaw as nt, withDirectives as it, vModelText as ot, render as $, provide as rt, watch as Q, onBeforeMount as ht, isVNode as mt } from "vue";
import { findParentByLocalName as _t } from "@rainbow_ljy/rainbow-element";
import { arrayRemove as vt, arrayLoopMap as yt, animationDebounced as Y, arrayLoop as bt } from "@rainbow_ljy/rainbow-js";
import { useResizeObserver as kt } from "@rainbow_ljy/v-hooks";
const xt = ["value"], Ht = ["trigger", "value", "onClick"], Et = {
  __name: "index",
  props: {
    trigger: { type: String, default: "click" },
    keyExtractor: { type: Function, default: (t, n) => n },
    listHook: { type: Object, default: () => ({}) }
  },
  setup(t) {
    return (n, l) => {
      var s;
      return A(), R("r-tabs", st({
        value: t.listHook.value
      }, { ...n.$attrs }), [
        (A(!0), R(ct, null, j(((s = t.listHook) == null ? void 0 : s.list) ?? [], (e, o) => {
          var u, d;
          return A(), R("r-tab-item", {
            key: t.keyExtractor(e, o),
            trigger: t.trigger,
            value: (d = (u = t.listHook) == null ? void 0 : u.formatterValue) == null ? void 0 : d.call(u, e, o),
            class: dt(["v-r-tab-item", "v-r-tab-item" + o]),
            onClick: (a) => {
              var i, m;
              return (m = (i = t.listHook) == null ? void 0 : i.onSelect) == null ? void 0 : m.call(i, e, o);
            }
          }, [
            L(n.$slots, "default", {
              item: e,
              index: o
            }, () => {
              var a, i;
              return [
                S(ft((i = (a = t.listHook) == null ? void 0 : a.formatterLabel) == null ? void 0 : i.call(a, e, o)), 1)
              ];
            })
          ], 10, Ht);
        }), 128)),
        L(n.$slots, "active")
      ], 16, xt);
    };
  }
}, Nt = Et;
function J(t = {}) {
  var u, d;
  const n = q("RScrollContext") || {}, l = X({
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
    ...t,
    destroy: o,
    getOffsetTop: s,
    dispatchFlotage: e,
    context: n
  });
  (d = (u = n == null ? void 0 : n.children) == null ? void 0 : u.push) == null || d.call(u, l);
  function s(a, i = 0) {
    return !n.element || !a || (i = i + a.offsetTop, a.offsetParent === n.element) ? i : s(a.offsetParent, i);
  }
  function e(...a) {
    n.children.forEach((i) => {
      i.onFlotage(...a);
    });
  }
  function o() {
    vt(n == null ? void 0 : n.children, l);
  }
  return tt(() => {
    o();
  }), l;
}
function Ct(t = {}) {
  const n = { ...t }, l = {
    width: e(),
    list: void 0,
    setColumns: a,
    afreshConfig: V,
    push: v,
    layout: w,
    setConfig: y,
    setWidth: s,
    afreshLayout: B,
    getMaxHeightItem: i,
    getMinHeightItem: m,
    setList: o
  };
  o();
  function s() {
    l.width = e();
  }
  function e() {
    return `calc( ${100 / n.columns}% - ${(n.columns - 1) * n.gap / n.columns}px )`;
  }
  function o() {
    l.list = u();
  }
  function u() {
    return yt(n.columns, (r) => ({
      height: 0,
      width: l.width,
      left: g(r),
      top: 0,
      children: [],
      index: r
    }));
  }
  function d(r) {
    return n.minAutoWidth ? Math.floor(r / n.minAutoWidth) || 1 : n.columns;
  }
  function a(r) {
    n.columns = d(r), s(), o();
  }
  function i() {
    let r = l.list[0];
    return l.list.forEach((_) => {
      _.height > r.height && (r = _);
    }), r;
  }
  function m(r) {
    if (typeof r == "number") return l.list[r];
    let _ = l.list[0];
    return l.list.forEach((x) => {
      x.height < _.height && (_ = x);
    }), _;
  }
  function y(r) {
    Object.assign(n, r), n.columns = d(r.width);
  }
  function V(r) {
    y(r), s(), o();
  }
  function B(r, _ = []) {
    y(r), s(), w(_);
  }
  function w(r = []) {
    o(), v(...r);
  }
  function v(...r) {
    r.forEach((_) => {
      if (!_ || !_.style) return;
      let x = m();
      x.height && (x.height = x.height + n.gap), _.style.left = x.left, _.style.top = x.height + "px", x.height = x.height + _.offsetHeight;
    });
  }
  function g(r) {
    return `calc( ${100 / n.columns * r}% - ${(n.columns - 1) * n.gap / n.columns * r}px + ${r * n.gap}px )`;
  }
  return l;
}
function pt(t = (e, o) => e.right = o - 1, n = [], l, s) {
  const e = {
    left: 0,
    right: n.length - 1,
    result: -1
  };
  for (; e.left <= e.right; ) {
    const o = Math.floor((e.left + e.right) / 2), u = n[o];
    l(u) ? (e.result = o, t(e, o, u)) : s(u) ? e.left = o + 1 : e.right = o - 1;
  }
  return e.result;
}
function Lt(t = [], n, l) {
  return pt(
    (s, e) => {
      s.right = e - 1;
    },
    t,
    n,
    l
  );
}
const Pt = /* @__PURE__ */ M({
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
  setup(t, n) {
    (() => {
      J({
        onScrollDown: g
      });
      function g(r) {
        const _ = r.contentHeight - r.containerHeight - t.triggerBottomDistance;
        r.scrollTop >= _ && n.emit("rollToBottom", r);
      }
    })();
    let l, s = document.createElement("div");
    N(e), gt(o);
    function e() {
      s = _t(["r-scroll", "r-scroll-view", "r-nested-scroll"], l.$el), s && s.addEventListener("scrollUp", u);
    }
    function o() {
      s && s.removeEventListener("scrollUp", u);
    }
    function u(g) {
      if (!s) return;
      const r = s.scrollHeight - s.offsetHeight - t.triggerBottomDistance;
      s.scrollTop >= r && n.emit("rollToBottom", g);
    }
    function d() {
      return L(n.slots, "loading", {}, () => [c("div", {
        class: "r-pagination-loading-loading"
      }, [c("div", {
        class: "r-pagination-loading-loading-prve"
      }, null), c("div", {
        class: "r-pagination-loading-loading-text"
      }, [S("加载中")]), c("div", {
        class: "r-pagination-loading-loading-next"
      }, null)])]);
    }
    function a() {
      return L(n.slots, "finished", {}, () => [c("div", {
        class: "r-pagination-loading-finished"
      }, [c("div", {
        class: "r-pagination-loading-finished-prve"
      }, null), c("div", {
        class: "r-pagination-loading-finished-text"
      }, [S("没有更多的了")]), c("div", {
        class: "r-pagination-loading-finished-next"
      }, null)])]);
    }
    function i() {
      return L(n.slots, "empty", {}, () => [c("div", {
        class: "r-pagination-loading-empty"
      }, [c("div", {
        class: "r-pagination-loading-empty-prve"
      }, null), c("div", {
        class: "r-pagination-loading-empty-text"
      }, [S("暂无相关数据，试试其他条件吧")]), c("div", {
        class: "r-pagination-loading-empty-next"
      }, null)])]);
    }
    function m() {
      return L(n.slots, "begin", {}, () => [c("div", {
        class: "r-pagination-loading-begin"
      }, [c("div", {
        class: "r-pagination-loading-begin-loading"
      }, [c("div", {
        class: "r-pagination-loading-begin-prve"
      }, null), c("div", {
        class: "r-pagination-loading-begin-text"
      }, [S("加载中")]), c("div", {
        class: "r-pagination-loading-begin-next"
      }, null)]), c("div", {
        class: "r-pagination-loading-begin-skeleton"
      }, [j(10, () => c("div", {
        class: "r-pagination-loading-begin-skeleton-item"
      }, null))])])]);
    }
    function y() {
      var g, r;
      t.onBeginErrorClick ? t.onBeginErrorClick(...arg) : (r = (g = t.loadingHook) == null ? void 0 : g.nextBeginSend) == null || r.call(g);
    }
    function V() {
      return L(n.slots, "error", {}, () => [c("div", {
        class: "r-pagination-loading-begin-error",
        onClick: y
      }, [c("div", {
        class: "r-pagination-loading-begin-error-prve"
      }, null), c("div", {
        class: "r-pagination-loading-begin-error-text"
      }, [S("出错了 点击重新加载")]), c("div", {
        class: "r-pagination-loading-begin-error-next"
      }, null)])]);
    }
    function B(...g) {
      var r, _;
      t.onErrorLoadClick ? t.onErrorLoadClick(...g) : (_ = (r = t.loadingHook) == null ? void 0 : r.awaitSend) == null || _.call(r);
    }
    function w() {
      return L(n.slots, "errorLoad", {}, () => [c("div", {
        class: "r-pagination-loading-error",
        onClick: B
      }, [c("div", {
        class: "r-pagination-loading-error-prve"
      }, null), c("div", {
        class: "r-pagination-loading-error-text"
      }, [S("出错了 点击重新加载")]), c("div", {
        class: "r-pagination-loading-error-next"
      }, null)])]);
    }
    function v() {
      const g = t.loadingHook;
      if (g.begin === !0 && g.error === !0) return V();
      if (g.error === !0) return w();
      if (g.begin === !0) return m();
      if (g.empty === !0 && g.finished === !0) return i();
      if (g.finished === !0) return a();
      if (g.loading === !0) return d();
    }
    return (g, r) => {
      var _, x;
      return l = g, [(x = (_ = n.slots) == null ? void 0 : _.default) == null ? void 0 : x.call(_), v()];
    };
  }
}), wt = ["keyExtractor"], Mt = {
  __name: "index",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    keyExtractor: {
      type: Function,
      default: (t) => t.item
    },
    listHook: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(t, {
    emit: n
  }) {
    const l = et(), s = n, e = t, o = T({
      set(i) {
        if (e.listHook.list) return e.listHook.list = i;
        s("update:modelValue", i);
      },
      get() {
        return e.listHook.list ? e.listHook.list : nt(e.modelValue);
      }
    }), u = T(() => e.listHook.list ? e.listHook.list : e.modelValue), d = /* @__PURE__ */ M({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(i) {
        return () => {
          var m, y;
          return (y = (m = i == null ? void 0 : i.slots) == null ? void 0 : m.item) == null ? void 0 : y.call(m, i.event);
        };
      }
    });
    function a(i) {
      i.item = u.value[i.index], $(c(d, {
        event: i,
        slots: l,
        key: e.keyExtractor(i),
        "data-key": e.keyExtractor(i)
      }, null), i.ele);
    }
    return (i, m) => it((A(), R("r-scroll-virtual-grid-list", {
      "onUpdate:modelValue": m[0] || (m[0] = (y) => o.value = y),
      onrenderItems: a,
      keyExtractor: e.keyExtractor
    }, [L(i.$slots, "default")], 8, wt)), [[ot, o.value]]);
  }
}, zt = Mt, Tt = ["keyExtractor"], Vt = {
  __name: "index",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    keyExtractor: {
      type: Function,
      default: (t) => t.item
    },
    listHook: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(t, {
    emit: n
  }) {
    const l = et(), s = n, e = t, o = T({
      set(i) {
        if (e.listHook.list) return e.listHook.list = i;
        s("update:modelValue", i);
      },
      get() {
        return e.listHook.list ? e.listHook.list : nt(e.modelValue);
      }
    }), u = T(() => e.listHook.list ? e.listHook.list : e.modelValue), d = /* @__PURE__ */ M({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(i) {
        return N(() => {
        }), () => {
          var m, y;
          return (y = (m = i == null ? void 0 : i.slots) == null ? void 0 : m.item) == null ? void 0 : y.call(m, i.event);
        };
      }
    });
    function a(i) {
      i.item = u.value[i.index], $(c(d, {
        event: i,
        slots: l,
        key: e.keyExtractor(i),
        "data-key": e.keyExtractor(i)
      }, null), i.ele);
    }
    return (i, m) => it((A(), R("r-scroll-virtual-falls-list", {
      "onUpdate:modelValue": m[0] || (m[0] = (y) => o.value = y),
      onrenderItems: a,
      keyExtractor: e.keyExtractor
    }, [L(i.$slots, "default")], 8, Tt)), [[ot, o.value]]);
  }
}, Ut = Vt, Bt = {
  avgHeight: {
    type: Number,
    default: 200
  },
  // 每个item高度
  keyExtractor: {
    type: Function,
    default: ({
      index: t
    }) => t
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
}, Ft = /* @__PURE__ */ M({
  props: {
    list: Array
  },
  setup(t, n) {
    return () => (j(t.list || [], (l, s) => null), null);
  }
}), St = /* @__PURE__ */ M({
  props: {
    list: Array
  },
  setup(t, n) {
    return () => c(Ft, {
      list: t.list
    }, null);
  }
}), Z = /* @__PURE__ */ M({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(t, n) {
    let l;
    kt(() => l.$el, s);
    function s(e) {
      var d, a, i, m, y;
      const o = ((a = (d = e == null ? void 0 : e[0]) == null ? void 0 : d.target) == null ? void 0 : a.offsetHeight) ?? 0, u = ((m = (i = t.item) == null ? void 0 : i.__cache__) == null ? void 0 : m.height) ?? 0;
      o !== 0 && u !== o && (y = t.item) != null && y.__cache__ && (t.item.__cache__.height = o, t.item.__cache__.isResize = !0, n.emit("heightChange", o, u, e));
    }
    return (e) => {
      var o, u;
      return l = e, c("div", {
        class: "r-scroll-virtual-falls-list-item-content"
      }, [(u = (o = t == null ? void 0 : t.slots) == null ? void 0 : o.default) == null ? void 0 : u.call(o, t)]);
    };
  }
}), Gt = /* @__PURE__ */ M({
  props: {
    ...Bt
  },
  setup(t, n) {
    let l, s = !1;
    const e = Ct(t), o = T(() => (t.listHook ? t.listHook.list : t.list) || []), u = D(), d = {
      nodeMap: /* @__PURE__ */ new Map(),
      DivPointer: void 0,
      item: void 0
    }, a = X({
      context: n,
      slots: n.slots,
      index: 0,
      endIndex: 0,
      column: e.getMinHeightItem(),
      endColumn: e.getMinHeightItem(),
      nodeMap: /* @__PURE__ */ new Map(),
      renderList: [],
      renderItems: g
    });
    rt("RScrollVirtualFallsListContext", a), n.expose(a);
    const i = Y(z), m = Y(F), y = J({
      onScroll: P,
      onResize: i
    }), V = () => {
      var h, f;
      return ((f = (h = y == null ? void 0 : y.context) == null ? void 0 : h.element) == null ? void 0 : f.scrollTop) ?? 0;
    }, B = T(() => o.value.length ? (t.avgHeight + t.gap) * Math.ceil(o.value.length / t.columns) - t.gap : 0), w = () => -window.innerHeight + y.getOffsetTop(l), v = () => window.innerHeight * 2 + y.getOffsetTop(l);
    function g() {
      if (!l) return;
      u.stop();
      let h = a.column;
      a.nodeMap = /* @__PURE__ */ new Map(), d.DivPointer = void 0, a.renderList.forEach((f, p) => {
        f.__cache__ || (f.__cache__ = {});
        const E = a.index + p, H = f.__cache__;
        H.columns = e.list.map((I) => ({
          ...I
        })), h.height && (h.height = h.height + t.gap), H.top = h.height, H.left = h.left, H.width = h.width, H.columnIndex = h.index;
        let k;
        d.nodeMap.has(f) ? (k = d.nodeMap.get(f), k.setAttribute("data-index", E), $(c(Z, {
          item: f,
          index: E,
          slots: n.slots,
          key: t.keyExtractor({
            item: f,
            index: E
          }),
          onHeightChange: m
        }, null), k), d.DivPointer && (d.DivPointer.nextSibling === k || l.insertBefore(k, d.DivPointer.nextSibling)), d.DivPointer = k, d.nodeMap.delete(f)) : (k = document.createElement("div"), k.setAttribute("data-index", E), k.classList.add("r-scroll-virtual-falls-list-item"), $(c(Z, {
          item: f,
          index: E,
          slots: n.slots,
          key: t.keyExtractor({
            item: f,
            index: E
          }),
          onHeightChange: m
        }, null), k), d.DivPointer ? (l.insertBefore(k, d.DivPointer.nextSibling), d.DivPointer = k) : (l.insertBefore(k, l.firstChild), d.DivPointer = k)), k.style.top = H.top + "px", k.style.left = H.left, k.style.width = H.width, H.height = k.offsetHeight, h.height = h.height + k.offsetHeight, H.bottom = h.height, H.vTop = H.top + w(), H.vBottom = H.bottom + v(), H.columns2 = e.list.map((I) => ({
          ...I
        })), a.endIndex = E + 1, h = e.getMinHeightItem(), a.endColumn = h, a.nodeMap.set(f, k);
      }), d.nodeMap.forEach((f) => f.remove()), d.DivPointer = void 0, d.nodeMap = a.nodeMap, s = !1, u.rePreLoads(), u.start();
    }
    function r(h) {
      let f = _(V());
      if (f === -1 && (f = 0), o.value.length === 0 && l) {
        l.innerHTML = "";
        return;
      }
      let p = o.value[f];
      if (!p || !h && d.item === p) return;
      s = !0, a.index = f;
      let E = p.__cache__;
      f === 0 ? (e.setList(), a.column = e.getMinHeightItem()) : (e.list = E.columns, a.column = e.getMinHeightItem(E.columnIndex)), a.renderList = o.value.slice(a.index, a.index + t.renderCount), d.item = p, g();
    }
    function _(h) {
      return Lt(o.value, (f) => f.__cache__ ? f.__cache__.vTop <= h && h <= f.__cache__.vBottom : !1, (f) => f.__cache__ ? f.__cache__.vTop < h : !1);
    }
    function x() {
      var p, E;
      const h = (E = (p = o.value.at(-1)) == null ? void 0 : p.__cache__) == null ? void 0 : E.columns2;
      if (!h) return B.value;
      let f = h[0];
      return h.forEach((H) => {
        H.height > f.height && (f = H);
      }), f.height;
    }
    function D() {
      let h, f = 0, p;
      const E = window.requestIdleCallback || requestAnimationFrame, H = window.requestIdleCallback ? cancelIdleCallback : cancelAnimationFrame;
      function k() {
        f = a.endIndex, p = a.endColumn, U();
      }
      function I() {
        const b = o.value[f];
        if (!b) return;
        let C = p;
        b.__cache__ || (b.__cache__ = {});
        const O = b.__cache__.height || t.avgHeight;
        b.__cache__.columns = e.list.map((W) => ({
          ...W
        })), C.height && (C.height = C.height + t.gap), b.__cache__.top = C.height, b.__cache__.left = C.left, b.__cache__.width = C.width, b.__cache__.columnIndex = C.index, b.__cache__.height = O, C.height = C.height + O, b.__cache__.bottom = C.height, b.__cache__.columns2 = e.list.map((W) => ({
          ...W
        })), b.__cache__.vTop = b.__cache__.top + w(), b.__cache__.vBottom = b.__cache__.bottom + v(), f++, p = e.getMinHeightItem();
      }
      function U(b = t.preLoadsCount) {
        let C = 0;
        for (; C < t.preLoadsCount; )
          I(), C++;
      }
      function G(b) {
        if (f >= o.value.length) {
          K();
          return;
        }
        if (typeof b == "object" && b.timeRemaining && b.timeRemaining() > 0 || typeof b == "number") {
          try {
            U(10);
          } catch (O) {
            console.error("Error in callback:", O);
          }
          (typeof b == "object" && !b.didTimeout || typeof b == "number") && (h = E(G));
        }
      }
      function at() {
        h = E(G);
      }
      function K() {
        h && (H(h), h = null);
      }
      function ut() {
        E(G);
      }
      return {
        start: at,
        stop: K,
        trigger: ut,
        preLoads: U,
        preLoad: I,
        rePreLoads: k
      };
    }
    N(() => {
    }), tt(() => {
      u.stop();
    });
    function F() {
      r(!0);
    }
    function P() {
      r();
    }
    function z() {
      r(!0);
    }
    return Q(() => o.value.slice(a.index, a.index + t.renderCount), () => {
      s || r(!0);
    }), Q(() => o.value.length, () => {
      s || r(!0);
    }), () => c("div", null, [c(St, {
      list: o.value.slice(a.index, a.index + t.renderCount)
    }, null), c("div", {
      style: {
        height: x() + "px"
      },
      "data-length": o.value.length,
      ref: (h) => l = h,
      class: "r-scroll-virtual-falls-list"
    }, null)]);
  }
});
function It(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Object]" && !mt(t);
}
const lt = {
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
      index: t
    }) => t
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
}, Dt = /* @__PURE__ */ M({
  props: {
    item: [Object, Array, String, Number],
    index: Number
  },
  setup(t, n) {
    const l = q("RScrollVirtualGridListContext") || {};
    let s;
    const e = new IntersectionObserver(([u]) => {
      u.isIntersecting && (l.context.emit("itemVisible", t), o());
    });
    function o() {
      typeof t.item == "object" && t.item.__markVisible !== l.markVisible && (t.item.__markVisible = l.markVisible, l.context.emit("itemMarkVisible", t));
    }
    return N(() => {
      e.observe(s);
    }), ht(() => {
      e.disconnect();
    }), () => c("div", {
      ref: (u) => s = u
    }, [L(n.slots, "default", t)]);
  }
}), Rt = /* @__PURE__ */ M({
  props: {
    ...lt
  },
  setup(t, n) {
    const l = q("RScrollVirtualGridListContext") || {};
    function s(e) {
      typeof e.item == "object" && e.item.__markCount !== l.markCount && (e.item.__markCount = l.markCount, l.context.emit("itemMarkRender", e));
    }
    return () => j(l.renderList, (e, o) => {
      let u;
      return s(e), c(Dt, {
        "data-index": e.index,
        class: "r-scroll-virtual-grid-list-item",
        style: e.style,
        item: e.item,
        index: e.index,
        key: t.keyExtractor(e)
      }, It(u = L(l.slots, "default", e)) ? u : {
        default: () => [u]
      });
    });
  }
}), Wt = /* @__PURE__ */ M({
  props: {
    ...lt
  },
  emits: ["itemMarkRender", "itemMarkVisible", "itemVisible"],
  setup(t, n) {
    let l = {
      index: void 0
    }, s;
    const e = () => window.innerHeight, o = T(() => `calc( ${100 / t.columns}% - ${(t.columns - 1) * t.gap / t.columns}px )`), u = T(() => (t.listHook ? t.listHook.list : t.list) || []), d = T(() => u.value.length ? (t.avgHeight + t.gap) * Math.ceil(u.value.length / t.columns) - t.gap + t.bothEndsHeight * 2 : 0), a = J({
      onScroll(v, g) {
        w();
      },
      onResize(v, g) {
        w();
      }
    }), i = X({
      context: n,
      slots: n.slots,
      itemWidth: o,
      height: d,
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
    rt("RScrollVirtualGridListContext", i), n.expose(i);
    function m(v) {
      return `calc( ${100 / t.columns * v}% - ${(t.columns - 1) * t.gap / t.columns * v}px + ${v * t.gap}px )`;
    }
    function y(v, g = 0, r = []) {
      return a.context.element.scrollTop, a.getOffsetTop(s), v >= u.value.length ? r : (bt(t.columns, (_) => {
        if (v >= 0) {
          const x = Math.floor(v / t.columns);
          let D = x * (t.avgHeight + t.gap) + t.bothEndsHeight + "px";
          x === 0 && (D = t.bothEndsHeight + "px");
          const F = m(_), P = o.value, z = t.avgHeight + "px";
          r.push({
            index: v,
            style: {
              top: D,
              left: F,
              width: P,
              height: z
            },
            item: u.value[v]
          });
        }
        v++;
      }), g = g + t.avgHeight + t.gap, g < window.innerHeight + e() * 2 ? y(v, g, r) : r);
    }
    function V(v = !0) {
      if (!a.context.element) return;
      const g = a.context.element.scrollTop, r = a.getOffsetTop(s);
      if (r - g - window.innerHeight - e() > 0) return;
      let x = Math.floor(e() / (t.avgHeight + t.gap)) * t.columns, F = Math.floor((g - r) / (t.avgHeight + t.gap)) * t.columns - x;
      l.index === F && v || (l.index = F, i.renderList = y(F));
    }
    let B;
    function w(v = !0) {
      if (!t.openAnimationFrame) return V(v);
      cancelAnimationFrame(B), B = requestAnimationFrame(() => {
        V(v);
      });
    }
    return () => (w(!1), c("div", {
      "data-length": u.value.length,
      ref: (v) => s = v,
      style: {
        height: d.value + "px"
      },
      class: "r-scroll-virtual-grid-list"
    }, [c(Rt, {
      keyExtractor: t.keyExtractor
    }, null)]));
  }
});
export {
  Gt as RScrollVirtualFallsListV3,
  Wt as RScrollVirtualGridList,
  Pt as VRPaginationLoading,
  Nt as VRTabs,
  Ut as VRVirtualFallsList,
  zt as VRVirtualGridList
};
//# sourceMappingURL=index.js.map
