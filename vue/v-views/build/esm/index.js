import { resolveComponent, createBlock, openBlock, mergeProps, withCtx, createElementBlock, renderSlot, Fragment, renderList, normalizeClass, createTextVNode, toDisplayString, inject, reactive, onBeforeUnmount, defineComponent, onMounted, onUnmounted, createVNode, useSlots, computed, toRaw, render, provide, watch, onBeforeMount, isVNode } from 'vue';
import { findParentByLocalName } from '@rainbow_ljy/rainbow-element';
import { arrayRemove, arrayLoopMap, animationDebounced, arrayLoop } from '@rainbow_ljy/rainbow-js';
import { useResizeObserver } from '@rainbow_ljy/v-hooks';

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var script$2 = {
  __name: 'index',
  props: {
    trigger: {
      type: String,
      default: "click"
    },
    keyExtractor: {
      type: Function,
      default: (item, index) => index
    },
    listHook: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      var _component_r_tab_item = resolveComponent("r-tab-item");
      var _component_r_tabs = resolveComponent("r-tabs");
      return openBlock(), createBlock(_component_r_tabs, mergeProps({
        value: __props.listHook.value
      }, _objectSpread2({}, _ctx.$attrs)), {
        default: withCtx(() => {
          var _props$listHook$list, _props$listHook;
          return [(openBlock(true), createElementBlock(Fragment, null, renderList((_props$listHook$list = (_props$listHook = __props.listHook) === null || _props$listHook === void 0 ? void 0 : _props$listHook.list) !== null && _props$listHook$list !== void 0 ? _props$listHook$list : [], (item, index) => {
            var _props$listHook2, _props$listHook2$form;
            return openBlock(), createBlock(_component_r_tab_item, {
              key: __props.keyExtractor(item, index),
              trigger: __props.trigger,
              value: (_props$listHook2 = __props.listHook) === null || _props$listHook2 === void 0 || (_props$listHook2$form = _props$listHook2.formatterValue) === null || _props$listHook2$form === void 0 ? void 0 : _props$listHook2$form.call(_props$listHook2, item, index),
              class: normalizeClass(["v-r-tab-item", 'v-r-tab-item' + index]),
              onClick: $event => {
                var _props$listHook3, _props$listHook3$onSe;
                return (_props$listHook3 = __props.listHook) === null || _props$listHook3 === void 0 || (_props$listHook3$onSe = _props$listHook3.onSelect) === null || _props$listHook3$onSe === void 0 ? void 0 : _props$listHook3$onSe.call(_props$listHook3, item, index);
              }
            }, {
              default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
                item: item,
                index: index
              }, () => {
                var _props$listHook4, _props$listHook4$form;
                return [createTextVNode(toDisplayString((_props$listHook4 = __props.listHook) === null || _props$listHook4 === void 0 || (_props$listHook4$form = _props$listHook4.formatterLabel) === null || _props$listHook4$form === void 0 ? void 0 : _props$listHook4$form.call(_props$listHook4, item, index)), 1 /* TEXT */)];
              })]),
              _: 2 /* DYNAMIC */
            }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["trigger", "value", "class", "onClick"]);
          }), 128 /* KEYED_FRAGMENT */)), renderSlot(_ctx.$slots, "active")];
        }),
        _: 3 /* FORWARDED */
      }, 16 /* FULL_PROPS */, ["value"]);
    };
  }
};

script$2.__file = "src/components/radio-layout/tabs/index.vue";

var VRTabs = script$2;

function useScrollController() {
  var _RScrollContext$child, _RScrollContext$child2;
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var RScrollContext = inject("RScrollContext") || {};
  var controller = reactive(_objectSpread2(_objectSpread2({
    onScrollTop: () => undefined,
    onScrollBottom: () => undefined,
    onScrollUp: () => undefined,
    onScrollDown: () => undefined,
    onScroll: () => undefined,
    onScrollend: () => undefined,
    onScrollRefresh: () => undefined,
    onScrollRefreshMove: () => undefined,
    onResize: () => undefined,
    onMounted: () => undefined,
    onTouchstart: () => undefined,
    onTouchend: () => undefined,
    onFlotage: () => undefined
  }, props), {}, {
    destroy,
    getOffsetTop,
    dispatchFlotage,
    context: RScrollContext
  }));
  RScrollContext === null || RScrollContext === void 0 || (_RScrollContext$child = RScrollContext.children) === null || _RScrollContext$child === void 0 || (_RScrollContext$child2 = _RScrollContext$child.push) === null || _RScrollContext$child2 === void 0 || _RScrollContext$child2.call(_RScrollContext$child, controller);
  function getOffsetTop(ele) {
    var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!RScrollContext.element) return top;
    if (!ele) return top;
    top = top + ele.offsetTop;
    if (ele.offsetParent === RScrollContext.element) return top;
    return getOffsetTop(ele.offsetParent, top);
  }
  function dispatchFlotage() {
    for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }
    RScrollContext.children.forEach(element => {
      element.onFlotage(...arg);
    });
  }
  function destroy() {
    arrayRemove(RScrollContext === null || RScrollContext === void 0 ? void 0 : RScrollContext.children, controller);
  }
  onBeforeUnmount(() => {
    destroy();
  });
  return controller;
}
function useFallsLayout() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var config = _objectSpread2({}, options);
  var args = {
    width: getWidth(),
    list: undefined,
    setColumns,
    afreshConfig,
    push,
    layout,
    setConfig,
    setWidth,
    afreshLayout,
    getMaxHeightItem,
    getMinHeightItem,
    setList
  };
  setList();
  function setWidth() {
    args.width = getWidth();
  }
  function getWidth() {
    return "calc( ".concat(100 / config.columns, "% - ").concat((config.columns - 1) * config.gap / config.columns, "px )");
  }
  function setList() {
    args.list = getList();
  }
  function getList() {
    return arrayLoopMap(config.columns, i => ({
      height: 0,
      width: args.width,
      left: getLeft(i),
      top: 0,
      children: [],
      index: i
    }));
  }
  function getColumns(width) {
    if (!config.minAutoWidth) return config.columns;
    return Math.floor(width / config.minAutoWidth) || 1;
  }
  function setColumns(width) {
    config.columns = getColumns(width);
    setWidth();
    setList();
  }
  function getMaxHeightItem() {
    var item = args.list[0];
    args.list.forEach(el => {
      if (el.height > item.height) item = el;
    });
    return item;
  }
  function getMinHeightItem(index) {
    if (typeof index === "number") return args.list[index];
    var item = args.list[0];
    args.list.forEach(el => {
      if (el.height < item.height) item = el;
    });
    return item;
  }
  function setConfig(conf) {
    Object.assign(config, conf);
    config.columns = getColumns(conf.width);
  }
  function afreshConfig(conf) {
    setConfig(conf);
    setWidth();
    setList();
  }
  function afreshLayout(conf) {
    var items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    setConfig(conf);
    setWidth();
    layout(items);
  }
  function layout() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    setList();
    push(...items);
  }
  function push() {
    for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      items[_key2] = arguments[_key2];
    }
    items.forEach(ele => {
      if (!ele) return;
      if (!ele.style) return;
      var node = getMinHeightItem();
      if (node.height) node.height = node.height + config.gap;
      ele.style.left = node.left;
      ele.style.top = node.height + "px";
      node.height = node.height + ele.offsetHeight;
    });
  }
  function getLeft(i) {
    return "calc( ".concat(100 / config.columns * i, "% - ").concat((config.columns - 1) * config.gap / config.columns * i, "px + ").concat(i * config.gap, "px )");
  }
  return args;
}
function arrayBinarySearch() {
  var setPointer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (args, index) => args.right = index - 1;
  var arr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var formatter = arguments.length > 2 ? arguments[2] : undefined;
  var compare = arguments.length > 3 ? arguments[3] : undefined;
  var fg = {
    left: 0,
    right: arr.length - 1,
    result: -1
  };
  while (fg.left <= fg.right) {
    var index = Math.floor((fg.left + fg.right) / 2);
    var item = arr[index];
    if (formatter(item)) {
      fg.result = index;
      setPointer(fg, index, item);
    } else if (compare(item)) {
      fg.left = index + 1;
    } else {
      fg.right = index - 1;
    }
  }
  return fg.result;
}
function arrayBinaryFindIndex() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var formatter = arguments.length > 1 ? arguments[1] : undefined;
  var compare = arguments.length > 2 ? arguments[2] : undefined;
  return arrayBinarySearch((args, index) => {
    args.right = index - 1;
  }, arr, formatter, compare);
}

var VRPaginationLoading = defineComponent({
  props: {
    triggerBottomDistance: {
      type: Number,
      default: 500
    },
    loadingHook: {
      type: Object,
      default: () => ({})
    },
    onErrorLoadClick: {
      type: Function
    },
    onBeginErrorClick: {
      type: Function
    }
  },
  emits: ["rollToBottom"],
  setup(props, ctx) {
    (() => {
      useScrollController({
        onScrollDown
      });
      function onScrollDown(event) {
        var max = event.contentHeight - event.containerHeight - props.triggerBottomDistance;
        var bool = event.scrollTop >= max;
        if (bool) ctx.emit("rollToBottom", event);
      }
    })();
    var vm;
    var scrollView = document.createElement("div");
    onMounted(mounted);
    onUnmounted(unmounted);
    function mounted() {
      var scrollName = ["r-scroll", "r-scroll-view", "r-nested-scroll"];
      scrollView = findParentByLocalName(scrollName, vm.$el);
      if (!scrollView) return;
      scrollView.addEventListener("scrollUp", onScrollUp);
    }
    function unmounted() {
      if (!scrollView) return;
      scrollView.removeEventListener("scrollUp", onScrollUp);
    }
    function onScrollUp(event) {
      if (!scrollView) return;
      var max = scrollView.scrollHeight - scrollView.offsetHeight - props.triggerBottomDistance;
      var bool = scrollView.scrollTop >= max;
      if (bool) ctx.emit("rollToBottom", event);
    }
    function renderLoading() {
      return renderSlot(ctx.slots, "loading", {}, () => [createVNode("div", {
        "class": "r-pagination-loading-loading"
      }, [createVNode("div", {
        "class": "r-pagination-loading-loading-prve"
      }, null), createVNode("div", {
        "class": "r-pagination-loading-loading-text"
      }, [createTextVNode("\u52A0\u8F7D\u4E2D")]), createVNode("div", {
        "class": "r-pagination-loading-loading-next"
      }, null)])]);
    }
    function renderFinished() {
      return renderSlot(ctx.slots, "finished", {}, () => [createVNode("div", {
        "class": "r-pagination-loading-finished"
      }, [createVNode("div", {
        "class": "r-pagination-loading-finished-prve"
      }, null), createVNode("div", {
        "class": "r-pagination-loading-finished-text"
      }, [createTextVNode("\u6CA1\u6709\u66F4\u591A\u7684\u4E86")]), createVNode("div", {
        "class": "r-pagination-loading-finished-next"
      }, null)])]);
    }
    function renderEmpty() {
      return renderSlot(ctx.slots, "empty", {}, () => [createVNode("div", {
        "class": "r-pagination-loading-empty"
      }, [createVNode("div", {
        "class": "r-pagination-loading-empty-prve"
      }, null), createVNode("div", {
        "class": "r-pagination-loading-empty-text"
      }, [createTextVNode("\u6682\u65E0\u76F8\u5173\u6570\u636E\uFF0C\u8BD5\u8BD5\u5176\u4ED6\u6761\u4EF6\u5427")]), createVNode("div", {
        "class": "r-pagination-loading-empty-next"
      }, null)])]);
    }
    function renderBegin() {
      return renderSlot(ctx.slots, "begin", {}, () => [createVNode("div", {
        "class": "r-pagination-loading-begin"
      }, [createVNode("div", {
        "class": "r-pagination-loading-begin-loading"
      }, [createVNode("div", {
        "class": "r-pagination-loading-begin-prve"
      }, null), createVNode("div", {
        "class": "r-pagination-loading-begin-text"
      }, [createTextVNode("\u52A0\u8F7D\u4E2D")]), createVNode("div", {
        "class": "r-pagination-loading-begin-next"
      }, null)]), createVNode("div", {
        "class": "r-pagination-loading-begin-skeleton"
      }, [renderList(10, () => createVNode("div", {
        "class": "r-pagination-loading-begin-skeleton-item"
      }, null))])])]);
    }
    function onBeginErrorClick() {
      var _props$loadingHook, _props$loadingHook$ne;
      if (props.onBeginErrorClick) props.onBeginErrorClick(...arg);else (_props$loadingHook = props.loadingHook) === null || _props$loadingHook === void 0 || (_props$loadingHook$ne = _props$loadingHook.nextBeginSend) === null || _props$loadingHook$ne === void 0 || _props$loadingHook$ne.call(_props$loadingHook);
    }
    function renderError() {
      return renderSlot(ctx.slots, "error", {}, () => [createVNode("div", {
        "class": "r-pagination-loading-begin-error",
        "onClick": onBeginErrorClick
      }, [createVNode("div", {
        "class": "r-pagination-loading-begin-error-prve"
      }, null), createVNode("div", {
        "class": "r-pagination-loading-begin-error-text"
      }, [createTextVNode("\u51FA\u9519\u4E86 \u70B9\u51FB\u91CD\u65B0\u52A0\u8F7D")]), createVNode("div", {
        "class": "r-pagination-loading-begin-error-next"
      }, null)])]);
    }
    function onErrorLoadClick() {
      var _props$loadingHook2, _props$loadingHook2$a;
      if (props.onErrorLoadClick) props.onErrorLoadClick(...arguments);else (_props$loadingHook2 = props.loadingHook) === null || _props$loadingHook2 === void 0 || (_props$loadingHook2$a = _props$loadingHook2.awaitSend) === null || _props$loadingHook2$a === void 0 || _props$loadingHook2$a.call(_props$loadingHook2);
    }
    function renderLoadError() {
      return renderSlot(ctx.slots, "errorLoad", {}, () => [createVNode("div", {
        "class": "r-pagination-loading-error",
        "onClick": onErrorLoadClick
      }, [createVNode("div", {
        "class": "r-pagination-loading-error-prve"
      }, null), createVNode("div", {
        "class": "r-pagination-loading-error-text"
      }, [createTextVNode("\u51FA\u9519\u4E86 \u70B9\u51FB\u91CD\u65B0\u52A0\u8F7D")]), createVNode("div", {
        "class": "r-pagination-loading-error-next"
      }, null)])]);
    }
    function renderState() {
      var ps = props.loadingHook;
      if (ps.begin === true && ps.error === true) return renderError();
      if (ps.error === true) return renderLoadError();
      if (ps.begin === true) return renderBegin();
      if (ps.empty === true && ps.finished === true) return renderEmpty();
      if (ps.finished === true) return renderFinished();
      if (ps.loading === true) return renderLoading();
    }
    return (v, a) => {
      var _ctx$slots, _ctx$slots$default;
      vm = v;
      return [(_ctx$slots = ctx.slots) === null || _ctx$slots === void 0 || (_ctx$slots$default = _ctx$slots.default) === null || _ctx$slots$default === void 0 ? void 0 : _ctx$slots$default.call(_ctx$slots), renderState()];
    };
  }
});

var script$1 = {
  __name: 'index',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    keyExtractor: {
      type: Function,
      default: val => val.item
    },
    listHook: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(__props, _ref) {
    var {
      emit: __emit
    } = _ref;
    var slots = useSlots();
    var emit = __emit;
    var props = __props;
    var list = computed({
      set(val) {
        if (props.listHook.list) return props.listHook.list = val;
        emit("update:modelValue", val);
      },
      get() {
        if (props.listHook.list) return props.listHook.list;
        return toRaw(props.modelValue);
      }
    });
    var refList = computed(() => {
      if (props.listHook.list) return props.listHook.list;
      return props.modelValue;
    });
    var Item = defineComponent({
      inheritAttrs: false,
      props: {
        event: Object,
        slots: Object
      },
      setup(props) {
        return () => {
          var _props$slots, _props$slots$item;
          return props === null || props === void 0 || (_props$slots = props.slots) === null || _props$slots === void 0 || (_props$slots$item = _props$slots.item) === null || _props$slots$item === void 0 ? void 0 : _props$slots$item.call(_props$slots, props.event);
        };
      }
    });
    function onRenderItems(event) {
      event.item = refList.value[event.index];
      render(createVNode(Item, {
        "event": event,
        "slots": slots,
        "key": props.keyExtractor(event),
        "data-key": props.keyExtractor(event)
      }, null), event.ele);
    }
    return (_ctx, _cache) => {
      var _component_r_scroll_virtual_grid_list = resolveComponent("r-scroll-virtual-grid-list");
      return openBlock(), createBlock(_component_r_scroll_virtual_grid_list, {
        modelValue: list.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => list.value = $event),
        onrenderItems: onRenderItems,
        keyExtractor: props.keyExtractor
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["modelValue", "keyExtractor"]);
    };
  }
};

script$1.__file = "src/components/scroll-layout/virtualGridList/index.vue";

var VRVirtualGridList = script$1;

var script = {
  __name: 'index',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    keyExtractor: {
      type: Function,
      default: val => val.item
    },
    listHook: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update:modelValue"],
  setup(__props, _ref) {
    var {
      emit: __emit
    } = _ref;
    var slots = useSlots();
    var emit = __emit;
    var props = __props;
    var list = computed({
      set(val) {
        if (props.listHook.list) return props.listHook.list = val;
        emit("update:modelValue", val);
      },
      get() {
        if (props.listHook.list) return props.listHook.list;
        return toRaw(props.modelValue);
      }
    });
    var refList = computed(() => {
      if (props.listHook.list) return props.listHook.list;
      return props.modelValue;
    });
    var Item = defineComponent({
      inheritAttrs: false,
      props: {
        event: Object,
        slots: Object
      },
      setup(props) {
        onMounted(() => {});
        return () => {
          var _props$slots, _props$slots$item;
          return props === null || props === void 0 || (_props$slots = props.slots) === null || _props$slots === void 0 || (_props$slots$item = _props$slots.item) === null || _props$slots$item === void 0 ? void 0 : _props$slots$item.call(_props$slots, props.event);
        };
      }
    });
    function onRenderItems(event) {
      event.item = refList.value[event.index];
      render(createVNode(Item, {
        "event": event,
        "slots": slots,
        "key": props.keyExtractor(event),
        "data-key": props.keyExtractor(event)
      }, null), event.ele);
    }
    return (_ctx, _cache) => {
      var _component_r_scroll_virtual_falls_list = resolveComponent("r-scroll-virtual-falls-list");
      return openBlock(), createBlock(_component_r_scroll_virtual_falls_list, {
        modelValue: list.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => list.value = $event),
        onrenderItems: onRenderItems,
        keyExtractor: props.keyExtractor
      }, {
        default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["modelValue", "keyExtractor"]);
    };
  }
};

script.__file = "src/components/scroll-layout/virtualFallsList/index.vue";

var VRVirtualFallsList = script;

var mProps$2 = {
  avgHeight: {
    type: Number,
    default: 300
  },
  // 每个item高度
  keyExtractor: {
    type: Function,
    default: _ref => {
      var {
        index
      } = _ref;
      return index;
    }
  },
  columns: {
    type: Number,
    default: 1
  },
  // 一行几个item
  gap: {
    type: Number,
    default: 10
  },
  // 列表之间空格的间距
  inline: Boolean,
  minWidth: Number,
  listHook: Object,
  list: Array,
  preLoadsCount: {
    type: Number,
    default: 100
  },
  preLoadCount: {
    type: Number,
    default: 50
  },
  renderCount: {
    type: Number,
    default: 30
  }
};
var ListenerList$1 = defineComponent({
  props: {
    list: Array
  },
  setup(props, context) {
    return () => {
      return renderList(props.list || [], () => null);
    };
  }
});
var Item$1 = defineComponent({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(props, context) {
    var vm;
    useResizeObserver(() => vm.$el, onSizeChange);
    function onSizeChange(events) {
      var _events$0$target$offs, _events$, _props$item$__cache__, _props$item;
      var height = (_events$0$target$offs = events === null || events === void 0 || (_events$ = events[0]) === null || _events$ === void 0 || (_events$ = _events$.target) === null || _events$ === void 0 ? void 0 : _events$.offsetHeight) !== null && _events$0$target$offs !== void 0 ? _events$0$target$offs : 0;
      var oldHeight = (_props$item$__cache__ = (_props$item = props.item) === null || _props$item === void 0 || (_props$item = _props$item.__cache__) === null || _props$item === void 0 ? void 0 : _props$item.height) !== null && _props$item$__cache__ !== void 0 ? _props$item$__cache__ : 0;
      if (height === 0) return;
      if (oldHeight !== height) {
        var _props$item2;
        if ((_props$item2 = props.item) !== null && _props$item2 !== void 0 && _props$item2.__cache__) {
          props.item.__cache__.height = height;
          props.item.__cache__.isResize = true;
          context.emit('heightChange', height, oldHeight, events);
        }
      }
    }
    return el => {
      var _props$slots, _props$slots$default;
      vm = el;
      return createVNode("div", {
        "class": "r-scroll-virtual-falls-list-item-content"
      }, [props === null || props === void 0 || (_props$slots = props.slots) === null || _props$slots === void 0 || (_props$slots$default = _props$slots.default) === null || _props$slots$default === void 0 ? void 0 : _props$slots$default.call(_props$slots, props)]);
    };
  }
});
var RScrollVirtualFallsListV2 = defineComponent({
  props: _objectSpread2({}, mProps$2),
  setup(props, context) {
    var falls = useFallsLayout(props);
    var LIST = computed(() => (props.listHook ? props.listHook.list : props.list) || []);
    var watchLock = false;
    var contentHtml;
    var INDEX = 0;
    var COLUMN = falls.getMinHeightItem();
    var CACHE = {
      nodeMap: new Map(),
      currentDivNode: undefined,
      item: undefined
    };
    var CURRENT = reactive({
      nodeMap: new Map(),
      index: 0,
      list: []
    });
    var backstageTask = createBackstage();
    var mCtx = reactive({
      context,
      slots: context.slots,
      renderItems,
      layout
    });
    provide("RScrollVirtualFallsListContext", mCtx);
    context.expose(mCtx);
    watch(() => LIST.value.slice(CURRENT.index, CURRENT.index + props.renderCount), onListChange);
    var scrollController = useScrollController({
      onScroll,
      onResize
    });
    var scrollTop = () => {
      var _scrollController$con, _scrollController$con2;
      return (_scrollController$con = scrollController === null || scrollController === void 0 || (_scrollController$con2 = scrollController.context) === null || _scrollController$con2 === void 0 || (_scrollController$con2 = _scrollController$con2.element) === null || _scrollController$con2 === void 0 ? void 0 : _scrollController$con2.scrollTop) !== null && _scrollController$con !== void 0 ? _scrollController$con : 0;
    };
    var minHeight = computed(() => {
      if (!LIST.value.length) return 0;
      return (props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) - props.gap;
    });
    var recycleTop = () => -window.innerHeight + scrollController.getOffsetTop(contentHtml);
    var recycleBottom = () => window.innerHeight * 2 + scrollController.getOffsetTop(contentHtml);
    function findIndex(sTop) {
      return arrayBinaryFindIndex(LIST.value, item => {
        if (!item.__cache__) return false;
        return item.__cache__.vTop <= sTop && sTop <= item.__cache__.vBottom;
      }, item => {
        if (!item.__cache__) return false;
        return item.__cache__.vTop < sTop;
      });
    }
    function renderItem(nth) {
      var _ele$__cache__, _ele$__cache__2, _ele$__cache__3;
      var ele = LIST.value[INDEX];
      if (!ele) return;
      var node = COLUMN;
      if (!ele.__cache__) ele.__cache__ = {};
      ele.__cache__.columns = falls.list.map(el => _objectSpread2({}, el));
      if (node.height) node.height = node.height + props.gap;
      ele.__cache__.top = node.height;
      ele.__cache__.left = node.left;
      ele.__cache__.width = node.width;
      ele.__cache__.columnIndex = node.index;
      ele.__cache__.index = INDEX;
      // console.log(CACHE.nodeMap.has(ele), ele);
      var div;
      if (CACHE.nodeMap.has(ele)) {
        div = CACHE.nodeMap.get(ele);
        div.setAttribute('data-index', INDEX);
        render(createVNode(Item$1, {
          "item": ele,
          "index": INDEX,
          "slots": context.slots,
          "key": props.keyExtractor({
            item: ele,
            index: INDEX
          }),
          "onHeightChange": onHeightChange
        }, null), div);
        // console.log('缓存有', div);
        if (CACHE.currentDivNode) {
          if (CACHE.currentDivNode.nextSibling === div) ; else {
            contentHtml.insertBefore(div, CACHE.currentDivNode.nextSibling);
          }
        }
        CACHE.currentDivNode = div;
        CACHE.nodeMap.delete(ele);
        // console.log('删除', CACHE.nodeMap.size);
      } else {
        // console.log('没有则创建', INDEX, ele);
        div = document.createElement('div');
        div.setAttribute('data-index', INDEX);
        div.classList.add('r-scroll-virtual-falls-list-item');
        render(createVNode(Item$1, {
          "item": ele,
          "index": INDEX,
          "slots": context.slots,
          "key": props.keyExtractor({
            item: ele,
            index: INDEX
          }),
          "onHeightChange": onHeightChange
        }, null), div);
        if (!CACHE.currentDivNode) {
          contentHtml.insertBefore(div, contentHtml.firstChild);
          CACHE.currentDivNode = div;
        } else {
          contentHtml.insertBefore(div, CACHE.currentDivNode.nextSibling);
          CACHE.currentDivNode = div;
        }
      }
      div.style.top = (ele === null || ele === void 0 || (_ele$__cache__ = ele.__cache__) === null || _ele$__cache__ === void 0 ? void 0 : _ele$__cache__.top) + 'px';
      div.style.left = ele === null || ele === void 0 || (_ele$__cache__2 = ele.__cache__) === null || _ele$__cache__2 === void 0 ? void 0 : _ele$__cache__2.left;
      div.style.width = ele === null || ele === void 0 || (_ele$__cache__3 = ele.__cache__) === null || _ele$__cache__3 === void 0 ? void 0 : _ele$__cache__3.width;
      ele.__cache__.height = div.offsetHeight;
      node.height = node.height + div.offsetHeight;
      ele.__cache__.bottom = node.height;
      ele.__cache__.vTop = ele.__cache__.top + recycleTop();
      ele.__cache__.vBottom = ele.__cache__.bottom + recycleBottom();
      ele.__cache__.columns2 = falls.list.map(el => _objectSpread2({}, el));
      //
      INDEX++;
      COLUMN = falls.getMinHeightItem();
      CURRENT.nodeMap.set(ele, div);
    }
    function renderItems() {
      var n = 0;
      CURRENT.nodeMap = new Map();
      CACHE.currentDivNode = undefined;
      backstageTask.stop();
      while (n < props.renderCount) {
        renderItem();
        n++;
      }
      // console.log('需要删除的', CACHE.nodeMap);
      CACHE.nodeMap.forEach(div => {
        div.remove();
      });
      CACHE.currentDivNode = undefined;
      CACHE.nodeMap = CURRENT.nodeMap;
      preLoads();
      backstageTask.start();
    }
    function layout(isForce) {
      var index = findIndex(scrollTop());
      if (index === -1) index = 0;
      var item = LIST.value[index];
      if (!item) return;
      if (!isForce && CACHE.item === item) return;
      // console.log('layout');
      INDEX = index;
      watchLock = true;
      CURRENT.index = INDEX;
      var cache = item.__cache__;
      if (index === 0) {
        falls.setList();
        COLUMN = falls.getMinHeightItem();
      } else {
        falls.list = cache.columns;
        COLUMN = falls.getMinHeightItem(cache.columnIndex);
      }
      CACHE.item = item;
      renderItems();
      watchLock = false;
    }
    function resize() {
      layout(true);
    }
    function preLoad() {
      var ele = LIST.value[INDEX];
      if (!ele) return;
      var node = COLUMN;
      if (!ele.__cache__) ele.__cache__ = {};
      var cache__height = ele.__cache__.height || props.avgHeight;
      ele.__cache__.columns = falls.list.map(el => _objectSpread2({}, el));
      if (node.height) node.height = node.height + props.gap;
      ele.__cache__.top = node.height;
      ele.__cache__.left = node.left;
      ele.__cache__.width = node.width;
      ele.__cache__.columnIndex = node.index;
      ele.__cache__.index = INDEX;
      ele.__cache__.height = cache__height;
      node.height = node.height + cache__height;
      ele.__cache__.bottom = node.height;
      ele.__cache__.columns2 = falls.list.map(el => _objectSpread2({}, el));
      ele.__cache__.vTop = ele.__cache__.top + recycleTop();
      ele.__cache__.vBottom = ele.__cache__.bottom + recycleBottom();
      INDEX++;
      COLUMN = falls.getMinHeightItem();
    }
    function preLoads() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : props.preLoadsCount;
      var n = 0;
      while (n < count) {
        preLoad();
        n++;
      }
    }
    function getHeight() {
      var _LIST$value$at;
      var columns = (_LIST$value$at = LIST.value.at(-1)) === null || _LIST$value$at === void 0 || (_LIST$value$at = _LIST$value$at.__cache__) === null || _LIST$value$at === void 0 ? void 0 : _LIST$value$at.columns2;
      if (!columns) return minHeight.value;
      var col = columns[0];
      columns.forEach(el => {
        if (el.height > col.height) col = el;
      });
      return col.height;
    }
    function createBackstage() {
      var timer;
      function idleCallback(deadline) {
        if (INDEX >= LIST.value.length) {
          stop();
          return;
        }
        var timeRemaining = deadline.timeRemaining();
        if (timeRemaining > 0) {
          preLoads(props.preLoadCount);
          if (!deadline.didTimeout) {
            timer = requestIdleCallback(idleCallback);
          }
        }
      }
      function start() {
        // console.log('backstageTask start',);
        timer = requestIdleCallback(idleCallback);
      }
      function stop() {
        // console.log('backstageTask stop',);
        cancelIdleCallback(timer);
      }
      function trigger() {
        requestIdleCallback(idleCallback);
      }
      return {
        start,
        stop,
        trigger
      };
    }
    onMounted(() => {
      // console.log('onMounted', scrollTop());
      renderItems();
    });
    function onHeightChange() {
      // console.log('onHeightChange');
      resize();
    }
    function onScroll() {
      // console.log('onScroll');
      layout();
    }
    function onResize() {
      // console.log('onResize', scrollTop());
      layout();
    }
    function onListChange() {
      // console.log('onListChange', scrollTop());
      if (watchLock) return;
      resize();
    }
    return () => {
      return createVNode("div", null, [createVNode(ListenerList$1, {
        "list": LIST.value.slice(CURRENT.index, CURRENT.index + props.renderCount)
      }, null), createVNode("div", {
        "style": {
          height: getHeight() + 'px'
        },
        "data-length": LIST.value.length,
        "ref": el => contentHtml = el,
        "class": "r-scroll-virtual-falls-list"
      }, null)]);
    };
  }
});

var mProps$1 = {
  avgHeight: {
    type: Number,
    default: 200
  },
  // 每个item高度
  keyExtractor: {
    type: Function,
    default: _ref => {
      var {
        index
      } = _ref;
      return index;
    }
  },
  columns: {
    type: Number,
    default: 1
  },
  // 一行几个item
  gap: {
    type: Number,
    default: 10
  },
  // 列表之间空格的间距
  inline: Boolean,
  minWidth: Number,
  listHook: Object,
  list: Array,
  preLoadsCount: {
    type: Number,
    default: 100
  },
  renderCount: {
    type: Number,
    default: 30
  }
};
var CONTEXT = defineComponent({
  props: {
    list: Array
  },
  setup(props, context) {
    return () => {
      renderList(props.list || [], (item, index) => null);
      return null;
    };
  }
});
var ListenerList = defineComponent({
  props: {
    list: Array
  },
  setup(props, context) {
    return () => {
      return createVNode(CONTEXT, {
        "list": props.list
      }, null);
    };
  }
});
var Item = defineComponent({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(props, context) {
    var vm;
    useResizeObserver(() => vm.$el, onSizeChange);
    function onSizeChange(events) {
      var _events$0$target$offs, _events$, _props$item$__cache__, _props$item;
      var height = (_events$0$target$offs = events === null || events === void 0 || (_events$ = events[0]) === null || _events$ === void 0 || (_events$ = _events$.target) === null || _events$ === void 0 ? void 0 : _events$.offsetHeight) !== null && _events$0$target$offs !== void 0 ? _events$0$target$offs : 0;
      var oldHeight = (_props$item$__cache__ = (_props$item = props.item) === null || _props$item === void 0 || (_props$item = _props$item.__cache__) === null || _props$item === void 0 ? void 0 : _props$item.height) !== null && _props$item$__cache__ !== void 0 ? _props$item$__cache__ : 0;
      if (height === 0) return;
      if (oldHeight !== height) {
        var _props$item2;
        if ((_props$item2 = props.item) !== null && _props$item2 !== void 0 && _props$item2.__cache__) {
          props.item.__cache__.height = height;
          props.item.__cache__.isResize = true;
          context.emit('heightChange', height, oldHeight, events);
        }
      }
    }
    return el => {
      var _props$slots, _props$slots$default;
      vm = el;
      return createVNode("div", {
        "class": "r-scroll-virtual-falls-list-item-content"
      }, [props === null || props === void 0 || (_props$slots = props.slots) === null || _props$slots === void 0 || (_props$slots$default = _props$slots.default) === null || _props$slots$default === void 0 ? void 0 : _props$slots$default.call(_props$slots, props)]);
    };
  }
});
var RScrollVirtualFallsListV3 = defineComponent({
  props: _objectSpread2({}, mProps$1),
  setup(props, context) {
    var contentHtml;
    var watchLock = false;
    var falls = useFallsLayout(props);
    var LIST = computed(() => (props.listHook ? props.listHook.list : props.list) || []);
    var backstage = createBackstage();
    var CACHE = {
      nodeMap: new Map(),
      DivPointer: undefined,
      item: undefined
    };
    var mCtx = reactive({
      context,
      slots: context.slots,
      index: 0,
      endIndex: 0,
      column: falls.getMinHeightItem(),
      endColumn: falls.getMinHeightItem(),
      nodeMap: new Map(),
      renderList: [],
      renderItems
    });
    provide("RScrollVirtualFallsListContext", mCtx);
    context.expose(mCtx);
    var onResizeDebounced = animationDebounced(onResize);
    var onHeightChange = animationDebounced(onChangeHeight);
    var scrollController = useScrollController({
      onScroll,
      onResize: onResizeDebounced
    });
    var scrollTop = () => {
      var _scrollController$con, _scrollController$con2;
      return (_scrollController$con = scrollController === null || scrollController === void 0 || (_scrollController$con2 = scrollController.context) === null || _scrollController$con2 === void 0 || (_scrollController$con2 = _scrollController$con2.element) === null || _scrollController$con2 === void 0 ? void 0 : _scrollController$con2.scrollTop) !== null && _scrollController$con !== void 0 ? _scrollController$con : 0;
    };
    var minHeight = computed(() => {
      if (!LIST.value.length) return 0;
      return (props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) - props.gap;
    });
    var recycleTop = () => -window.innerHeight + scrollController.getOffsetTop(contentHtml);
    var recycleBottom = () => window.innerHeight * 2 + scrollController.getOffsetTop(contentHtml);
    function renderItems() {
      if (!contentHtml) return;
      backstage.stop();
      var node = mCtx.column;
      mCtx.nodeMap = new Map();
      CACHE.DivPointer = undefined;
      mCtx.renderList.forEach((ele, nth) => {
        if (!ele.__cache__) ele.__cache__ = {};
        var index = mCtx.index + nth;
        var __cache__ = ele.__cache__;
        __cache__.columns = falls.list.map(el => _objectSpread2({}, el));
        if (node.height) node.height = node.height + props.gap;
        __cache__.top = node.height;
        __cache__.left = node.left;
        __cache__.width = node.width;
        __cache__.columnIndex = node.index;
        var div;
        if (CACHE.nodeMap.has(ele)) {
          div = CACHE.nodeMap.get(ele);
          div.setAttribute('data-index', index);
          render(createVNode(Item, {
            "item": ele,
            "index": index,
            "slots": context.slots,
            "key": props.keyExtractor({
              item: ele,
              index
            }),
            "onHeightChange": onHeightChange
          }, null), div);
          // console.log('缓存有', div);
          if (CACHE.DivPointer) {
            if (CACHE.DivPointer.nextSibling === div) ; else {
              contentHtml.insertBefore(div, CACHE.DivPointer.nextSibling);
            }
          }
          CACHE.DivPointer = div;
          CACHE.nodeMap.delete(ele);
        } else {
          // console.log('没有则创建', index);
          div = document.createElement('div');
          div.setAttribute('data-index', index);
          div.classList.add('r-scroll-virtual-falls-list-item');
          render(createVNode(Item, {
            "item": ele,
            "index": index,
            "slots": context.slots,
            "key": props.keyExtractor({
              item: ele,
              index
            }),
            "onHeightChange": onHeightChange
          }, null), div);
          if (!CACHE.DivPointer) {
            contentHtml.insertBefore(div, contentHtml.firstChild);
            CACHE.DivPointer = div;
          } else {
            contentHtml.insertBefore(div, CACHE.DivPointer.nextSibling);
            CACHE.DivPointer = div;
          }
        }
        div.style.top = __cache__.top + 'px';
        div.style.left = __cache__.left;
        div.style.width = __cache__.width;
        __cache__.height = div.offsetHeight;
        node.height = node.height + div.offsetHeight;
        __cache__.bottom = node.height;
        __cache__.vTop = __cache__.top + recycleTop();
        __cache__.vBottom = __cache__.bottom + recycleBottom();
        __cache__.columns2 = falls.list.map(el => _objectSpread2({}, el));
        mCtx.endIndex = index + 1;
        node = falls.getMinHeightItem();
        mCtx.endColumn = node;
        mCtx.nodeMap.set(ele, div);
      });
      // console.log('renderItems', mCtx);
      CACHE.nodeMap.forEach(div => div.remove());
      CACHE.DivPointer = undefined;
      CACHE.nodeMap = mCtx.nodeMap;
      watchLock = false;
      backstage.rePreLoads();
      backstage.start();
    }
    function layout(isForce) {
      var index = findIndex(scrollTop());
      if (index === -1) index = 0;
      var item = LIST.value[index];
      if (!item) return;
      if (!isForce && CACHE.item === item) return;
      watchLock = true;
      mCtx.index = index;
      // console.log('layout-index', index);
      var cache = item.__cache__;
      if (index === 0) {
        falls.setList();
        mCtx.column = falls.getMinHeightItem();
      } else {
        falls.list = cache.columns;
        mCtx.column = falls.getMinHeightItem(cache.columnIndex);
      }
      mCtx.renderList = LIST.value.slice(mCtx.index, mCtx.index + props.renderCount);
      CACHE.item = item;
      renderItems();
    }
    function findIndex(sTop) {
      return arrayBinaryFindIndex(LIST.value, item => {
        if (!item.__cache__) return false;
        return item.__cache__.vTop <= sTop && sTop <= item.__cache__.vBottom;
      }, item => {
        if (!item.__cache__) return false;
        return item.__cache__.vTop < sTop;
      });
    }
    function getHeight() {
      var _LIST$value$at;
      var columns = (_LIST$value$at = LIST.value.at(-1)) === null || _LIST$value$at === void 0 || (_LIST$value$at = _LIST$value$at.__cache__) === null || _LIST$value$at === void 0 ? void 0 : _LIST$value$at.columns2;
      if (!columns) return minHeight.value;
      var col = columns[0];
      columns.forEach(el => {
        if (el.height > col.height) col = el;
      });
      return col.height;
    }
    function createBackstage() {
      var timer;
      var index = 0;
      var column;
      function rePreLoads() {
        index = mCtx.endIndex;
        column = mCtx.endColumn;
        preLoads();
      }
      function preLoad() {
        var ele = LIST.value[index];
        if (!ele) return;
        var node = column;
        if (!ele.__cache__) ele.__cache__ = {};
        var cache__height = ele.__cache__.height || props.avgHeight;
        ele.__cache__.columns = falls.list.map(el => _objectSpread2({}, el));
        if (node.height) node.height = node.height + props.gap;
        ele.__cache__.top = node.height;
        ele.__cache__.left = node.left;
        ele.__cache__.width = node.width;
        ele.__cache__.columnIndex = node.index;
        ele.__cache__.height = cache__height;
        node.height = node.height + cache__height;
        ele.__cache__.bottom = node.height;
        ele.__cache__.columns2 = falls.list.map(el => _objectSpread2({}, el));
        ele.__cache__.vTop = ele.__cache__.top + recycleTop();
        ele.__cache__.vBottom = ele.__cache__.bottom + recycleBottom();
        index++;
        column = falls.getMinHeightItem();
      }
      function preLoads() {
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : props.preLoadsCount;
        var nth = 0;
        while (nth < props.preLoadsCount) {
          preLoad();
          nth++;
        }
      }
      function idleCallback(deadline) {
        // console.log(index);
        if (index >= LIST.value.length) {
          stop();
          return;
        }
        var timeRemaining = deadline.timeRemaining();
        if (timeRemaining > 0) {
          preLoads(10);
          if (!deadline.didTimeout) {
            timer = requestIdleCallback(idleCallback);
          }
        }
      }
      function start() {
        // console.log('backstageTask start',);
        timer = requestIdleCallback(idleCallback);
      }
      function stop() {
        // console.log('backstageTask stop',);
        cancelIdleCallback(timer);
      }
      function trigger() {
        requestIdleCallback(idleCallback);
      }
      return {
        start,
        stop,
        trigger,
        preLoads,
        preLoad,
        rePreLoads
      };
    }
    onMounted(() => {});
    onBeforeUnmount(() => {
      backstage.stop();
    });
    function onChangeHeight() {
      // console.log('onChangeHeight');
      layout(true);
    }
    function onScroll() {
      // console.log('onScroll');
      layout();
    }
    function onResize() {
      // console.log('onResize', LIST.value);
      layout(true);
    }
    watch(() => LIST.value.slice(mCtx.index, mCtx.index + props.renderCount), () => {
      // console.log('list ------ watch', watchLock);
      if (watchLock) return;
      layout(true);
    });
    return () => {
      return createVNode("div", null, [createVNode(ListenerList, {
        "list": LIST.value.slice(mCtx.index, mCtx.index + props.renderCount)
      }, null), createVNode("div", {
        "style": {
          height: getHeight() + 'px'
        },
        "data-length": LIST.value.length,
        "ref": el => contentHtml = el,
        "class": "r-scroll-virtual-falls-list"
      }, null)]);
    };
  }
});

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !isVNode(s);
}
var mProps = {
  bothEndsHeight: {
    type: Number,
    default: 0
  },
  //列表 两端的高度
  avgHeight: {
    type: Number,
    default: 120
  },
  // 每个item高度
  keyExtractor: {
    type: Function,
    default: _ref => {
      var {
        index
      } = _ref;
      return index;
    }
  },
  columns: {
    type: Number,
    default: 1
  },
  // 一行几个item
  gap: {
    type: Number,
    default: 10
  },
  // 列表之间空格的间距
  minAutoWidth: Number,
  listHook: Object,
  list: Array,
  openAnimationFrame: Boolean
  //
};
var RScrollVirtualGridListItem = defineComponent({
  props: {
    item: [Object, Array, String, Number],
    index: Number
  },
  setup(props, context) {
    var mCtx = inject("RScrollVirtualGridListContext") || {};
    var html;
    var obs = new IntersectionObserver(_ref2 => {
      var [entries] = _ref2;
      if (!entries.isIntersecting) return;
      mCtx.context.emit("itemVisible", props);
      handleMarkVisible();
    });
    function handleMarkVisible() {
      if (typeof props.item !== 'object') return;
      if (props.item.__markVisible !== mCtx.markVisible) {
        props.item.__markVisible = mCtx.markVisible;
        mCtx.context.emit("itemMarkVisible", props);
      }
    }
    onMounted(() => {
      obs.observe(html);
    });
    onBeforeMount(() => {
      obs.disconnect();
    });
    return () => {
      return createVNode("div", {
        "ref": el => html = el
      }, [renderSlot(context.slots, "default", props)]);
    };
  }
});
var Context = defineComponent({
  props: _objectSpread2({}, mProps),
  setup(props, context) {
    var mCtx = inject("RScrollVirtualGridListContext") || {};
    function handleMark(item) {
      if (typeof item.item !== 'object') return;
      if (item.item.__markCount !== mCtx.markCount) {
        item.item.__markCount = mCtx.markCount;
        mCtx.context.emit("itemMarkRender", item);
      }
    }
    return () => {
      return renderList(mCtx.renderList, (item, index) => {
        var _slot;
        handleMark(item);
        return createVNode(RScrollVirtualGridListItem, {
          "data-index": item.index,
          "class": "r-scroll-virtual-grid-list-item",
          "style": item.style,
          "item": item.item,
          "index": item.index,
          "key": props.keyExtractor(item)
        }, _isSlot(_slot = renderSlot(mCtx.slots, "default", item)) ? _slot : {
          default: () => [_slot]
        });
        // return (
        //   <div ref={(el) => onRef(el, item)} data-index={item.index} class="r-scroll-virtual-grid-list-item" style={item.style} key={props.keyExtractor(item)}>
        //     {renderSlot(mCtx.slots, "default", item)}
        //   </div>
        // );
      });
    };
  }
});
var RScrollVirtualGridList = defineComponent({
  props: _objectSpread2({}, mProps),
  emits: ["itemMarkRender", "itemMarkVisible", "itemVisible"],
  setup(props, context) {
    var cache = {
      index: undefined
    };
    var contentHtml;
    var recycleHeight = () => window.innerHeight; //window.innerHeight; // 有些浏览器初始拿innerHeight有时为0;
    var itemWidth = computed(() => "calc( ".concat(100 / props.columns, "% - ").concat((props.columns - 1) * props.gap / props.columns, "px )"));
    var LIST = computed(() => (props.listHook ? props.listHook.list : props.list) || []);
    var HEIGHT = computed(() => {
      if (!LIST.value.length) return 0;
      return (props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) - props.gap + props.bothEndsHeight * 2;
    });
    var scrollController = useScrollController({
      onScroll(event, sTop) {
        layout();
      },
      onResize(entries, sTop) {
        layout();
      }
    });
    var mCtx = reactive({
      context,
      slots: context.slots,
      itemWidth,
      height: HEIGHT,
      renderList: [],
      markCount: 0,
      markVisible: 0
      // onRender: () => undefined,
      // addMarkCount() {
      //   mCtx.markCount++;
      // },
      // doAddMark() {
      //   mCtx.addMarkCount();
      //   mCtx.doMark();
      // },
      // doMark() {
      //   mCtx.renderList.forEach(({ item }) => {
      //     item.__markCount = mCtx.markCount;
      //   });
      // },
    });
    provide("RScrollVirtualGridListContext", mCtx);
    context.expose(mCtx);
    function getLeft(i) {
      return "calc( ".concat(100 / props.columns * i, "% - ").concat((props.columns - 1) * props.gap / props.columns * i, "px + ").concat(i * props.gap, "px )");
    }
    function getRenderList(index) {
      var addH = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var pList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      scrollController.context.element.scrollTop;
      scrollController.getOffsetTop(contentHtml);
      if (index >= LIST.value.length) return pList;
      arrayLoop(props.columns, i => {
        if (index >= 0) {
          var nth = Math.floor(index / props.columns);
          var top = nth * (props.avgHeight + props.gap) + props.bothEndsHeight + "px";
          if (nth === 0) top = props.bothEndsHeight + "px";
          var left = getLeft(i);
          var width = itemWidth.value;
          var height = props.avgHeight + "px";
          pList.push({
            index,
            style: {
              top,
              left,
              width,
              height
            },
            item: LIST.value[index]
          });
        }
        index++;
      });
      addH = addH + props.avgHeight + props.gap;
      if (addH < window.innerHeight + recycleHeight() * 2) return getRenderList(index, addH, pList);
      return pList;
    }
    function doLayout() {
      var isCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!scrollController.context.element) return;
      var sTop = scrollController.context.element.scrollTop;
      var offsetTop = scrollController.getOffsetTop(contentHtml);
      var renderTop = offsetTop - sTop - window.innerHeight - recycleHeight();
      if (renderTop > 0) return;
      var aaa = Math.floor(recycleHeight() / (props.avgHeight + props.gap)) * props.columns;
      var bbb = Math.floor((sTop - offsetTop) / (props.avgHeight + props.gap)) * props.columns;
      var index = bbb - aaa;
      if (cache.index === index && isCache) return;
      cache.index = index;
      mCtx.renderList = getRenderList(index);
      // console.log('---------layout ---------');
      // console.log(`renderTop : ${renderTop}`);
      // console.log(`index : ${index}`);
      // console.log(mCtx.renderList);
      // console.log('  ');
    }
    var time;
    function layout() {
      var isCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (!props.openAnimationFrame) return doLayout(isCache);
      cancelAnimationFrame(time);
      time = requestAnimationFrame(() => {
        doLayout(isCache);
      });
    }
    return () => {
      // console.log('---------render ---------');
      layout(false);
      return createVNode("div", {
        "data-length": LIST.value.length,
        "ref": el => contentHtml = el,
        "style": {
          height: HEIGHT.value + "px"
        },
        "class": "r-scroll-virtual-grid-list"
      }, [createVNode(Context, {
        "keyExtractor": props.keyExtractor
      }, null)]);
    };
  }
});

export { RScrollVirtualFallsListV2, RScrollVirtualFallsListV3, RScrollVirtualGridList, VRPaginationLoading, VRTabs, VRVirtualFallsList, VRVirtualGridList };
//# sourceMappingURL=index.js.map
