export declare function ref<T = any>(
  value: T,
): {
  get: () => T;
  set: (value: T) => {};
  value: T;
};

export declare function proxy<T = any>(target): Proxy<T>;
