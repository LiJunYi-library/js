import { createElementBlock as D, openBlock as R, mergeProps as st, renderSlot as p, Fragment as ct, renderList as j, normalizeClass as dt, createTextVNode as I, toDisplayString as gt, inject as J, reactive as K, onBeforeUnmount as et, defineComponent as w, onMounted as P, onUnmounted as ft, watch as X, createVNode as c, useSlots as nt, computed as M, toRaw as O, withDirectives as it, vModelText as ot, render as $, provide as rt, onBeforeMount as mt, isVNode as ht } from "vue";
import { findParentByLocalName as _t } from "@rainbow_ljy/rainbow-element";
import { arrayRemove as vt, arrayLoopMap as yt, animationDebounced as Z, arrayLoop as bt } from "@rainbow_ljy/rainbow-js";
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
      return R(), D("r-tabs", st({
        value: t.listHook.value
      }, { ...n.$attrs }), [
        (R(!0), D(ct, null, j(((s = t.listHook) == null ? void 0 : s.list) ?? [], (e, o) => {
          var u, d;
          return R(), D("r-tab-item", {
            key: t.keyExtractor(e, o),
            trigger: t.trigger,
            value: (d = (u = t.listHook) == null ? void 0 : u.formatterValue) == null ? void 0 : d.call(u, e, o),
            class: dt(["v-r-tab-item", "v-r-tab-item" + o]),
            onClick: (a) => {
              var i, h;
              return (h = (i = t.listHook) == null ? void 0 : i.onSelect) == null ? void 0 : h.call(i, e, o);
            }
          }, [
            p(n.$slots, "default", {
              item: e,
              index: o
            }, () => {
              var a, i;
              return [
                I(gt((i = (a = t.listHook) == null ? void 0 : a.formatterLabel) == null ? void 0 : i.call(a, e, o)), 1)
              ];
            })
          ], 10, Ht);
        }), 128)),
        p(n.$slots, "active")
      ], 16, xt);
    };
  }
}, jt = Et;
function Q(t = {}) {
  var u, d;
  const n = J("RScrollContext") || {}, l = K({
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
  return et(() => {
    o();
  }), l;
}
function Ct(t = {}) {
  const n = { ...t }, l = {
    width: e(),
    list: void 0,
    setColumns: a,
    afreshConfig: T,
    push: v,
    layout: B,
    setConfig: y,
    setWidth: s,
    afreshLayout: V,
    getMaxHeightItem: i,
    getMinHeightItem: h,
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
      left: f(r),
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
  function h(r) {
    if (typeof r == "number") return l.list[r];
    let _ = l.list[0];
    return l.list.forEach((k) => {
      k.height < _.height && (_ = k);
    }), _;
  }
  function y(r) {
    Object.assign(n, r), n.columns = d(r.width);
  }
  function T(r) {
    y(r), s(), o();
  }
  function V(r, _ = []) {
    y(r), s(), B(_);
  }
  function B(r = []) {
    o(), v(...r);
  }
  function v(...r) {
    r.forEach((_) => {
      if (!_ || !_.style) return;
      let k = h();
      k.height && (k.height = k.height + n.gap), _.style.left = k.left, _.style.top = k.height + "px", k.height = k.height + _.offsetHeight;
    });
  }
  function f(r) {
    return `calc( ${100 / n.columns * r}% - ${(n.columns - 1) * n.gap / n.columns * r}px + ${r * n.gap}px )`;
  }
  return l;
}
function Lt(t = (e, o) => e.right = o - 1, n = [], l, s) {
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
function pt(t = [], n, l) {
  return Lt(
    (s, e) => {
      s.right = e - 1;
    },
    t,
    n,
    l
  );
}
const Pt = /* @__PURE__ */ w({
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
    },
    skeletonCount: {
      type: Number,
      default: 10
    }
  },
  emits: ["rollToBottom", "scrollArriveBottom"],
  setup(t, n) {
    (() => {
      Q({
        onScrollDown: f
      });
      function f(r) {
        const _ = r.contentHeight - r.containerHeight - t.triggerBottomDistance;
        r.scrollTop >= _ && (n.emit("rollToBottom", r), n.emit("scrollArriveBottom", r));
      }
    })();
    let l, s = document.createElement("div");
    P(e), ft(o);
    function e() {
      console.log("findParentByLocalName222"), s = _t(["r-scroll", "r-scroll-view", "r-nested-scroll"], l.$el), s && s.addEventListener("scrollUp", u);
    }
    function o() {
      s && s.removeEventListener("scrollUp", u);
    }
    function u(f) {
      if (!s) return;
      const r = s.scrollHeight - s.offsetHeight - t.triggerBottomDistance;
      s.scrollTop >= r && (n.emit("rollToBottom", f), n.emit("scrollArriveBottom", f));
    }
    function d() {
      return p(n.slots, "loading", {}, () => [c("div", {
        class: "r-pagination-loading-loading"
      }, [c("div", {
        class: "r-pagination-loading-loading-prve"
      }, null), c("div", {
        class: "r-pagination-loading-loading-text"
      }, [I("加载中")]), c("div", {
        class: "r-pagination-loading-loading-next"
      }, null)])]);
    }
    function a() {
      return p(n.slots, "finished", {}, () => [c("div", {
        class: "r-pagination-loading-finished"
      }, [c("div", {
        class: "r-pagination-loading-finished-prve"
      }, null), c("div", {
        class: "r-pagination-loading-finished-text"
      }, [I("没有更多的了")]), c("div", {
        class: "r-pagination-loading-finished-next"
      }, null)])]);
    }
    function i() {
      return p(n.slots, "empty", {}, () => [c("div", {
        class: "r-pagination-loading-empty"
      }, [c("div", {
        class: "r-pagination-loading-empty-prve"
      }, null), c("div", {
        class: "r-pagination-loading-empty-text"
      }, [I("暂无相关数据，试试其他条件吧")]), c("div", {
        class: "r-pagination-loading-empty-next"
      }, null)])]);
    }
    function h() {
      return p(n.slots, "begin", {}, () => [c("div", {
        class: "r-pagination-loading-begin"
      }, [c("div", {
        class: "r-pagination-loading-begin-loading"
      }, [c("div", {
        class: "r-pagination-loading-begin-prve"
      }, null), c("div", {
        class: "r-pagination-loading-begin-text"
      }, [I("加载中")]), c("div", {
        class: "r-pagination-loading-begin-next"
      }, null)]), c("div", {
        class: "r-pagination-loading-begin-skeleton"
      }, [j(t.skeletonCount, () => c("div", {
        class: "r-pagination-loading-begin-skeleton-item"
      }, null))])])]);
    }
    function y() {
      var f, r;
      t.onBeginErrorClick ? t.onBeginErrorClick(...arg) : (r = (f = t.loadingHook) == null ? void 0 : f.nextBeginSend) == null || r.call(f);
    }
    function T() {
      return p(n.slots, "error", {}, () => [c("div", {
        class: "r-pagination-loading-begin-error",
        onClick: y
      }, [c("div", {
        class: "r-pagination-loading-begin-error-prve"
      }, null), c("div", {
        class: "r-pagination-loading-begin-error-text"
      }, [I("出错了 点击重新加载")]), c("div", {
        class: "r-pagination-loading-begin-error-next"
      }, null)])]);
    }
    function V(...f) {
      var r, _;
      t.onErrorLoadClick ? t.onErrorLoadClick(...f) : (_ = (r = t.loadingHook) == null ? void 0 : r.awaitSend) == null || _.call(r);
    }
    function B() {
      return p(n.slots, "errorLoad", {}, () => [c("div", {
        class: "r-pagination-loading-error",
        onClick: V
      }, [c("div", {
        class: "r-pagination-loading-error-prve"
      }, null), c("div", {
        class: "r-pagination-loading-error-text"
      }, [I("出错了 点击重新加载")]), c("div", {
        class: "r-pagination-loading-error-next"
      }, null)])]);
    }
    function v() {
      const f = t.loadingHook;
      if (f.error === !0) return B();
      if (f.empty === !0 && f.finished === !0) return i();
      if (f.finished === !0) return a();
      if (f.loading === !0) return d();
    }
    return X(() => t.loadingHook.begin, async () => {
      console.log([l.$el]);
    }), (f, r) => {
      var k, F;
      l = f;
      const _ = t.loadingHook;
      return _.begin === !0 && _.error === !0 ? T() : _.begin === !0 ? h() : [(F = (k = n.slots) == null ? void 0 : k.default) == null ? void 0 : F.call(k), v()];
    };
  }
}), Bt = ["keyExtractor"], wt = {
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
    const l = nt(), s = n, e = t, o = M({
      set(i) {
        if (e.listHook.list) return e.listHook.list = i;
        s("update:modelValue", i);
      },
      get() {
        return e.listHook.list ? O(e.listHook.list) : O(e.modelValue);
      }
    }), u = M(() => e.listHook.list ? e.listHook.list : e.modelValue), d = /* @__PURE__ */ w({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(i) {
        return () => {
          var h, y;
          return (y = (h = i == null ? void 0 : i.slots) == null ? void 0 : h.item) == null ? void 0 : y.call(h, i.event);
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
    return (i, h) => it((R(), D("r-scroll-virtual-grid-list", {
      "onUpdate:modelValue": h[0] || (h[0] = (y) => o.value = y),
      onrenderItems: a,
      keyExtractor: e.keyExtractor
    }, [p(i.$slots, "default")], 8, Bt)), [[ot, o.value]]);
  }
}, zt = wt, Mt = ["keyExtractor"], Tt = {
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
    const l = nt(), s = n, e = t, o = M({
      set(i) {
        if (e.listHook.list) return e.listHook.list = i;
        s("update:modelValue", i);
      },
      get() {
        return e.listHook.list ? O(e.listHook.list) : O(e.modelValue);
      }
    }), u = M(() => e.listHook.list ? e.listHook.list : e.modelValue), d = /* @__PURE__ */ w({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(i) {
        return P(() => {
        }), () => {
          var h, y;
          return (y = (h = i == null ? void 0 : i.slots) == null ? void 0 : h.item) == null ? void 0 : y.call(h, i.event);
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
    return (i, h) => it((R(), D("r-scroll-virtual-falls-list", {
      "onUpdate:modelValue": h[0] || (h[0] = (y) => o.value = y),
      onrenderItems: a,
      keyExtractor: e.keyExtractor
    }, [p(i.$slots, "default")], 8, Mt)), [[ot, o.value]]);
  }
}, Ut = Tt, Vt = {
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
}, Ft = /* @__PURE__ */ w({
  props: {
    list: Array
  },
  setup(t, n) {
    return () => (j(t.list || [], (l, s) => null), null);
  }
}), St = /* @__PURE__ */ w({
  props: {
    list: Array
  },
  setup(t, n) {
    return () => c(Ft, {
      list: t.list
    }, null);
  }
}), tt = /* @__PURE__ */ w({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(t, n) {
    let l;
    kt(() => l.$el, s);
    function s(e) {
      var d, a, i, h, y;
      const o = ((a = (d = e == null ? void 0 : e[0]) == null ? void 0 : d.target) == null ? void 0 : a.offsetHeight) ?? 0, u = ((h = (i = t.item) == null ? void 0 : i.__cache__) == null ? void 0 : h.height) ?? 0;
      o !== 0 && u !== o && (y = t.item) != null && y.__cache__ && (t.item.__cache__.height = o, t.item.__cache__.isResize = !0, n.emit("heightChange", o, u, e));
    }
    return (e) => {
      var o, u;
      return l = e, c("div", {
        class: "r-scroll-virtual-falls-list-item-content"
      }, [(u = (o = t == null ? void 0 : t.slots) == null ? void 0 : o.default) == null ? void 0 : u.call(o, t)]);
    };
  }
}), Gt = /* @__PURE__ */ w({
  props: {
    ...Vt
  },
  setup(t, n) {
    let l, s = !1;
    const e = Ct(t), o = M(() => (t.listHook ? t.listHook.list : t.list) || []), u = F(), d = {
      nodeMap: /* @__PURE__ */ new Map(),
      DivPointer: void 0,
      item: void 0
    }, a = K({
      context: n,
      slots: n.slots,
      index: 0,
      endIndex: 0,
      column: e.getMinHeightItem(),
      endColumn: e.getMinHeightItem(),
      nodeMap: /* @__PURE__ */ new Map(),
      renderList: [],
      renderItems: f
    });
    rt("RScrollVirtualFallsListContext", a), n.expose(a);
    const i = Z(U), h = Z(S), y = Q({
      onScroll: z,
      onResize: i
    }), T = () => {
      var m, g;
      return ((g = (m = y == null ? void 0 : y.context) == null ? void 0 : m.element) == null ? void 0 : g.scrollTop) ?? 0;
    }, V = M(() => o.value.length ? (t.avgHeight + t.gap) * Math.ceil(o.value.length / t.columns) - t.gap : 0), B = () => -window.innerHeight + y.getOffsetTop(l), v = () => window.innerHeight * 2 + y.getOffsetTop(l);
    function f() {
      if (!l) return;
      u.stop();
      let m = a.column;
      a.nodeMap = /* @__PURE__ */ new Map(), d.DivPointer = void 0, a.renderList.forEach((g, L) => {
        g.__cache__ || (g.__cache__ = {});
        const E = a.index + L, H = g.__cache__;
        H.columns = e.list.map((A) => ({
          ...A
        })), m.height && (m.height = m.height + t.gap), H.top = m.height, H.left = m.left, H.width = m.width, H.columnIndex = m.index;
        let x;
        d.nodeMap.has(g) ? (x = d.nodeMap.get(g), x.setAttribute("data-index", E), $(c(tt, {
          item: g,
          index: E,
          slots: n.slots,
          key: t.keyExtractor({
            item: g,
            index: E
          }),
          onHeightChange: h
        }, null), x), d.DivPointer && (d.DivPointer.nextSibling === x || l.insertBefore(x, d.DivPointer.nextSibling)), d.DivPointer = x, d.nodeMap.delete(g)) : (x = document.createElement("div"), x.setAttribute("data-index", E), x.classList.add("r-scroll-virtual-falls-list-item"), $(c(tt, {
          item: g,
          index: E,
          slots: n.slots,
          key: t.keyExtractor({
            item: g,
            index: E
          }),
          onHeightChange: h
        }, null), x), d.DivPointer ? (l.insertBefore(x, d.DivPointer.nextSibling), d.DivPointer = x) : (l.insertBefore(x, l.firstChild), d.DivPointer = x)), x.style.top = H.top + "px", x.style.left = H.left, x.style.width = H.width, H.height = x.offsetHeight, m.height = m.height + x.offsetHeight, H.bottom = m.height, H.vTop = H.top + B(), H.vBottom = H.bottom + v(), H.columns2 = e.list.map((A) => ({
          ...A
        })), a.endIndex = E + 1, m = e.getMinHeightItem(), a.endColumn = m, a.nodeMap.set(g, x);
      }), d.nodeMap.forEach((g) => g.remove()), d.DivPointer = void 0, d.nodeMap = a.nodeMap, s = !1, u.rePreLoads(), u.start();
    }
    function r(m) {
      let g = _(T());
      if (g === -1 && (g = 0), o.value.length === 0 && l) {
        l.innerHTML = "";
        return;
      }
      let L = o.value[g];
      if (!L || !m && d.item === L) return;
      s = !0, a.index = g;
      let E = L.__cache__;
      g === 0 ? (e.setList(), a.column = e.getMinHeightItem()) : (e.list = E.columns, a.column = e.getMinHeightItem(E.columnIndex)), a.renderList = o.value.slice(a.index, a.index + t.renderCount), d.item = L, f();
    }
    function _(m) {
      return pt(o.value, (g) => g.__cache__ ? g.__cache__.vTop <= m && m <= g.__cache__.vBottom : !1, (g) => g.__cache__ ? g.__cache__.vTop < m : !1);
    }
    function k() {
      var L, E;
      const m = (E = (L = o.value.at(-1)) == null ? void 0 : L.__cache__) == null ? void 0 : E.columns2;
      if (!m) return V.value;
      let g = m[0];
      return m.forEach((H) => {
        H.height > g.height && (g = H);
      }), g.height;
    }
    function F() {
      let m, g = 0, L;
      const E = window.requestIdleCallback || requestAnimationFrame, H = window.requestIdleCallback ? cancelIdleCallback : cancelAnimationFrame;
      function x() {
        g = a.endIndex, L = a.endColumn, G();
      }
      function A() {
        const b = o.value[g];
        if (!b) return;
        let C = L;
        b.__cache__ || (b.__cache__ = {});
        const N = b.__cache__.height || t.avgHeight;
        b.__cache__.columns = e.list.map((q) => ({
          ...q
        })), C.height && (C.height = C.height + t.gap), b.__cache__.top = C.height, b.__cache__.left = C.left, b.__cache__.width = C.width, b.__cache__.columnIndex = C.index, b.__cache__.height = N, C.height = C.height + N, b.__cache__.bottom = C.height, b.__cache__.columns2 = e.list.map((q) => ({
          ...q
        })), b.__cache__.vTop = b.__cache__.top + B(), b.__cache__.vBottom = b.__cache__.bottom + v(), g++, L = e.getMinHeightItem();
      }
      function G(b = t.preLoadsCount) {
        let C = 0;
        for (; C < t.preLoadsCount; )
          A(), C++;
      }
      function W(b) {
        if (g >= o.value.length) {
          Y();
          return;
        }
        if (typeof b == "object" && b.timeRemaining && b.timeRemaining() > 0 || typeof b == "number") {
          try {
            G(10);
          } catch (N) {
            console.error("Error in callback:", N);
          }
          (typeof b == "object" && !b.didTimeout || typeof b == "number") && (m = E(W));
        }
      }
      function at() {
        m = E(W);
      }
      function Y() {
        m && (H(m), m = null);
      }
      function ut() {
        E(W);
      }
      return {
        start: at,
        stop: Y,
        trigger: ut,
        preLoads: G,
        preLoad: A,
        rePreLoads: x
      };
    }
    P(() => {
    }), et(() => {
      u.stop();
    });
    function S() {
      r(!0);
    }
    function z() {
      r();
    }
    function U() {
      r(!0);
    }
    return X(() => o.value.slice(a.index, a.index + t.renderCount), () => {
      s || r(!0);
    }), X(() => o.value.length, () => {
      s || r(!0);
    }), () => c("div", null, [c(St, {
      list: o.value.slice(a.index, a.index + t.renderCount)
    }, null), c("div", {
      style: {
        height: k() + "px"
      },
      "data-length": o.value.length,
      ref: (m) => l = m,
      class: "r-scroll-virtual-falls-list"
    }, null)]);
  }
});
function It(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Object]" && !ht(t);
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
}, At = /* @__PURE__ */ w({
  props: {
    item: [Object, Array, String, Number],
    index: Number
  },
  setup(t, n) {
    const l = J("RScrollVirtualGridListContext") || {};
    let s;
    const e = new IntersectionObserver(([u]) => {
      u.isIntersecting && (l.context.emit("itemVisible", t), o());
    });
    function o() {
      typeof t.item == "object" && t.item.__markVisible !== l.markVisible && (t.item.__markVisible = l.markVisible, l.context.emit("itemMarkVisible", t));
    }
    return P(() => {
      e.observe(s);
    }), mt(() => {
      e.disconnect();
    }), () => c("div", {
      ref: (u) => s = u
    }, [p(n.slots, "default", t)]);
  }
}), Dt = /* @__PURE__ */ w({
  props: {
    ...lt
  },
  setup(t, n) {
    const l = J("RScrollVirtualGridListContext") || {};
    function s(e) {
      typeof e.item == "object" && e.item.__markCount !== l.markCount && (e.item.__markCount = l.markCount, l.context.emit("itemMarkRender", e));
    }
    return () => j(l.renderList, (e, o) => {
      let u;
      return s(e), c(At, {
        "data-index": e.index,
        class: "r-scroll-virtual-grid-list-item",
        style: e.style,
        item: e.item,
        index: e.index,
        key: t.keyExtractor(e)
      }, It(u = p(l.slots, "default", e)) ? u : {
        default: () => [u]
      });
    });
  }
}), Wt = /* @__PURE__ */ w({
  props: {
    ...lt
  },
  emits: ["itemMarkRender", "itemMarkVisible", "itemVisible"],
  setup(t, n) {
    let l = {
      index: void 0
    }, s;
    const e = () => window.innerHeight, o = M(() => `calc( ${100 / t.columns}% - ${(t.columns - 1) * t.gap / t.columns}px )`), u = M(() => (t.listHook ? t.listHook.list : t.list) || []), d = M(() => u.value.length ? (t.avgHeight + t.gap) * Math.ceil(u.value.length / t.columns) - t.gap + t.bothEndsHeight * 2 : 0), a = Q({
      onScroll(v, f) {
        B();
      },
      onResize(v, f) {
        B();
      }
    }), i = K({
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
    function h(v) {
      return `calc( ${100 / t.columns * v}% - ${(t.columns - 1) * t.gap / t.columns * v}px + ${v * t.gap}px )`;
    }
    function y(v, f = 0, r = []) {
      return a.context.element.scrollTop, a.getOffsetTop(s), v >= u.value.length ? r : (bt(t.columns, (_) => {
        if (v >= 0) {
          const k = Math.floor(v / t.columns);
          let F = k * (t.avgHeight + t.gap) + t.bothEndsHeight + "px";
          k === 0 && (F = t.bothEndsHeight + "px");
          const S = h(_), z = o.value, U = t.avgHeight + "px";
          r.push({
            index: v,
            style: {
              top: F,
              left: S,
              width: z,
              height: U
            },
            item: u.value[v]
          });
        }
        v++;
      }), f = f + t.avgHeight + t.gap, f < window.innerHeight + e() * 2 ? y(v, f, r) : r);
    }
    function T(v = !0) {
      if (!a.context.element) return;
      const f = a.context.element.scrollTop, r = a.getOffsetTop(s);
      if (r - f - window.innerHeight - e() > 0) return;
      let k = Math.floor(e() / (t.avgHeight + t.gap)) * t.columns, S = Math.floor((f - r) / (t.avgHeight + t.gap)) * t.columns - k;
      l.index === S && v || (l.index = S, i.renderList = y(S));
    }
    let V;
    function B(v = !0) {
      if (!t.openAnimationFrame) return T(v);
      cancelAnimationFrame(V), V = requestAnimationFrame(() => {
        T(v);
      });
    }
    return () => (B(!1), c("div", {
      "data-length": u.value.length,
      ref: (v) => s = v,
      style: {
        height: d.value + "px"
      },
      class: "r-scroll-virtual-grid-list"
    }, [c(Dt, {
      keyExtractor: t.keyExtractor
    }, null)]));
  }
});
export {
  Gt as RScrollVirtualFallsListV3,
  Wt as RScrollVirtualGridList,
  Pt as VRPaginationLoading,
  jt as VRTabs,
  Ut as VRVirtualFallsList,
  zt as VRVirtualGridList
};
//# sourceMappingURL=index.js.map
