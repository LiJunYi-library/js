import {
  defineComponent,
  renderSlot,
  renderList,
  computed,
  inject,
  reactive,
  provide,
  render,
  ref,
  watch,
  onMounted,
  onBeforeMount
} from "vue";
import { useScrollController } from "../scroll";
import { useFallsLayout } from "../../falls";
import { useResizeObserver } from "@rainbow_ljy/v-hooks";
import { arrayBinaryFindIndex, arrayLoopMap, animationDebounced } from "@rainbow_ljy/rainbow-js";
import './index.scss'

const mProps = {
  avgHeight: { type: Number, default: 400 }, // 每个item高度
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

const Item = defineComponent({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(props, context) {
    let vm;
    const rObserver = useResizeObserver(() => vm.$el, onSizeChange);

    onBeforeMount(() => {
      // console.log('item onBeforeMount');
    })

    function onSizeChange(events) {
      const height = events?.[0]?.target?.offsetHeight ?? 0;
      const oldHeight = props.item?.__cache__?.height ?? 0;
      if (height === 0) return
      if (oldHeight !== height) {
        if (props.item?.__cache__) {
          props.item.__cache__.height = height;
          props.item.__cache__.isResize = true;
        };
        // console.log('高度发生变化', oldHeight, height);
        // context.emit('heightChange', height, oldHeight, events)
      }
    }
    // parentCtx?.slots?.default?.(props)
    // top: props.item?.__cache__?.top + 'px',
    // left: props.item?.__cache__?.left,
    // width: props.item?.__cache__?.width,
    return (el) => {
      vm = el
      return <div class="r-scroll-virtual-falls-list-item-content" >{props?.slots?.default?.(props)}</div>
    }
  }
})


const renderer = defineComponent({
  props: {
    items: { type: Array, default: () => [] },
    index: Number,
    slots: Object
  },
  setup(props, context) {
    return (el) => {
      return renderList(props.items, (item, index) => <Item index={index} item={item}></Item>)
    }
  }
})



export const RScrollVirtualFallsList = defineComponent({
  props: {
    ...mProps,
  },
  setup(props, context) {
    const falls = useFallsLayout(props);
    const LIST = computed(() => (props.listHook ? props.listHook.list : props.list) || []);
    let contentHtml;
    let INDEX = 0;
    let COLUMN = falls.getMinHeightItem();
    let CACHE = {
      list: [],
      item: undefined,
    }
    const CURRENT = reactive({
      index: 0,
      list: [],
    })
    const backstageTask = createBackstage();
    const docs = createHtmlTask();
    const mCtx = reactive({ context, slots: context.slots });
    provide("RScrollVirtualFallsListContext", mCtx);
    context.expose(mCtx);
    watch(() => LIST.value.length, onListChange)
    const scrollController = useScrollController({ onScroll, onResize, onTouchstart, onTouchend });
    const scrollTop = () => scrollController?.context?.element?.scrollTop ?? 0;
    const minHeight = computed(() => {
      if (!LIST.value.length) return 0;
      return ((props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) - props.gap);
    });
    const recycleTop = () => -window.innerHeight + scrollController.getOffsetTop(contentHtml);
    const recycleBottom = () => window.innerHeight + scrollController.getOffsetTop(contentHtml);



    function findIndex(sTop) {
      return arrayBinaryFindIndex(LIST.value,
        (item) => {
          if (!item.__cache__) return false;
          return item.__cache__.vTop <= sTop && sTop <= item.__cache__.vBottom
        },
        (item) => {
          if (!item.__cache__) return false;
          return item.__cache__.vTop < sTop
        }
      )
    }

    function find(sTop) {
      const nth = findIndex(sTop);
      return LIST.value[nth]
    }

    function renderItem(nth) {
      const ele = LIST.value[INDEX];
      if (!ele) return;
      let node = COLUMN;
      if (!ele.__cache__) ele.__cache__ = {};
      ele.__cache__.columns = falls.list.map(el => ({ ...el }))
      if (node.height) node.height = node.height + props.gap;
      ele.__cache__.top = node.height;
      ele.__cache__.left = node.left;
      ele.__cache__.width = node.width;
      ele.__cache__.columnIndex = node.index;
      ele.__cache__.index = INDEX;
      let div = docs.getDiv(nth);
      div.setAttribute('data-index', INDEX)
      div.classList.add('r-scroll-virtual-falls-list-item');
      render(<Item item={ele} index={INDEX} slots={context.slots} key={props.keyExtractor({ item: ele, index: INDEX })} onHeightChange={onHeightChange}></Item>, div);
      contentHtml.appendChild(div);
      div.style.top = ele?.__cache__?.top + 'px';
      div.style.left = ele?.__cache__?.left;
      div.style.width = ele?.__cache__?.width;
      ele.__cache__.height = div.offsetHeight;
      node.height = node.height + div.offsetHeight;
      ele.__cache__.bottom = node.height;
      ele.__cache__.vTop = ele.__cache__.top + recycleTop();
      ele.__cache__.vBottom = ele.__cache__.bottom + recycleBottom();
      ele.__cache__.columns2 = falls.list.map(el => ({ ...el }))
      INDEX++;
      COLUMN = falls.getMinHeightItem();
    }

    function renderItems() {
      let n = 0;
      contentHtml.innerHTML = ''
      docs.resetDiv();
      backstageTask.stop();
      while (n < props.renderCount) {
        renderItem(n);
        n++;
      }
      preLoads();
      backstageTask.start();
    }

    function layout() {
      let item = find(scrollTop());
      if (!item) return;
      if (CACHE.item === item) return;
      let cache = item.__cache__;
      // console.log('--', cache.index);
      falls.list = cache.columns;
      INDEX = cache.index;
      CURRENT.index = INDEX;
      COLUMN = falls.getMinHeightItem(cache.columnIndex);
      CACHE.item = item;
      renderItems()
    }

    function resize() {
      let item = find(scrollTop());
      if (!item) return;
      let cache = item.__cache__;
      // console.log('--', cache.index);
      falls.list = cache.columns;
      INDEX = cache.index;
      CURRENT.index = INDEX;
      COLUMN = falls.getMinHeightItem(cache.columnIndex);
      CACHE.item = item;
      renderItems()
    }

    function preLoad() {
      const ele = LIST.value[INDEX];
      if (!ele) return;
      // console.log(ele);
      let node = COLUMN;
      if (!ele.__cache__) ele.__cache__ = {};
      // console.log(' ele.__cache__.height', ele.__cache__.height);
      const cache__height = ele.__cache__.height || props.avgHeight
      ele.__cache__.columns = falls.list.map(el => ({ ...el }))
      if (node.height) node.height = node.height + props.gap;
      ele.__cache__.top = node.height;
      ele.__cache__.left = node.left;
      ele.__cache__.width = node.width;
      ele.__cache__.columnIndex = node.index;
      ele.__cache__.index = INDEX;
      ele.__cache__.height = cache__height;
      node.height = node.height + cache__height;
      ele.__cache__.bottom = node.height;
      ele.__cache__.vTop = ele.__cache__.top + recycleTop();
      ele.__cache__.vBottom = ele.__cache__.bottom + recycleBottom();
      INDEX++;
      COLUMN = falls.getMinHeightItem();
    }

    function preLoads() {
      let n = 0;
      while (n < props.preLoadsCount) {
        preLoad();
        n++;
      }
    }

    function getHeight() {
      const columns = LIST.value.at(-1)?.__cache__?.columns2;
      if (!columns) return minHeight.value;
      let col = columns[0];
      columns.forEach((el) => { if (el.height > col.height) col = el });
      return col.height;
    }

    function createBackstage() {
      let timer;

      function idleCallback(deadline) {
        if (INDEX >= LIST.value.length) {
          stop()
          return
        }
        const timeRemaining = deadline.timeRemaining();
        if (timeRemaining > 0) {
          preLoad()
          if (!deadline.didTimeout) {
            timer = requestIdleCallback(idleCallback);
          }
        } else {
          // 如果没有足够的时间，则放弃执行
          // console.log('Not enough time remaining to execute task.');
        }
      }

      function start() {
        // console.log('start');
        timer = requestIdleCallback(idleCallback);
      }

      function stop() {
        // console.log('stop');
        cancelIdleCallback(timer)
      }

      function trigger() {
        requestIdleCallback(idleCallback);
      }

      return { start, stop, trigger }
    }

    function createHtmlTask(params) {
      const divs = arrayLoopMap(props.renderCount + 1, () => document.createElement('div'));
      const cachedivs = [];
      function getDiv(nth) {
        let divEle = divs[nth];
        divEle.style.top = ''
        divEle.style.left = ''
        divEle.style.width = ''
        divEle.style.height = ''
        // divs.shift();
        // cachedivs.push(divEle)
        return divEle
        // return document.createElement('div')
      }
      function resetDiv() {
        // divs.push(...cachedivs)
      }
      return { getDiv, resetDiv }
    }

    onMounted(() => {
      // console.log('onMounted', scrollTop());
      renderItems();
    })

    function onHeightChange() {
      console.log('onHeightChange');
      resize()
    }

    function onTouchstart(params) {
      // console.log('onTouchstart', scrollTop());
    }

    function onTouchend(params) {
      // console.log('onTouchend', scrollTop());
    }

    function onScroll() {
      // console.log('onScroll');
      layout()
    }

    function onResize() {
      // console.log('onResize', scrollTop());
      layout()
    }

    function onListChange() {
      resize()
    }


    return () => {
      return (
        <div>
          <div
            style={{ height: getHeight() + 'px' }}
            data-length={LIST.value.length}
            ref={(el) => (contentHtml = el)}
            class="r-scroll-virtual-falls-list"
          >
          </div>
        </div>
      );
    };
  },
});
