import { arrayForcedTransform, arrayFindIndex, objectAssign } from "@rainbow_ljy/rainbow-js";

export class ListMultiple {
  get list() {
    return this.states.list;
  }
  set list(v) {
    this.states.list = v;
  }
  get value() {
    return this.states.value;
  }
  set value(v) {
    this.states.value = v;
  }
  get label() {
    return this.states.label;
  }
  set label(v) {
    this.states.label = v;
  }
  get select() {
    return this.states.select;
  }
  set select(v) {
    this.states.select = v;
  }
  get index() {
    return this.states.index;
  }
  set index(v) {
    this.states.index = v;
  }

  setStates() {
    return { list: [], value: undefined, label: undefined, select: undefined, index: undefined };
  }
}
