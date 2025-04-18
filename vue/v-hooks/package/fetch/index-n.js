import { Fetch } from "@rainbow_ljy/rainbow-js";
import { ref, isRef } from "vue";

export class Vfetch extends Fetch {
  ___ = {
    loading: ref(false),
    begin: ref(false),
    error: ref(false),
    data: ref(undefined),
    errorData: ref(undefined),
  };

  get loading() {
    return this.___.loading.value;
  }
  set loading(v) {
    this.___.loading.value = v;
  }
  get begin() {
    return this.___.begin.value;
  }
  set begin(v) {
    this.___.begin.value = v;
  }
  get error() {
    return this.___.error.value;
  }
  set error(v) {
    this.___.error.value = v;
  }
  get data() {
    return this.___.data.value;
  }
  set data(v) {
    this.___.data.value = v;
  }
  get errorData() {
    return this.___.errorData.value;
  }
  set errorData(v) {
    this.___.errorData.value = v;
  }

  config = {
    ...this.config,
    formatterUrlParams: async (config) => {
      const { urlParams } = config;
      if (isRef(urlParams)) return urlParams.value;
      if (typeof urlParams === "function") return urlParams();
      if (typeof urlParams === "object") return urlParams;
      return undefined;
    },
    formatterBody: async (config) => {
      const body = config.body;
      if (isRef(body)) return body.value;
      if (typeof body === "function") return body();
      if (typeof body === "object") return body;
      return undefined;
    },
  };
}
