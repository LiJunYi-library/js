import { ListRadio, listRadio } from "@rainbow_ljy/rainbow-js";
import { ref } from "vue";
export class VListRadio extends ListRadio {
  get list() {
    return this.states.list.value;
  }
  set list(v) {
    this.states.list.value = v;
  }
  get value() {
    return this.states.value.value;
  }
  set value(v) {
    this.states.value.value = v;
  }
  get label() {
    return this.states.label.value;
  }
  set label(v) {
    this.states.label.value = v;
  }
  get select() {
    return this.states.select.value;
  }
  set select(v) {
    this.states.select.value = v;
  }
  get index() {
    return this.states.index.value;
  }
  set index(v) {
    this.states.index.value = v;
  }

  setStates() {
    return {
      list: ref([]),
      value: ref(),
      label: ref(),
      select: ref(),
      index: ref(),
    };
  }
}

export function useListRadio(props = {}) {
  return listRadio({
    selectRef: ref,
    valueRef: ref,
    labelRef: ref,
    indexRef: ref,
    listRef: ref,
    ...props,
  });
}
