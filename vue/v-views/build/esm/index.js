import { defineComponent as B, cloneVNode as me, Comment as oe, ref as x, watch as ne, onMounted as G, onUnmounted as le, renderList as J, createVNode as d, h as ke, renderSlot as C, useSlots as ie, computed as N, toRaw as _, withDirectives as se, createElementBlock as ae, openBlock as ue, vModelText as ce, render as de } from "vue";
import { objectForIn as ye } from "@rainbow_ljy/rainbow-js";
import { resizeObserver as be, findParentByLocalName as ve } from "@rainbow_ljy/rainbow-element";
const Ie = B({
  props: {},
  setup(e, l) {
    return () => {
      var n, s;
      const a = (f) => f.type !== oe, u = (((s = (n = l.slots) == null ? void 0 : n.default) == null ? void 0 : s.call(n)) || []).filter(a), r = (f) => {
        var y, t;
        return (((t = (y = l.slots) == null ? void 0 : y.symbol) == null ? void 0 : t.call(y, f)) || []).filter(a);
      };
      return u.map(
        (f, y) => y === 0 ? f : [r(y).map((t) => me(t)), f]
      ).flat(1 / 0);
    };
  }
});
function re(e, l, a) {
  if (e.type === oe) return e;
  let u = a;
  typeof e.type != "string" && (u = () => a);
  let r = ke(e.type, l, u);
  ye(e, (s, f) => {
    ["props", "type", "children", "el", "patchFlag", "shapeFlag", "ref"].includes(f) || (r[f] = s);
  });
  const n = [e.ref, r.ref].filter(Boolean);
  return r.ref = n.length ? n : null, r;
}
const Te = /* @__PURE__ */ B({
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
  setup(e, l) {
    const a = x(document.createElement("div")), u = x();
    let r;
    const n = x(), s = be(g);
    ne(n, P), G(z), le(M);
    function f(o) {
      u.value = o;
    }
    function y(o) {
      a.value = o;
    }
    function t(o, c, i) {
      var h, p;
      (p = (h = e.listHook) == null ? void 0 : h.same) != null && p.call(h, c, i) && (n.value = o);
    }
    async function m(o, c, i) {
      var p, V, D, k;
      if (e.stopPropagation && o.stopPropagation(), e.preventDefault && o.preventDefault(), e.beforeTrigger && await e.beforeTrigger(c, i, o), (V = (p = e.listHook) == null ? void 0 : p.formatterDisabled) != null && V.call(p, c, i)) {
        l.emit("disabledTrigger", c, i, o);
        return;
      }
      if (await ((k = (D = e.listHook) == null ? void 0 : D.onSelect) == null ? void 0 : k.call(D, c, i))) {
        l.emit("sameTrigger", c, i, o);
        return;
      }
      l.emit("change", c, i, o), n.value = o.currentTarget;
    }
    function v(o, c = "smooth") {
      const i = a.value;
      if (!o) {
        i.style.position = "absolute", i.style.width = "0px", i.style.height = "0px", i.style.left = "0px", i.style.top = "0px";
        return;
      }
      e.unScrollIntoView || o.scrollIntoView({
        behavior: c,
        block: "center",
        inline: "center"
      }), c === "smooth" && i.classList.add("select-active-transition"), i.style.position = "absolute", i.style.width = o.offsetWidth + "px", i.style.height = o.offsetHeight + "px", i.style.left = `${o.offsetLeft}px`, i.style.top = `${o.offsetTop}px`;
    }
    function U() {
      a.value.classList.remove("select-active-transition");
    }
    function P(o, c) {
      c && s.unobserve(c), v(n.value), o && s.observe(o);
    }
    function z() {
    }
    function M() {
      s.disconnect();
    }
    function g() {
      v(n.value, "instant");
    }
    function H() {
    }
    function L(o, c, i) {
      r = i;
    }
    function I() {
    }
    function T(o) {
      o.preventDefault();
    }
    function Le(o) {
    }
    function Ce(o) {
    }
    function fe(o, c, i) {
      o.preventDefault(), e.listHook.changeIndex(r, i);
    }
    return () => {
      var h, p, V, D;
      const o = J(e.listHook.list, (k, E) => {
        var w, K;
        const W = (K = (w = l.slots) == null ? void 0 : w.item) == null ? void 0 : K.call(w, {
          item: k,
          index: E
        });
        let q = W;
        return q = W.map((S) => {
          var A, Q, F, X, $, Y, O, Z, R, ee, j, te;
          n.value = void 0;
          const ge = e.draggable ? {
            draggable: !0,
            onDrag: (b) => void 0,
            onDragstart: (b) => L(b, k, E),
            onDragend: (b) => void 0,
            onDragover: (b) => T(b),
            onDragenter: (b) => void 0,
            onDragleave: (b) => void 0,
            onDrop: (b) => fe(b, k, E)
          } : {
            [e.eventName]: (b) => m(b, k, E)
          };
          return re(S, {
            disabled: (Q = (A = e.listHook) == null ? void 0 : A.formatterDisabled) == null ? void 0 : Q.call(A, k, E),
            ...ge,
            ...S.props,
            ref: (b) => t(b, k, E),
            class: [S.props.class, "select-item", ((X = (F = e.listHook) == null ? void 0 : F.same) == null ? void 0 : X.call(F, e.listHook.list[E + 1], E + 1)) && "select-item-prve-checked", ((Y = ($ = e.listHook) == null ? void 0 : $.same) == null ? void 0 : Y.call($, k, E)) && "select-item-checked", ((Z = (O = e.listHook) == null ? void 0 : O.same) == null ? void 0 : Z.call(O, e.listHook.list[E - 1], E - 1)) && "select-item-next-checked", ((ee = (R = e.listHook) == null ? void 0 : R.formatterDisabled) == null ? void 0 : ee.call(R, k, E)) && "select-item-disabled"]
          }, [S.children ?? (e.hideItemDefaultChildren || (te = (j = e.listHook) == null ? void 0 : j.formatterLabel) == null ? void 0 : te.call(j, k, E))].filter((b) => b !== void 0));
        }), q;
      }), c = (p = (h = l.slots) == null ? void 0 : h.default) == null ? void 0 : p.call(h), i = [...o, d("div", {
        ref: y,
        class: ["select-active"],
        onTransitionend: U
      }, null), (D = (V = l.slots) == null ? void 0 : V.children) == null ? void 0 : D.call(V)];
      return c != null && c.length ? c.map((k) => re(k, {
        ...k.props,
        ref: f,
        class: [k.props.class, "select-list"]
      }, i)) : i;
    };
  }
}), we = /* @__PURE__ */ B({
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
  setup(e, l) {
    let a, u = document.createElement("div");
    G(r), le(n);
    function r() {
      u = ve(["r-scroll", "r-scroll-view", "r-nested-scroll"], a.$el), u && u.addEventListener("scrollUp", s);
    }
    function n() {
      u && u.removeEventListener("scrollUp", s);
    }
    function s(g) {
      if (!u) return;
      const H = u.scrollHeight - u.offsetHeight - e.triggerBottomDistance;
      u.scrollTop >= H && (l.emit("rollToBottom", g), l.emit("scrollArriveBottom", g));
    }
    function f() {
      var g, H;
      e.onBeginErrorClick ? e.onBeginErrorClick(...arg) : (H = (g = e.loadingHook) == null ? void 0 : g.nextBeginSend) == null || H.call(g);
    }
    function y(...g) {
      var H, L;
      e.onErrorLoadClick ? e.onErrorLoadClick(...g) : (L = (H = e.loadingHook) == null ? void 0 : H.awaitSend) == null || L.call(H);
    }
    function t() {
      return C(l.slots, "loading", {}, () => [d("r-result", {
        class: "r-result-loading"
      }, null)]);
    }
    function m() {
      return C(l.slots, "finished", {}, () => [d("r-result", {
        class: "r-result-finished"
      }, null)]);
    }
    function v() {
      return C(l.slots, "empty", {}, () => [d("r-result", {
        class: "r-result-empty"
      }, null)]);
    }
    function U() {
      return C(l.slots, "begin", {}, () => [d("div", null, [d("r-result", {
        class: "r-result-loading"
      }, null), d("div", {
        class: "r-skeleton-grid"
      }, [J(e.skeletonCount, () => d("div", {
        class: "r-skeleton-animation"
      }, null))])])]);
    }
    function P() {
      return C(l.slots, "error", {}, () => [d("r-result", {
        onClick: f,
        class: "r-result-begin-error"
      }, null)]);
    }
    function z() {
      return C(l.slots, "errorLoad", {}, () => [d("r-result", {
        onClick: y,
        class: "r-result-error"
      }, null)]);
    }
    function M() {
      const g = e.loadingHook;
      if (g.error === !0) return z();
      if (g.empty === !0 && g.finished === !0) return v();
      if (g.finished === !0) return m();
      if (g.loading === !0) return t();
    }
    return ne(() => e.loadingHook.begin, async () => {
      console.log("console--", [a.$el]);
    }), (g, H) => {
      var I, T;
      a = g;
      const L = e.loadingHook;
      return L.begin === !0 && L.error === !0 ? P() : L.begin === !0 ? U() : [(T = (I = l.slots) == null ? void 0 : I.default) == null ? void 0 : T.call(I), M()];
    };
  }
}), Se = /* @__PURE__ */ B({
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
  setup(e, l) {
    function a(n, s) {
      return C(l.slots, n, {}, () => [s]);
    }
    function u() {
      var n, s;
      e.onBeginErrorClick ? e.onBeginErrorClick(...arg) : (s = (n = e.loadingHook) == null ? void 0 : n.afreshNextBeginSend) == null || s.call(n);
    }
    function r(...n) {
      var s, f;
      e.onErrorLoadClick ? e.onErrorLoadClick(...n) : (f = (s = e.loadingHook) == null ? void 0 : s.continueAwaitSend) == null || f.call(s);
    }
    return () => [a("begin", d("div", {
      slot: "begin"
    }, [d("r-result", {
      slot: "loading",
      class: "r-result-loading"
    }, null), d("div", {
      class: "r-skeleton-grid"
    }, [J(e.skeletonCount ?? 10, () => d("div", {
      class: "r-skeleton-animation"
    }, null))])])), a("loading", d("r-result", {
      slot: "loading",
      class: "r-result-loading"
    }, null)), a("finished", d("r-result", {
      slot: "finished",
      class: "r-result-finished"
    }, null)), a("empty", d("r-result", {
      slot: "empty",
      class: "r-result-empty"
    }, null)), a("error", d("r-result", {
      slot: "error",
      class: "r-result-error",
      onClick: r
    }, null)), a("begin-error", d("r-result", {
      slot: "begin-error",
      class: "r-result-begin-error",
      onClick: u
    }, null))];
  }
}), Ee = ["keyExtractor"], He = {
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
    emit: l
  }) {
    const a = ie(), u = l, r = e, n = N({
      set(t) {
        if (r.listHook.list) return r.listHook.list = t;
        u("update:modelValue", t);
      },
      get() {
        return r.listHook.list ? _(r.listHook.list) : _(r.modelValue);
      }
    }), s = N(() => r.listHook.list ? r.listHook.list : r.modelValue), f = /* @__PURE__ */ B({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(t) {
        return () => {
          var m, v;
          return (v = (m = t == null ? void 0 : t.slots) == null ? void 0 : m.item) == null ? void 0 : v.call(m, t.event);
        };
      }
    });
    function y(t) {
      t.item = s.value[t.index], de(d(f, {
        event: t,
        slots: a,
        key: r.keyExtractor(t),
        "data-key": r.keyExtractor(t)
      }, null), t.ele);
    }
    return (t, m) => se((ue(), ae("r-scroll-virtual-grid-list", {
      "onUpdate:modelValue": m[0] || (m[0] = (v) => n.value = v),
      onrenderItems: y,
      keyExtractor: r.keyExtractor
    }, [C(t.$slots, "default")], 8, Ee)), [[ce, n.value]]);
  }
}, Ae = He, he = ["keyExtractor"], pe = {
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
    emit: l
  }) {
    const a = ie(), u = l, r = e, n = N({
      set(t) {
        if (r.listHook.list) return r.listHook.list = t;
        u("update:modelValue", t);
      },
      get() {
        return r.listHook.list ? _(r.listHook.list) : _(r.modelValue);
      }
    }), s = N(() => r.listHook.list ? r.listHook.list : r.modelValue), f = /* @__PURE__ */ B({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(t) {
        return G(() => {
        }), () => {
          var m, v;
          return (v = (m = t == null ? void 0 : t.slots) == null ? void 0 : m.item) == null ? void 0 : v.call(m, t.event);
        };
      }
    });
    function y(t) {
      t.item = s.value[t.index], de(d(f, {
        event: t,
        slots: a,
        key: r.keyExtractor(t),
        "data-key": r.keyExtractor(t)
      }, null), t.ele);
    }
    return (t, m) => se((ue(), ae("r-scroll-virtual-falls-list", {
      "onUpdate:modelValue": m[0] || (m[0] = (v) => n.value = v),
      onrenderItems: y,
      keyExtractor: r.keyExtractor
    }, [C(t.$slots, "default")], 8, he)), [[ce, n.value]]);
  }
}, Fe = pe;
export {
  Ie as VRJoin,
  we as VRPaginationLoading,
  Te as VRRenderList,
  Se as VRScrollLoadStates,
  Fe as VRVirtualFallsList,
  Ae as VRVirtualGridList
};
//# sourceMappingURL=index.js.map
