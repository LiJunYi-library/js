import { arrayForcedTransform, arrayFindIndex, objectAssign } from "@rainbow_ljy/rainbow-js";

export class ListRadio {
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

  #privates = {};
  #props = {};

  constructor(props = {}) {
    this.states = this.setStates();
    this.#props = { ...props };
    objectAssign(this, this.#props, [
      "formatterValue",
      "formatterLabel",
      "formatterDisabled",
      "formatterSelect",
    ]);
    const valuePredicate = (val) => (el) => this.formatterValue(el) === val;
    const labelPredicate = (val) => (el) => this.formatterLabel(el) === val;
    Object.assign(this.#privates, { valuePredicate, labelPredicate });
    this.updateList(this.#props.list, this.#props);
  }

  formatterValue(item) {
    return item?.value;
  }

  formatterLabel(item) {
    return item?.label;
  }

  formatterDisabled(item) {
    return item?.disabled ?? false;
  }

  formatterSelect(args = {}) {
    let item;
    if (args.value !== undefined) {
      item = args.list.find((el) => this.formatterValue(el) === args.value);
      if (item !== undefined) return item;
    }
    if (args.label !== undefined) {
      item = args.list.find((el) => this.formatterLabel(el) === args.label);
      if (item !== undefined) return item;
    }
    if (args.index !== undefined) {
      item = args.list[args.index];
      if (item !== undefined) return item;
    }
    return undefined;
  }

  updateSelect(val) {
    if (typeof val === "function") {
      this.select = this.list.find(val);
    } else {
      this.select = val;
    }
    this.value = this.formatterValue(this.select);
    this.label = this.formatterLabel(this.select);
    this.index = arrayFindIndex(this.list, this.select);
  }

  updateValue(val) {
    const { valuePredicate } = this.#privates;
    this.value = val;
    this.select = this.list.find?.(valuePredicate(val));
    this.label = this.formatterLabel(this.select);
    this.index = arrayFindIndex(this.list, this.select);
  }

  updateLabel(label) {
    const { labelPredicate } = this.#privates;
    this.label = label;
    this.select = this.list.find?.(labelPredicate(label));
    this.value = this.formatterValue(hooks.context.SH.select);
    this.index = arrayFindIndex(list.value, hooks.context.SH.select);
  }

  updateList(list = [], args) {
    this.list = arrayForcedTransform(list);
    this.select = (() => {
      if (typeof args === "function") return args();
      if (args === true) return this.formatterSelect({ ...this.#props, list });
      if (args === "value") return this.formatterSelect({ list, value: this.value });
      if (args === "label") return this.formatterSelect({ list, label: this.label });
      if (args === "index") return this.formatterSelect({ list, index: this.index });
      return this.formatterSelect({ ...args, list });
    })();
    this.value = this.formatterValue(this.select);
    this.label = this.formatterLabel(this.select);
    this.index = arrayFindIndex(this.list, this.select);
  }
}
