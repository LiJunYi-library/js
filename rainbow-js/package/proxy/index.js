export function ref(value) {
  let v = value;
  return {
    get() {
      return v;
    },
    set(val) {
      v = val;
    },
    value: {
      get() {
        return v;
      },
      set(val) {
        v = val;
      },
    },
  };
}

export function proxy(target) {
  const p = new Proxy(target, {
    get(t, p, r) {
      const v = t[p];
      if (v?.__v_isRef) return v.value;
      if (v?.get) return v.get();
      return v;
    },
    set(t, p, newV) {
      const v = t[p];
      (() => {
        if (v?.__v_isRef) return (v.value = newV);
        if (v?.set) return v.set(newV);
        t[p] = newV;
      })();
      return true;
    },
  });
  p.getPrototype = () => target;
  return p;
}
