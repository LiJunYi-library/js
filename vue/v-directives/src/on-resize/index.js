export const onResize = {
  created(el, binding) {
    // width height
    // console.log(binding.modifiers);
    let Observer = window.ResizeObserver || MutationObserver;
    el?.__v_directive_onResize?.disconnect?.();
    el.__v_directive_onResize = new Observer(binding.value);
    el?.__v_directive_onResize?.observe?.(el);
  },
  beforeUnmount(el) {
    el?.__v_directive_onResize?.disconnect?.();
    delete el.__v_directive_onResize;
  },
};
