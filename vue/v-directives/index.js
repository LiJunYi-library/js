import * as directives from "./packages/index.js";

export default {
  install: (app) => {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });
  },
};
