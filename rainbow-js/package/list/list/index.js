import { arrayForcedTransform, objectAssign } from "@rainbow_ljy/rainbow-js";

export class Radio {
  get list() {
    return this.#states.list;
  }
  set list(v) {
    this.#states.list = v;
  }
  get value() {
    return this.#states.value;
  }
  set value(v) {
    this.#states.value = v;
  }
  get label() {
    return this.#states.label;
  }
  set label(v) {
    this.#states.label = v;
  }
  get select() {
    return this.#states.select;
  }
  set select(v) {
    this.#states.select = v;
  }
  get index() {
    return this.#states.index;
  }
  set index(v) {
    this.#states.index = v;
  }

  #states = {
    list: [],
    value: undefined,
    label: undefined,
    select: undefined,
    index: undefined,
  };

  #privates = {};
  #props = {};

  constructor(props = {}) {
    this.#props = { ...props };
    objectAssign(this, this.#props, ["formatterValue", "formatterLabel", "formatterDisabled"]);
    const valuePredicate = (val) => (el) => this.formatterValue(el) === val;
    const labelPredicate = (val) => (el) => this.formatterLabel(el) === val;
    const findIndex = (arr = [], item) => {
      const i = arr.findIndex((val) => val === item);
      return i < 0 ? undefined : i;
    };

    Object.assign(this.#privates, { valuePredicate, labelPredicate, findIndex });
    this.updateList(props.list, props);
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
      item = args.list.find(this.valuePredicate(args.value));
      if (item !== undefined) return item;
    }
    if (args.label !== undefined) {
      item = args.list.find(this.labelPredicate(args.label));
      if (item !== undefined) return item;
    }
    if (args.index !== undefined) {
      item = args.list[args.index];
      if (item !== undefined) return item;
    }
    return undefined;
  }
  valuePredicate(val) {
    return (el) => this.formatterValue(el) === val;
  }
  labelPredicate(val) {
    return (el) => this.formatterLabel(el) === val;
  }

  updateValue(val) {
    const { valuePredicate, findIndex } = this.#privates;
    this.value = val;
    this.select = this.list.find?.(valuePredicate(val));
    this.label = this.formatterLabel(this.select);
    this.index = findIndex(this.list, this.select);
  }

  updateLabel(label) {
    const { labelPredicate, findIndex } = this.#privates;
    this.label = label;
    this.select = this.list.find?.(labelPredicate(label));
    this.value = this.formatterValue(hooks.context.SH.select);
    this.index = findIndex(list.value, hooks.context.SH.select);
  }

  updateList(list = [], args) {
    const { findIndex } = this.#privates;
    this.list = arrayForcedTransform(list);
    this.select = (() => {
      if (typeof args === "function") return args();
      if (args === true) return this.formatterSelect({ list, ...this.#props });
      if (args === "value") return this.formatterSelect({ list, value: this.value });
      if (args === "label") return this.formatterSelect({ list, label: this.label });
      if (args === "index") return this.formatterSelect({ list, index: this.index });
      return this.formatterSelect({ list, ...args });
    })();
    this.value = this.formatterValue(this.select);
    this.label = this.formatterLabel(this.select);
    this.index = findIndex(this.list, this.select);
  }

  sssss() {
    console.log("sssss");
  }
  // 增
  // 删
  // 改
  // 查
}

export class List extends Radio {
  sssss() {
    super.sssss();
    console.log("ccccc");
  }
}

function useRadio(props = {}) {
  const states = {
    get value() {},
    set value(v) {},
    ...props?.states?.(),
  };

  return { states };
}

function useListRadio(props = {}) {
  const radio = useRadio(props);
  const states = {
    ...radio.states,
  };
  console.log(radio.states);
  for (const key in radio.states) {
    console.log(radio.states[key]);
  }
  console.log(states);
}

useListRadio();

function useVRadio(props = {}) {
  const value = ref(1);
  return useRadio({
    states() {
      return {
        get value() {
          return value.value;
        },
        set value(v) {
          value.value = v;
        },
      };
    },
  });
}
