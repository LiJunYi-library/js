import { arrayForcedTransform } from "@rainbow_ljy/rainbow-js";
import { ListRadio } from "../radio";

function arrayPaging(list, currentPage, pageSize) {
  const b = (currentPage - 1) * pageSize;
  const e = currentPage * pageSize;
  return list.slice(b, e);
}

export class List extends ListRadio {
  get listData() {
    return this.states.listData;
  }
  set listData(v) {
    this.states.listData = v;
  }
  get currentPage() {
    return this.states.currentPage;
  }
  set currentPage(v) {
    this.states.currentPage = v;
  }
  get pageSize() {
    return this.states.pageSize;
  }
  set pageSize(v) {
    this.states.pageSize = v;
  }

  #props = {};

  setStates() {
    return { ...super.setStates(), listData: [], currentPage: 1, pageSize: 12 };
  }

  constructor(props = {}) {
    super(props);
    this.#props = { ...props };
    this.updateList(this.#props.list, this.#props);
  }

  updateList(list = [], ...args) {
    this.listData = arrayForcedTransform(list);
    this.resolveList(...args);
  }

  resolveList(...args) {
    let arr = this.listData;
    if (this.filterFun) arr = arr.filter(this.filterFun);
    if (this.sortFun) arr = arr.sort(this.sortFun);
    arr = arrayPaging(arr, this.currentPage, this.pageSize);
    super.updateList(arr, ...args);
  }

  push(...args) {
    this.listData.push(...args);
    this.resolveList();
  }

  unshift(...args) {
    this.listData.unshift(...args);
    this.resolveList();
  }

  splice(...args) {
    this.listData.splice(...args);
    this.resolveList();
  }

  remove(...args) {
    this.listData = this.listData.filter((el) => !args.includes(el));
    this.resolveList();
  }

  filter(fun) {
    this.filterFun = fun;
    this.resolveList();
  }

  sort(fun) {
    this.sortFun = fun;
    this.resolveList();
  }
}
