import { defineComponent as I, ref as M, watch as oe, onMounted as G, onUnmounted as ne, renderList as W, createVNode as c, Comment as ge, h as me, renderSlot as C, useSlots as le, computed as _, toRaw as N, withDirectives as ie, createElementBlock as se, openBlock as ae, vModelText as ue, render as ce } from "vue";
import { objectForIn as ke } from "@rainbow_ljy/rainbow-js";
import { resizeObserver as ye, findParentByLocalName as be } from "@rainbow_ljy/rainbow-element";
function re(e, i, a) {
  if (e.type === ge) return e;
  let d = a;
  typeof e.type != "string" && (d = () => a);
  let r = me(e.type, i, d);
  ke(e, (s, b) => {
    ["props", "type", "children", "el", "patchFlag", "shapeFlag", "ref"].includes(b) || (r[b] = s);
  });
  const l = [e.ref, r.ref].filter(Boolean);
  return r.ref = l.length ? l : null, r;
}
const Be = /* @__PURE__ */ I({
  props: {
    listHook: {
      type: Object,
      default: () => ({})
    },
    beforeTrigger: {
      type: Function,
      default: () => {
      }
    },
    eventName: {
      type: String,
      default: "onClick"
    },
    hideItemDefaultChildren: Boolean,
    stopPropagation: Boolean,
    preventDefault: Boolean,
    draggable: {
      type: Boolean,
      default: !1
    },
    unScrollIntoView: Boolean
  },
  emits: ["change", "disabledTrigger", "sameTrigger"],
  setup(e, i) {
    const a = M(document.createElement("div")), d = M();
    let r;
    const l = M(), s = ye(f);
    oe(l, U), G(x), ne(z);
    function b(o) {
      d.value = o;
    }
    function D(o) {
      a.value = o;
    }
    function t(o, u, n) {
      var H, h;
      (h = (H = e.listHook) == null ? void 0 : H.same) != null && h.call(H, u, n) && (l.value = o);
    }
    async function g(o, u, n) {
      var h, V, p, m;
      if (e.stopPropagation && o.stopPropagation(), e.preventDefault && o.preventDefault(), e.beforeTrigger && await e.beforeTrigger(u, n, o), (V = (h = e.listHook) == null ? void 0 : h.formatterDisabled) != null && V.call(h, u, n)) {
        i.emit("disabledTrigger", u, n, o);
        return;
      }
      if (await ((m = (p = e.listHook) == null ? void 0 : p.onSelect) == null ? void 0 : m.call(p, u, n))) {
        i.emit("sameTrigger", u, n, o);
        return;
      }
      i.emit("change", u, n, o), l.value = o.currentTarget;
    }
    function y(o, u = "smooth") {
      const n = a.value;
      if (!o) {
        n.style.position = "absolute", n.style.width = "0px", n.style.height = "0px", n.style.left = "0px", n.style.top = "0px";
        return;
      }
      e.unScrollIntoView || o.scrollIntoView({
        behavior: u,
        block: "center",
        inline: "center"
      }), u === "smooth" && n.classList.add("select-active-transition"), n.style.position = "absolute", n.style.width = o.offsetWidth + "px", n.style.height = o.offsetHeight + "px", n.style.left = `${o.offsetLeft}px`, n.style.top = `${o.offsetTop}px`;
    }
    function P() {
      a.value.classList.remove("select-active-transition");
    }
    function U(o, u) {
      u && s.unobserve(u), y(l.value), o && s.observe(o);
    }
    function x() {
    }
    function z() {
      s.disconnect();
    }
    function f() {
      y(l.value, "instant");
    }
    function E() {
    }
    function L(o, u, n) {
      r = n;
    }
    function B() {
    }
    function T(o) {
      o.preventDefault();
    }
    function Le(o) {
    }
    function Ce(o) {
    }
    function de(o, u, n) {
      o.preventDefault(), e.listHook.changeIndex(r, n);
    }
    return () => {
      var H, h, V, p;
      const o = W(e.listHook.list, (m, v) => {
        var w, K;
        const q = (K = (w = i.slots) == null ? void 0 : w.item) == null ? void 0 : K.call(w, {
          item: m,
          index: v
        });
        let J = q;
        return J = q.map((S) => {
          var A, Q, F, X, $, Y, O, Z, j, ee, R, te;
          l.value = void 0;
          const fe = e.draggable ? {
            draggable: !0,
            onDrag: (k) => void 0,
            onDragstart: (k) => L(k, m, v),
            onDragend: (k) => void 0,
            onDragover: (k) => T(k),
            onDragenter: (k) => void 0,
            onDragleave: (k) => void 0,
            onDrop: (k) => de(k, m, v)
          } : {
            [e.eventName]: (k) => g(k, m, v)
          };
          return re(S, {
            disabled: (Q = (A = e.listHook) == null ? void 0 : A.formatterDisabled) == null ? void 0 : Q.call(A, m, v),
            ...fe,
            ...S.props,
            ref: (k) => t(k, m, v),
            class: [S.props.class, "select-item", ((X = (F = e.listHook) == null ? void 0 : F.same) == null ? void 0 : X.call(F, e.listHook.list[v + 1], v + 1)) && "select-item-prve-checked", ((Y = ($ = e.listHook) == null ? void 0 : $.same) == null ? void 0 : Y.call($, m, v)) && "select-item-checked", ((Z = (O = e.listHook) == null ? void 0 : O.same) == null ? void 0 : Z.call(O, e.listHook.list[v - 1], v - 1)) && "select-item-next-checked", ((ee = (j = e.listHook) == null ? void 0 : j.formatterDisabled) == null ? void 0 : ee.call(j, m, v)) && "select-item-disabled"]
          }, [S.children ?? (e.hideItemDefaultChildren || (te = (R = e.listHook) == null ? void 0 : R.formatterLabel) == null ? void 0 : te.call(R, m, v))].filter((k) => k !== void 0));
        }), J;
      }), u = (h = (H = i.slots) == null ? void 0 : H.default) == null ? void 0 : h.call(H), n = [...o, c("div", {
        ref: D,
        class: ["select-active"],
        onTransitionend: P
      }, null), (p = (V = i.slots) == null ? void 0 : V.children) == null ? void 0 : p.call(V)];
      return u != null && u.length ? u.map((m) => re(m, {
        ...m.props,
        ref: b,
        class: [m.props.class, "select-list"]
      }, n)) : n;
    };
  }
}), Ie = /* @__PURE__ */ I({
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
  setup(e, i) {
    let a, d = document.createElement("div");
    G(r), ne(l);
    function r() {
      d = be(["r-scroll", "r-scroll-view", "r-nested-scroll"], a.$el), d && d.addEventListener("scrollUp", s);
    }
    function l() {
      d && d.removeEventListener("scrollUp", s);
    }
    function s(f) {
      if (!d) return;
      const E = d.scrollHeight - d.offsetHeight - e.triggerBottomDistance;
      d.scrollTop >= E && (i.emit("rollToBottom", f), i.emit("scrollArriveBottom", f));
    }
    function b() {
      var f, E;
      e.onBeginErrorClick ? e.onBeginErrorClick(...arg) : (E = (f = e.loadingHook) == null ? void 0 : f.nextBeginSend) == null || E.call(f);
    }
    function D(...f) {
      var E, L;
      e.onErrorLoadClick ? e.onErrorLoadClick(...f) : (L = (E = e.loadingHook) == null ? void 0 : E.awaitSend) == null || L.call(E);
    }
    function t() {
      return C(i.slots, "loading", {}, () => [c("r-result", {
        class: "r-result-loading"
      }, null)]);
    }
    function g() {
      return C(i.slots, "finished", {}, () => [c("r-result", {
        class: "r-result-finished"
      }, null)]);
    }
    function y() {
      return C(i.slots, "empty", {}, () => [c("r-result", {
        class: "r-result-empty"
      }, null)]);
    }
    function P() {
      return C(i.slots, "begin", {}, () => [c("div", null, [c("r-result", {
        class: "r-result-loading"
      }, null), c("div", {
        class: "r-skeleton-grid"
      }, [W(e.skeletonCount, () => c("div", {
        class: "r-skeleton-animation"
      }, null))])])]);
    }
    function U() {
      return C(i.slots, "error", {}, () => [c("r-result", {
        onClick: b,
        class: "r-result-begin-error"
      }, null)]);
    }
    function x() {
      return C(i.slots, "errorLoad", {}, () => [c("r-result", {
        onClick: D,
        class: "r-result-error"
      }, null)]);
    }
    function z() {
      const f = e.loadingHook;
      if (f.error === !0) return x();
      if (f.empty === !0 && f.finished === !0) return y();
      if (f.finished === !0) return g();
      if (f.loading === !0) return t();
    }
    return oe(() => e.loadingHook.begin, async () => {
      console.log("console--", [a.$el]);
    }), (f, E) => {
      var B, T;
      a = f;
      const L = e.loadingHook;
      return L.begin === !0 && L.error === !0 ? U() : L.begin === !0 ? P() : [(T = (B = i.slots) == null ? void 0 : B.default) == null ? void 0 : T.call(B), z()];
    };
  }
}), Te = /* @__PURE__ */ I({
  props: {
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
  setup(e, i) {
    function a(l, s) {
      return C(i.slots, l, {}, () => [s]);
    }
    function d() {
      var l, s;
      e.onBeginErrorClick ? e.onBeginErrorClick(...arg) : (s = (l = e.loadingHook) == null ? void 0 : l.afreshNextBeginSend) == null || s.call(l);
    }
    function r(...l) {
      var s, b;
      e.onErrorLoadClick ? e.onErrorLoadClick(...l) : (b = (s = e.loadingHook) == null ? void 0 : s.continueAwaitSend) == null || b.call(s);
    }
    return () => [a("begin", c("div", {
      slot: "begin"
    }, [c("r-result", {
      slot: "loading",
      class: "r-result-loading"
    }, null), c("div", {
      class: "r-skeleton-grid"
    }, [W(e.skeletonCount ?? 10, () => c("div", {
      class: "r-skeleton-animation"
    }, null))])])), a("loading", c("r-result", {
      slot: "loading",
      class: "r-result-loading"
    }, null)), a("finished", c("r-result", {
      slot: "finished",
      class: "r-result-finished"
    }, null)), a("empty", c("r-result", {
      slot: "empty",
      class: "r-result-empty"
    }, null)), a("error", c("r-result", {
      slot: "error",
      class: "r-result-error",
      onClick: r
    }, null)), a("begin-error", c("r-result", {
      slot: "begin-error",
      class: "r-result-begin-error",
      onClick: d
    }, null))];
  }
}), ve = ["keyExtractor"], Ee = {
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
    emit: i
  }) {
    const a = le(), d = i, r = e, l = _({
      set(t) {
        if (r.listHook.list) return r.listHook.list = t;
        d("update:modelValue", t);
      },
      get() {
        return r.listHook.list ? N(r.listHook.list) : N(r.modelValue);
      }
    }), s = _(() => r.listHook.list ? r.listHook.list : r.modelValue), b = /* @__PURE__ */ I({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(t) {
        return () => {
          var g, y;
          return (y = (g = t == null ? void 0 : t.slots) == null ? void 0 : g.item) == null ? void 0 : y.call(g, t.event);
        };
      }
    });
    function D(t) {
      t.item = s.value[t.index], ce(c(b, {
        event: t,
        slots: a,
        key: r.keyExtractor(t),
        "data-key": r.keyExtractor(t)
      }, null), t.ele);
    }
    return (t, g) => ie((ae(), se("r-scroll-virtual-grid-list", {
      "onUpdate:modelValue": g[0] || (g[0] = (y) => l.value = y),
      onrenderItems: D,
      keyExtractor: r.keyExtractor
    }, [C(t.$slots, "default")], 8, ve)), [[ue, l.value]]);
  }
}, we = Ee, He = ["keyExtractor"], he = {
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
    emit: i
  }) {
    const a = le(), d = i, r = e, l = _({
      set(t) {
        if (r.listHook.list) return r.listHook.list = t;
        d("update:modelValue", t);
      },
      get() {
        return r.listHook.list ? N(r.listHook.list) : N(r.modelValue);
      }
    }), s = _(() => r.listHook.list ? r.listHook.list : r.modelValue), b = /* @__PURE__ */ I({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(t) {
        return G(() => {
        }), () => {
          var g, y;
          return (y = (g = t == null ? void 0 : t.slots) == null ? void 0 : g.item) == null ? void 0 : y.call(g, t.event);
        };
      }
    });
    function D(t) {
      t.item = s.value[t.index], ce(c(b, {
        event: t,
        slots: a,
        key: r.keyExtractor(t),
        "data-key": r.keyExtractor(t)
      }, null), t.ele);
    }
    return (t, g) => ie((ae(), se("r-scroll-virtual-falls-list", {
      "onUpdate:modelValue": g[0] || (g[0] = (y) => l.value = y),
      onrenderItems: D,
      keyExtractor: r.keyExtractor
    }, [C(t.$slots, "default")], 8, He)), [[ue, l.value]]);
  }
}, Se = he;
export {
  Ie as VRPaginationLoading,
  Be as VRRenderList,
  Te as VRScrollLoadStates,
  Se as VRVirtualFallsList,
  we as VRVirtualGridList
};
//# sourceMappingURL=index.js.map
