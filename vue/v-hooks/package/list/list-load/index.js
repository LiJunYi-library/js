import { ListLoad } from "@rainbow_ljy/rainbow-js";
import { ref } from "vue";
export class VlistLoad extends ListLoad {
  ___ = {
    list: ref([]),
    finished: ref(false),
    empty: ref(false),
    total: ref(0),
    currentPage: ref(1),
    pageSize: ref(10),
  };

  get list() {
    return this.___.list.value;
  }

  set list(v) {
    this.___.list.value = v;
  }

  get finished() {
    return this.___.finished.value;
  }

  set finished(v) {
    this.___.finished.value = v;
  }

  get total() {
    return this.___.total.value;
  }

  set total(v) {
    this.___.total.value = v;
  }

  get currentPage() {
    return this.___.currentPage.value;
  }

  set currentPage(v) {
    this.___.currentPage.value = v;
  }

  get pageSize() {
    return this.___.pageSize.value;
  }

  set pageSize(v) {
    this.___.pageSize.value = v;
  }

  get empty() {
    return this.___.empty.value;
  }

  set empty(v) {
    this.___.empty.value = v;
  }
}
