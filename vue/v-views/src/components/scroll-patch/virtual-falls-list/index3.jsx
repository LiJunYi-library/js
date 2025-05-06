import {
  defineComponent,
  computed,
  reactive,
  provide,
  render,
  watch,
  onMounted,
  renderList,
  onBeforeUnmount,
} from "vue";
import { useScrollController, useFallsLayout, arrayBinaryFindIndex } from "../utils.js";
import { useResizeObserver } from "@rainbow_ljy/v-hooks";
import { animationDebounced } from "@rainbow_ljy/rainbow-js";

const mProps = {
  avgHeight: { type: Number, default: 200 }, // 每个item高度
  keyExtractor: { type: Function, default: ({ index }) => index },
  columns: { type: Number, default: 1 }, // 一行几个item
  gap: { type: Number, default: 10 }, // 列表之间空格的间距
  inline: Boolean,
  minWidth: Number,
  listHook: Object,
  list: Array,
  preLoadsCount: { type: Number, default: 100 },
  renderCount: { type: Number, default: 30 },
};

const CONTEXT = defineComponent({
  props: {
    list: Array,
  },
  setup(props, context) {
    return () => {
      renderList(props.list || [], (item, index) => null);
      return null;
    };
  },
});

const ListenerList = defineComponent({
  props: {
    list: Array,
  },
  setup(props, context) {
    return () => {
      return <CONTEXT list={props.list}></CONTEXT>;
    };
  },
});

const Item = defineComponent({
  props: {
    item: Object,
    index: Number,
    slots: Object,
  },
  setup(props, context) {
    let vm;
    const rObserver = useResizeObserver(() => vm.$el, onSizeChange);

    function onSizeChange(events) {
      const height = events?.[0]?.target?.offsetHeight ?? 0;
      const oldHeight = props.item?.__cache__?.height ?? 0;
      if (height === 0) return;
      if (oldHeight !== height) {
        if (props.item?.__cache__) {
          props.item.__cache__.height = height;
          props.item.__cache__.isResize = true;
          context.emit("heightChange", height, oldHeight, events);
        }
      }
    }

    return (el) => {
      vm = el;
      return (
        <div class="r-scroll-virtual-falls-list-item-content">{props?.slots?.default?.(props)}</div>
      );
    };
  },
});

export const RScrollVirtualFallsListV3 = defineComponent({
  props: {
    ...mProps,
  },
  setup(props, context) {
    let contentHtml;
    let watchLock = false;
    const falls = useFallsLayout(props);
    const LIST = computed(() => (props.listHook ? props.listHook.list : props.list) || []);
    const backstage = createBackstage();

    const CACHE = {
      nodeMap: new Map(),
      DivPointer: undefined,
      renderList: [],
      item: undefined,
    };

    const mCtx = reactive({
      context,
      slots: context.slots,
      index: 0,
      endIndex: 0,
      column: falls.getMinHeightItem(),
      endColumn: falls.getMinHeightItem(),
      nodeMap: new Map(),
      renderList: [],
      renderItems,
    });

    provide("RScrollVirtualFallsListContext", mCtx);
    context.expose(mCtx);
    const onResizeDebounced = animationDebounced(onResize);
    const onHeightChange = animationDebounced(onChangeHeight);
    const scrollController = useScrollController({ onScroll, onResize: onResizeDebounced });
    const scrollTop = () => scrollController?.context?.element?.scrollTop ?? 0;
    const minHeight = computed(() => {
      if (!LIST.value.length) return 0;
      return (
        (props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) - props.gap
      );
    });
    const recycleTop = () => -window.innerHeight + scrollController.getOffsetTop(contentHtml);
    const recycleBottom = () => window.innerHeight * 2 + scrollController.getOffsetTop(contentHtml);

    function renderItems() {
      if (!contentHtml) return;
      backstage.stop();
      let node = mCtx.column;
      mCtx.nodeMap = new Map();
      CACHE.DivPointer = undefined;

      mCtx.renderList.forEach((ele, nth) => {
        if (!ele.__cache__) ele.__cache__ = {};
        const index = mCtx.index + nth;
        const __cache__ = ele.__cache__;
        __cache__.columns = falls.list.map((el) => ({ ...el }));
        if (node.height) node.height = node.height + props.gap;
        __cache__.top = node.height;
        __cache__.left = node.left;
        __cache__.width = node.width;
        __cache__.columnIndex = node.index;

        let div;
        if (CACHE.nodeMap.has(ele)) {
          div = CACHE.nodeMap.get(ele);
          div.setAttribute("data-index", index);
          render(
            <Item
              item={ele}
              index={index}
              slots={context.slots}
              key={props.keyExtractor({ item: ele, index })}
              onHeightChange={onHeightChange}
            ></Item>,
            div,
          );
          // console.log('缓存有', div);
          if (CACHE.DivPointer) {
            if (CACHE.DivPointer.nextSibling === div) {
              // 当 当前指针的下一个和要渲染的div相同
            } else {
              contentHtml.insertBefore(div, CACHE.DivPointer.nextSibling);
            }
          }
          CACHE.DivPointer = div;
          CACHE.nodeMap.delete(ele);
        } else {
          // console.log('没有则创建', index);
          div = document.createElement("div");
          div.setAttribute("data-index", index);
          div.classList.add("r-scroll-virtual-falls-list-item");
          render(
            <Item
              item={ele}
              index={index}
              slots={context.slots}
              key={props.keyExtractor({ item: ele, index })}
              onHeightChange={onHeightChange}
            ></Item>,
            div,
          );
          if (!CACHE.DivPointer) {
            contentHtml.insertBefore(div, contentHtml.firstChild);
            CACHE.DivPointer = div;
          } else {
            contentHtml.insertBefore(div, CACHE.DivPointer.nextSibling);
            CACHE.DivPointer = div;
          }
        }

        div.style.top = __cache__.top + "px";
        div.style.left = __cache__.left;
        div.style.width = __cache__.width;
        __cache__.height = div.offsetHeight;
        node.height = node.height + div.offsetHeight;
        __cache__.bottom = node.height;
        __cache__.vTop = __cache__.top + recycleTop();
        __cache__.vBottom = __cache__.bottom + recycleBottom();
        __cache__.columns2 = falls.list.map((el) => ({ ...el }));

        mCtx.endIndex = index + 1;
        node = falls.getMinHeightItem();
        mCtx.endColumn = node;
        mCtx.nodeMap.set(ele, div);
      });
      // console.log('renderItems', mCtx);
      CACHE.nodeMap.forEach((div) => div.remove());
      CACHE.DivPointer = undefined;
      CACHE.nodeMap = mCtx.nodeMap;
      watchLock = false;

      backstage.rePreLoads();
      backstage.start();
    }

    function layout(isForce) {
      let index = findIndex(scrollTop());
      if (index === -1) index = 0;
      let item = LIST.value[index];
      if (!item) return;
      if (!isForce && CACHE.item === item) return;
      watchLock = true;
      mCtx.index = index;
      // console.log('layout-index', index);
      let cache = item.__cache__;
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
      return arrayBinaryFindIndex(
        LIST.value,
        (item) => {
          if (!item.__cache__) return false;
          return item.__cache__.vTop <= sTop && sTop <= item.__cache__.vBottom;
        },
        (item) => {
          if (!item.__cache__) return false;
          return item.__cache__.vTop < sTop;
        },
      );
    }

    function getHeight() {
      const columns = LIST.value.at(-1)?.__cache__?.columns2;
      if (!columns) return minHeight.value;
      let col = columns[0];
      columns.forEach((el) => {
        if (el.height > col.height) col = el;
      });
      return col.height;
    }

    function createBackstage() {
      let timer;
      let index = 0;
      let column;
      const requestTimer = requestIdleCallback || requestAnimationFrame;
      const cancelRequestTimer = requestIdleCallback ? cancelIdleCallback : cancelAnimationFrame;

      function rePreLoads() {
        index = mCtx.endIndex;
        column = mCtx.endColumn;
        preLoads();
      }

      function preLoad() {
        const ele = LIST.value[index];
        if (!ele) return;
        let node = column;
        if (!ele.__cache__) ele.__cache__ = {};
        const cache__height = ele.__cache__.height || props.avgHeight;
        ele.__cache__.columns = falls.list.map((el) => ({ ...el }));
        if (node.height) node.height = node.height + props.gap;
        ele.__cache__.top = node.height;
        ele.__cache__.left = node.left;
        ele.__cache__.width = node.width;
        ele.__cache__.columnIndex = node.index;
        ele.__cache__.height = cache__height;
        node.height = node.height + cache__height;
        ele.__cache__.bottom = node.height;
        ele.__cache__.columns2 = falls.list.map((el) => ({ ...el }));
        ele.__cache__.vTop = ele.__cache__.top + recycleTop();
        ele.__cache__.vBottom = ele.__cache__.bottom + recycleBottom();
        index++;
        column = falls.getMinHeightItem();
      }

      function preLoads(count = props.preLoadsCount) {
        let nth = 0;
        while (nth < props.preLoadsCount) {
          preLoad();
          nth++;
        }
      }

      function idleCallback(deadline) {
        if (index >= LIST.value.length) {
          stop();
          return;
        }

        const hasTimeRemaining =
          typeof deadline === "object" && deadline.timeRemaining && deadline.timeRemaining() > 0;

        if (hasTimeRemaining || typeof deadline === "number") {
          try {
            preLoads(10);
          } catch (error) {
            console.error("Error in callback:", error);
          }

          if (
            (typeof deadline === "object" && !deadline.didTimeout) ||
            typeof deadline === "number"
          ) {
            timer = requestTimer(idleCallback);
          }
        }
      }

      function start() {
        timer = requestTimer(idleCallback);
      }

      function stop() {
        if (timer) {
          cancelRequestTimer(timer);
          timer = null;
        }
      }

      function trigger() {
        requestTimer(idleCallback);
      }

      return { start, stop, trigger, preLoads, preLoad, rePreLoads };
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

    watch(
      () => LIST.value.slice(mCtx.index, mCtx.index + props.renderCount),
      () => {
        // console.log('list ------ watch', watchLock);
        if (watchLock) return;
        layout(true);
      },
    );

    return () => {
      return (
        <div>
          <ListenerList
            list={LIST.value.slice(mCtx.index, mCtx.index + props.renderCount)}
          ></ListenerList>
          <div
            style={{ height: getHeight() + "px" }}
            data-length={LIST.value.length}
            ref={(el) => (contentHtml = el)}
            class="r-scroll-virtual-falls-list"
          ></div>
        </div>
      );
    };
  },
});
