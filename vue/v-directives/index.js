import * as directives from "./src/index.js";

export default {
  install: (app) => {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });
  },
};
