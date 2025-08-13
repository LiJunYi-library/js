import { createElementBlock as E, openBlock as b, mergeProps as N, renderSlot as m, Fragment as R, renderList as C, normalizeClass as w, createTextVNode as y, toDisplayString as I, defineComponent as x, onMounted as h, onUnmounted as T, watch as U, createVNode as n, useSlots as L, computed as H, toRaw as V, withDirectives as F, vModelText as A, render as $ } from "vue";
import { findParentByLocalName as _ } from "@rainbow_ljy/rainbow-element";
const P = ["value"], M = ["trigger", "value", "onClick"], z = {
  __name: "index",
  props: {
    trigger: { type: String, default: "click" },
    keyExtractor: { type: Function, default: (o, i) => i },
    listHook: { type: Object, default: () => ({}) }
  },
  setup(o) {
    return (i, f) => {
      var a;
      return b(), E("r-tabs", N({
        value: o.listHook.value
      }, { ...i.$attrs }), [
        (b(!0), E(R, null, C(((a = o.listHook) == null ? void 0 : a.list) ?? [], (e, s) => {
          var u, k;
          return b(), E("r-tab-item", {
            key: o.keyExtractor(e, s),
            trigger: o.trigger,
            value: (k = (u = o.listHook) == null ? void 0 : u.formatterValue) == null ? void 0 : k.call(u, e, s),
            class: w(["v-r-tab-item", "v-r-tab-item" + s]),
            onClick: (d) => {
              var t, r;
              return (r = (t = o.listHook) == null ? void 0 : t.onSelect) == null ? void 0 : r.call(t, e, s);
            }
          }, [
            m(i.$slots, "default", {
              item: e,
              index: s
            }, () => {
              var d, t;
              return [
                y(I((t = (d = o.listHook) == null ? void 0 : d.formatterLabel) == null ? void 0 : t.call(d, e, s)), 1)
              ];
            })
          ], 10, M);
        }), 128)),
        m(i.$slots, "active")
      ], 16, P);
    };
  }
}, X = z, Y = /* @__PURE__ */ x({
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
  setup(o, i) {
    let f, a = document.createElement("div");
    h(e), T(s);
    function e() {
      a = _(["r-scroll", "r-scroll-view", "r-nested-scroll"], f.$el), a && a.addEventListener("scrollUp", u);
    }
    function s() {
      a && a.removeEventListener("scrollUp", u);
    }
    function u(l) {
      if (!a) return;
      const g = a.scrollHeight - a.offsetHeight - o.triggerBottomDistance;
      a.scrollTop >= g && (i.emit("rollToBottom", l), i.emit("scrollArriveBottom", l));
    }
    function k() {
      return m(i.slots, "loading", {}, () => [n("div", {
        class: "r-pagination-loading-loading"
      }, [n("div", {
        class: "r-pagination-loading-loading-prve"
      }, null), n("div", {
        class: "r-pagination-loading-loading-text"
      }, [y("加载中--")]), n("div", {
        class: "r-pagination-loading-loading-next"
      }, null)])]);
    }
    function d() {
      return m(i.slots, "finished", {}, () => [n("div", {
        class: "r-pagination-loading-finished"
      }, [n("div", {
        class: "r-pagination-loading-finished-prve"
      }, null), n("div", {
        class: "r-pagination-loading-finished-text"
      }, [y("没有更多的了")]), n("div", {
        class: "r-pagination-loading-finished-next"
      }, null)])]);
    }
    function t() {
      return m(i.slots, "empty", {}, () => n("div", {
        class: "r-result-empty"
      }, [y("kkkk")]));
    }
    function r() {
      return m(i.slots, "begin", {}, () => [n("div", {
        class: "r-pagination-loading-begin"
      }, [n("div", {
        class: "r-pagination-loading-begin-loading"
      }, [n("div", {
        class: "r-pagination-loading-begin-prve"
      }, null), n("div", {
        class: "r-pagination-loading-begin-text"
      }, [y("加载中")]), n("div", {
        class: "r-pagination-loading-begin-next"
      }, null)]), n("div", {
        class: "r-pagination-loading-begin-skeleton"
      }, [C(o.skeletonCount, () => n("div", {
        class: "r-pagination-loading-begin-skeleton-item"
      }, null))])])]);
    }
    function c() {
      var l, g;
      o.onBeginErrorClick ? o.onBeginErrorClick(...arg) : (g = (l = o.loadingHook) == null ? void 0 : l.nextBeginSend) == null || g.call(l);
    }
    function D() {
      return m(i.slots, "error", {}, () => n("div", {
        onClick: c,
        class: "r-result-begin-error"
      }, [y("begin-error")]));
    }
    function S(...l) {
      var g, v;
      o.onErrorLoadClick ? o.onErrorLoadClick(...l) : (v = (g = o.loadingHook) == null ? void 0 : g.awaitSend) == null || v.call(g);
    }
    function j() {
      return m(i.slots, "errorLoad", {}, () => [n("div", {
        class: "r-pagination-loading-error",
        onClick: S
      }, [n("div", {
        class: "r-pagination-loading-error-prve"
      }, null), n("div", {
        class: "r-pagination-loading-error-text"
      }, [y("出错了 点击重新加载")]), n("div", {
        class: "r-pagination-loading-error-next"
      }, null)])]);
    }
    function O() {
      const l = o.loadingHook;
      if (l.error === !0) return j();
      if (l.empty === !0 && l.finished === !0) return t();
      if (l.finished === !0) return d();
      if (l.loading === !0) return k();
    }
    return U(() => o.loadingHook.begin, async () => {
      console.log("console--", [f.$el]);
    }), (l, g) => {
      var p, B;
      f = l;
      const v = o.loadingHook;
      return v.begin === !0 && v.error === !0 ? D() : v.begin === !0 ? r() : [(B = (p = i.slots) == null ? void 0 : p.default) == null ? void 0 : B.call(p), O()];
    };
  }
}), G = ["keyExtractor"], q = {
  __name: "index",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    keyExtractor: {
      type: Function,
      default: (o) => o.item
    },
    listHook: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(o, {
    emit: i
  }) {
    const f = L(), a = i, e = o, s = H({
      set(t) {
        if (e.listHook.list) return e.listHook.list = t;
        a("update:modelValue", t);
      },
      get() {
        return e.listHook.list ? V(e.listHook.list) : V(e.modelValue);
      }
    }), u = H(() => e.listHook.list ? e.listHook.list : e.modelValue), k = /* @__PURE__ */ x({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(t) {
        return () => {
          var r, c;
          return (c = (r = t == null ? void 0 : t.slots) == null ? void 0 : r.item) == null ? void 0 : c.call(r, t.event);
        };
      }
    });
    function d(t) {
      t.item = u.value[t.index], $(n(k, {
        event: t,
        slots: f,
        key: e.keyExtractor(t),
        "data-key": e.keyExtractor(t)
      }, null), t.ele);
    }
    return (t, r) => F((b(), E("r-scroll-virtual-grid-list", {
      "onUpdate:modelValue": r[0] || (r[0] = (c) => s.value = c),
      onrenderItems: d,
      keyExtractor: e.keyExtractor
    }, [m(t.$slots, "default")], 8, G)), [[A, s.value]]);
  }
}, Z = q, J = ["keyExtractor"], K = {
  __name: "index",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    keyExtractor: {
      type: Function,
      default: (o) => o.item
    },
    listHook: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(o, {
    emit: i
  }) {
    const f = L(), a = i, e = o, s = H({
      set(t) {
        if (e.listHook.list) return e.listHook.list = t;
        a("update:modelValue", t);
      },
      get() {
        return e.listHook.list ? V(e.listHook.list) : V(e.modelValue);
      }
    }), u = H(() => e.listHook.list ? e.listHook.list : e.modelValue), k = /* @__PURE__ */ x({
      inheritAttrs: !1,
      props: {
        event: Object,
        slots: Object
      },
      setup(t) {
        return h(() => {
        }), () => {
          var r, c;
          return (c = (r = t == null ? void 0 : t.slots) == null ? void 0 : r.item) == null ? void 0 : c.call(r, t.event);
        };
      }
    });
    function d(t) {
      t.item = u.value[t.index], $(n(k, {
        event: t,
        slots: f,
        key: e.keyExtractor(t),
        "data-key": e.keyExtractor(t)
      }, null), t.ele);
    }
    return (t, r) => F((b(), E("r-scroll-virtual-falls-list", {
      "onUpdate:modelValue": r[0] || (r[0] = (c) => s.value = c),
      onrenderItems: d,
      keyExtractor: e.keyExtractor
    }, [m(t.$slots, "default")], 8, J)), [[A, s.value]]);
  }
}, tt = K;
export {
  Y as VRPaginationLoading,
  X as VRTabs,
  tt as VRVirtualFallsList,
  Z as VRVirtualGridList
};
//# sourceMappingURL=index.js.map
