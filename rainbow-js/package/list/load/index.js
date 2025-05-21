import { arrayForcedTransform } from "@rainbow_ljy/rainbow-js";

export class ListLoad {
  get loading() {
    return this.props.asyncHook.loading;
  }

  get begin() {
    return this.props.asyncHook.begin;
  }

  get error() {
    return this.props.asyncHook.error;
  }

  ___ = {
    list: [],
    finished: false,
    empty: false,
    total: 0,
    currentPage: 1,
    pageSize: 10,
  };

  get list() {
    return this.___.list;
  }

  set list(v) {
    this.___.list = v;
  }

  get finished() {
    return this.___.finished;
  }

  set finished(v) {
    this.___.finished = v;
  }

  get total() {
    return this.___.total;
  }

  set total(v) {
    this.___.total = v;
  }

  get currentPage() {
    return this.___.currentPage;
  }

  set currentPage(v) {
    this.___.currentPage = v;
  }

  get pageSize() {
    return this.___.pageSize;
  }

  set pageSize(v) {
    this.___.pageSize = v;
  }

  get empty() {
    return this.___.empty;
  }

  set empty(v) {
    this.___.empty = v;
  }

  __ = {
    onSuccess: (res) => {
      const {
        formatterList,
        formatterTotal,
        formatterCurrentPage,
        formatterFinished,
        formatterEmpty,
      } = this.props;
      this.total = formatterTotal(res, this);
      const arr = arrayForcedTransform(formatterList(res, this));
      this.list.push(...arr);
      this.finished = formatterFinished(res, this);
      this.empty = formatterEmpty(res, this);
      if (this.finished) return res;
      this.currentPage = formatterCurrentPage(res, this);
      return res;
    },
  };

  props = {
    formatterList: (res, hooks) => {
      if (!res) return [];
      if (typeof res !== "object") return [];
      if (res instanceof Array) return res;
      return res.list || [];
    },
    formatterTotal: (res, hooks) => {
      if (!res) return 0;
      if (res instanceof Array) return res.length;
      return res.total * 1;
    },
    formatterCurrentPage: (res, hooks) => {
      return hooks.currentPage + 1;
    },
    formatterFinished: (res, hooks) => {
      return hooks.list.length >= hooks.total;
    },
    formatterEmpty: (res, hooks) => {
      if (hooks.finished !== true) return false;
      return hooks.list.length === 0;
    },
    asyncHook: {},
  };

  constructor(props = {}) {
    Object.assign(this.props, props);
    for (const key in this.props.asyncHook) {
      console.log(key);
    }
    // Object.assign(this, this.props.asyncHook);
    console.log("props", this.props);
  }

  async awaitSend(...arg) {
    if (this.finished === true) return;
    const res = await this.props.asyncHook.awaitSend(...arg);
    return this.__.onSuccess(res);
  }

  async nextBeginSend(...arg) {
    this.list.splice(0);
    this.currentPage = 1;
    this.finished = false;
    this.empty = false;
    this.total = 0;
    const res = await this.props.asyncHook.nextBeginSend(...arg);
    return this.__.onSuccess(res);
  }
}
