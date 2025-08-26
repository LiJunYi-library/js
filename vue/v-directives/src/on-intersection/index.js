export const onIntersection = {
  created(el, binding) {
    //  show hide
    //  console.log('on-intersection-created');
    let Observer = window.IntersectionObserver || MutationObserver;
    el?.__v_directive_onIntersection?.disconnect?.();
    el.__v_directive_onIntersection = new Observer(binding.value);
    el?.__v_directive_onIntersection?.observe?.(el);
  },
  beforeUnmount(el) {
    el?.__v_directive_onIntersection?.disconnect?.();
    delete el.__v_directive_onIntersection;
  },
};
