import { fetchHOC as p, list as h, listLoad as x, listMultiple as F, listPagination as L, listRadio as P, promiseAbortController as S } from "@rainbow_ljy/rainbow-js";
import { useState as v, useRef as b, useMemo as l } from "react";
function y(t) {
  const [, f] = v(t), o = b(t);
  return l(() => ({
    __v_isRef: !0,
    set value(n) {
      o.current = n, f(n);
    },
    get value() {
      return o.current;
    },
    toRef(n) {
      return o.current = n, {
        __v_isRef: !0,
        set value(r) {
          o.current = r, f(r);
        },
        get value() {
          return o.current;
        }
      };
    }
  }), []);
}
function e() {
  const [, t] = v(), f = b();
  return l(() => ({
    get value() {
      return f.current;
    },
    toRef(o) {
      return f.current = o, {
        __v_isRef: !0,
        set value(n) {
          f.current = n, t(n);
        },
        get value() {
          return f.current;
        }
      };
    }
  }), []);
}
function i(t) {
  return l(t, []);
}
function C(t, f, o, n) {
  const r = t == null ? void 0 : t[f];
  return r instanceof Function ? r(o) : r || (n instanceof Function ? n(o) : n);
}
function O(t = {}) {
  return function(o = {}) {
    const n = e(), r = e(), R = e(), s = e(), c = e();
    return l(() => p(t)({
      loadingRef: n.toRef,
      beginRef: r.toRef,
      errorRef: R.toRef,
      dataRef: s.toRef,
      errorDataRef: c.toRef,
      ...o
    }), []);
  };
}
function k(t = {}) {
  const f = e(), o = e(), n = e(), r = e(), R = e(), s = e(), c = e(), u = e(), a = e(), g = e(), d = e(), m = e();
  return i(
    () => h({
      currentPageRef: f.toRef,
      pageSizeRef: o.toRef,
      totalRef: n.toRef,
      listDataRef: r.toRef,
      filterFunRef: R.toRef,
      sortFunRef: s.toRef,
      manageListFunRef: c.toRef,
      selectRef: u.toRef,
      valueRef: a.toRef,
      labelRef: g.toRef,
      indexRef: d.toRef,
      listRef: m.toRef,
      ...t
    })
  );
}
function A(t) {
  const f = e(), o = e(), n = e(), r = e(), R = e(), s = e(), c = e(), u = e(), a = e(), g = e(), d = e();
  return i(
    () => x({
      selectRef: f.toRef,
      valueRef: o.toRef,
      labelRef: n.toRef,
      indexRef: r.toRef,
      listRef: R.toRef,
      beginRef: s.toRef,
      finishedRef: c.toRef,
      emptyRef: u.toRef,
      totalRef: a.toRef,
      currentPageRef: g.toRef,
      pageSizeRef: d.toRef,
      ...t
    })
  );
}
function _(t = {}) {
  const f = e(), o = e(), n = e(), r = e(), R = e();
  return i(
    () => F({
      selectRef: f.toRef,
      valueRef: o.toRef,
      labelRef: n.toRef,
      indexRef: r.toRef,
      listRef: R.toRef,
      ...t
    })
  );
}
function H(t = {}) {
  const f = e(), o = e(), n = e(), r = e(), R = e(), s = e(), c = e(), u = e(), a = e();
  return i(
    () => L({
      selectRef: f.toRef,
      valueRef: o.toRef,
      labelRef: n.toRef,
      indexRef: r.toRef,
      listRef: R.toRef,
      emptyRef: s.toRef,
      totalRef: c.toRef,
      currentPageRef: u.toRef,
      pageSizeRef: a.toRef,
      ...t
    })
  );
}
function z(t = {}) {
  const f = e(), o = e(), n = e(), r = e(), R = e();
  return i(
    () => P({
      selectRef: f.toRef,
      valueRef: o.toRef,
      labelRef: n.toRef,
      indexRef: r.toRef,
      listRef: R.toRef,
      ...t
    })
  );
}
function j(t = {}) {
  return t.isMultiple ? _(t) : z(t);
}
function q(t, f = {}) {
  const o = e(), n = e(), r = e(), R = e(), s = e();
  return i(
    () => S(t, {
      loadingRef: o.toRef,
      beginRef: n.toRef,
      errorRef: r.toRef,
      dataRef: R.toRef,
      errorDataRef: s.toRef,
      ...f
    })
  );
}
export {
  y as ref,
  C as renderSlot,
  O as useFetchHOC,
  k as useList,
  A as useListLoad,
  _ as useListMultiple,
  H as useListPagination,
  z as useListRadio,
  j as useListSelect,
  e as useMemoRef,
  i as useOneceMemo,
  q as usePromise
};
//# sourceMappingURL=index.js.map
