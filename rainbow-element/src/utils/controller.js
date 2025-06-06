import { createElement, getChildren } from "./element";

export function createTabsSrollPageController(params = {}) {
  const controller = {
    layout: ({ child, index }) => {
      controller.tabs.cssList.add("r-tab-ratio");
      const tabsChildren = getChildren(controller.tabs, "r-tab-item");
      const ele = tabsChildren[index];
      if (ele) {
        if (!ele.$$.line) {
          ele.$$.line = createElement("div", "r-tab-item-ratio-line", "");
          ele.appendChild(ele.$$.line);
        }
        ele.$$.line.style.width = ` ${child.$$.ratio * 100}%`;
      }
    },
    ...params,
  };
  return controller;
}
