import {
  defineComponent,
  computed,
  reactive,
  provide,
  render,
  watch,
  onMounted,
  renderList,
} from "vue";
import { useScrollController, useFallsLayout, arrayBinaryFindIndex } from "../utils.js";
import { useResizeObserver } from "@rainbow_ljy/v-hooks";

const mProps = {
  avgHeight: { type: Number, default: 300 }, // 每个item高度
  keyExtractor: { type: Function, default: ({ index }) => index },
  columns: { type: Number, default: 1 }, // 一行几个item
  gap: { type: Number, default: 10 }, // 列表之间空格的间距
  inline: Boolean,
  minWidth: Number,
  listHook: Object,
  list: Array,
  preLoadsCount: { type: Number, default: 100 },
  preLoadCount: { type: Number, default: 50 },
  renderCount: { type: Number, default: 30 },
};

const ListenerList = defineComponent({
  props: {
    list: Array,
  },
  setup(props, context) {
    return () => {
      return renderList(props.list || [], () => null);
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

export const RScrollVirtualFallsListV2 = defineComponent({
  props: {
    ...mProps,
  },
  setup(props, context) {
    const falls = useFallsLayout(props);
    const LIST = computed(() => (props.listHook ? props.listHook.list : props.list) || []);
    let watchLock = false;
    let contentHtml;
    let INDEX = 0;
    let COLUMN = falls.getMinHeightItem();
    let CACHE = {
      nodeMap: new Map(),
      currentDivNode: undefined,
      list: [],
      item: undefined,
    };
    const CURRENT = reactive({
      nodeMap: new Map(),
      index: 0,
      list: [],
    });
    const backstageTask = createBackstage();
    const mCtx = reactive({ context, slots: context.slots, renderItems, layout });
    provide("RScrollVirtualFallsListContext", mCtx);
    context.expose(mCtx);
    watch(() => LIST.value.slice(CURRENT.index, CURRENT.index + props.renderCount), onListChange);
    const scrollController = useScrollController({ onScroll, onResize });
    const scrollTop = () => scrollController?.context?.element?.scrollTop ?? 0;
    const minHeight = computed(() => {
      if (!LIST.value.length) return 0;
      return (
        (props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) - props.gap
      );
    });
    const recycleTop = () => -window.innerHeight + scrollController.getOffsetTop(contentHtml);
    const recycleBottom = () => window.innerHeight * 2 + scrollController.getOffsetTop(contentHtml);

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

    function renderItem(nth) {
      const ele = LIST.value[INDEX];
      if (!ele) return;
      let node = COLUMN;
      if (!ele.__cache__) ele.__cache__ = {};
      ele.__cache__.columns = falls.list.map((el) => ({ ...el }));
      if (node.height) node.height = node.height + props.gap;
      ele.__cache__.top = node.height;
      ele.__cache__.left = node.left;
      ele.__cache__.width = node.width;
      ele.__cache__.columnIndex = node.index;
      ele.__cache__.index = INDEX;
      // console.log(CACHE.nodeMap.has(ele), ele);
      let div;
      if (CACHE.nodeMap.has(ele)) {
        div = CACHE.nodeMap.get(ele);
        div.setAttribute("data-index", INDEX);
        render(
          <Item
            item={ele}
            index={INDEX}
            slots={context.slots}
            key={props.keyExtractor({ item: ele, index: INDEX })}
            onHeightChange={onHeightChange}
          ></Item>,
          div,
        );
        // console.log('缓存有', div);
        if (CACHE.currentDivNode) {
          if (CACHE.currentDivNode.nextSibling === div) {
            // 当 当前指针的下一个和要渲染的div相同
          } else {
            contentHtml.insertBefore(div, CACHE.currentDivNode.nextSibling);
          }
        }

        CACHE.currentDivNode = div;
        CACHE.nodeMap.delete(ele);
        // console.log('删除', CACHE.nodeMap.size);
      } else {
        // console.log('没有则创建', INDEX, ele);
        div = document.createElement("div");
        div.setAttribute("data-index", INDEX);
        div.classList.add("r-scroll-virtual-falls-list-item");
        render(
          <Item
            item={ele}
            index={INDEX}
            slots={context.slots}
            key={props.keyExtractor({ item: ele, index: INDEX })}
            onHeightChange={onHeightChange}
          ></Item>,
          div,
        );
        if (!CACHE.currentDivNode) {
          contentHtml.insertBefore(div, contentHtml.firstChild);
          CACHE.currentDivNode = div;
        } else {
          contentHtml.insertBefore(div, CACHE.currentDivNode.nextSibling);
          CACHE.currentDivNode = div;
        }
      }
      div.style.top = ele?.__cache__?.top + "px";
      div.style.left = ele?.__cache__?.left;
      div.style.width = ele?.__cache__?.width;
      ele.__cache__.height = div.offsetHeight;
      node.height = node.height + div.offsetHeight;
      ele.__cache__.bottom = node.height;
      ele.__cache__.vTop = ele.__cache__.top + recycleTop();
      ele.__cache__.vBottom = ele.__cache__.bottom + recycleBottom();
      ele.__cache__.columns2 = falls.list.map((el) => ({ ...el }));
      //
      INDEX++;
      COLUMN = falls.getMinHeightItem();
      CURRENT.nodeMap.set(ele, div);
    }

    function renderItems() {
      let n = 0;
      CURRENT.nodeMap = new Map();
      CACHE.currentDivNode = undefined;
      backstageTask.stop();
      while (n < props.renderCount) {
        renderItem(n);
        n++;
      }
      // console.log('需要删除的', CACHE.nodeMap);
      CACHE.nodeMap.forEach((div) => {
        div.remove();
      });
      CACHE.currentDivNode = undefined;
      CACHE.nodeMap = CURRENT.nodeMap;
      preLoads();
      backstageTask.start();
    }

    function layout(isForce) {
      let index = findIndex(scrollTop());
      if (index === -1) index = 0;
      let item = LIST.value[index];
      if (!item) return;
      if (!isForce && CACHE.item === item) return;
      // console.log('layout');
      INDEX = index;
      watchLock = true;
      CURRENT.index = INDEX;
      let cache = item.__cache__;
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
      const ele = LIST.value[INDEX];
      if (!ele) return;
      let node = COLUMN;
      if (!ele.__cache__) ele.__cache__ = {};
      const cache__height = ele.__cache__.height || props.avgHeight;
      ele.__cache__.columns = falls.list.map((el) => ({ ...el }));
      if (node.height) node.height = node.height + props.gap;
      ele.__cache__.top = node.height;
      ele.__cache__.left = node.left;
      ele.__cache__.width = node.width;
      ele.__cache__.columnIndex = node.index;
      ele.__cache__.index = INDEX;
      ele.__cache__.height = cache__height;
      node.height = node.height + cache__height;
      ele.__cache__.bottom = node.height;
      ele.__cache__.columns2 = falls.list.map((el) => ({ ...el }));
      ele.__cache__.vTop = ele.__cache__.top + recycleTop();
      ele.__cache__.vBottom = ele.__cache__.bottom + recycleBottom();
      INDEX++;
      COLUMN = falls.getMinHeightItem();
    }

    function preLoads(count = props.preLoadsCount) {
      let n = 0;
      while (n < count) {
        preLoad();
        n++;
      }
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
      const requestTimer = window.requestIdleCallback || requestAnimationFrame;
      const cancelRequestTimer = window.requestIdleCallback ? cancelIdleCallback : cancelAnimationFrame;

      function idleCallback(deadline) {
        if (INDEX >= LIST.value.length) {
          stop();
          return;
        }

        const hasTimeRemaining =
          typeof deadline === "object" && deadline.timeRemaining && deadline.timeRemaining() > 0;

        if (hasTimeRemaining || typeof deadline === "number") {
          try {
            preLoads(props.preLoadCount);
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

      return { start, stop, trigger };
    }

    onMounted(() => {
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
      return (
        <div>
          <ListenerList
            list={LIST.value.slice(CURRENT.index, CURRENT.index + props.renderCount)}
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
