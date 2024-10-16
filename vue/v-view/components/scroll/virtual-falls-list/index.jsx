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
import { arrayBinaryFind, arrayLoop, arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import './index.scss'

const mProps = {
  avgHeight: { type: Number, default: 400 }, // 每个item高度
  keyExtractor: { type: Function, default: ({ index }) => index },
  columns: { type: Number, default: 2 }, // 一行几个item
  gap: { type: Number, default: 10 }, // 列表之间空格的间距
  inline: Boolean,
  minWidth: Number,
  listHook: Object,
  list: Array,
  //
  behavior: { type: String, default: "smooth" }, // smooth  instant
  scrollOffsetTop: { type: Number, default: 0 }, // 更换list时候的滚动偏移量
  isScrollTop: { type: Boolean, default: false }, // 更换list时候是否滚动滚动
};




const Item = defineComponent({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(props, context) {
    let vm;
    const rObserver = useResizeObserver(() => vm.$el, onSizeChange, true);

    onBeforeMount(() => {
      // console.log('item onBeforeMount');
    })


    function onSizeChange(events) {
      const height = events?.[0]?.target?.offsetHeight ?? 0;
      const oldHeight = props.item?.__cache__?.height ?? 0;
      if (height === 0) return
      if (oldHeight !== height) {
        if (props.item?.__cache__) props.item.__cache__.height = height;
        console.log('高度发生变化', oldHeight, height);
        context.emit('heightChange', height, oldHeight, events)

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

export const RScrollVirtualFallsList = defineComponent({
  props: {
    ...mProps,
  },
  setup(props, context) {
    const LIST = computed(() => (props.listHook ? props.listHook.list : props.list) || []);
    let contentHtml;
    let cacheitem;
    let INDEX = 0;
    const falls = useFallsLayout(props);
    const mCtx = reactive({ context, slots: context.slots });
    const scrollController = useScrollController({ onScroll, onResize, onTouchstart, onTouchend });
    const scrollTop = () => scrollController?.context?.element?.scrollTop ?? 0;
    const minHeight = computed(() => {
      if (!LIST.value.length) return 0;
      return ((props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) - props.gap);
    });



    //  4,5,6,7,8,9
    //  6,7,8,9,10

    function each(nth, list, formater) {
      for (let index = nth; index < list.length; index++) {
        const ele = list[index];
        if (formater(list[index], index)) return { index, ele }
      }
    }


    function find(sTop) {
      return arrayBinaryFind(LIST.value,
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


    function cacheRender() {
      const ele = LIST.value[INDEX];
      let node = falls.getMinHeightItem(columnIndex);
      ele.__cache__.columns = falls.list.map(el => ({ ...el }))
      if (node.height) node.height = node.height + props.gap;
      ele.__cache__.top = node.height;
      ele.__cache__.left = node.left;
      ele.__cache__.width = node.width;
      ele.__cache__.columnIndex = node.index;
      ele.__cache__.index = INDEX;
      let div = document.createElement('div');
      div.classList.add('r-scroll-virtual-falls-list-item');
      render(<Item item={ele} index={INDEX} slots={context.slots} key={ele.id} onHeightChange={onHeightChange}></Item>, div);
      contentHtml.appendChild(div);
      div.style.top = ele?.__cache__?.top + 'px';
      div.style.left = ele?.__cache__?.left;
      div.style.width = ele?.__cache__?.width;
      ele.__cache__.height = div.offsetHeight;
      node.height = node.height + div.offsetHeight;
      ele.__cache__.bottom = node.height;
      ele.__cache__.vTop = ele.__cache__.top - window.innerHeight
      ele.__cache__.vBottom = ele.__cache__.bottom + window.innerHeight
    }

    // const divs = arrayLoopMap(100, () => document.createElement('div'));
    // const cachedivs = [];
    // function getDiv() {
    //   let divEle = divs[0];
    //   divEle.style.top = ''
    //   divEle.style.left = ''
    //   divEle.style.width = ''
    //   divEle.style.height = ''
    //   divs.shift();
    //   cachedivs.push(divEle)
    //   return divEle
    // }

    // function resetDiv() {
    //   divs.push(...cachedivs)
    // }


    function handleRender(columnIndex, begin = 0) {
      contentHtml.innerHTML = ''
      // resetDiv();
      let count = 0;
      each(begin, LIST.value, (ele, index) => {
        if (!ele.__cache__) ele.__cache__ = {};
        let node = falls.getMinHeightItem(columnIndex);
        columnIndex = undefined;
        ele.__cache__.columns = falls.list.map(el => ({ ...el }))

        if (node.height) node.height = node.height + props.gap;
        ele.__cache__.top = node.height;
        ele.__cache__.left = node.left;
        ele.__cache__.width = node.width;
        ele.__cache__.columnIndex = node.index;
        ele.__cache__.index = index;

        let div = document.createElement('div');
        div.classList.add('r-scroll-virtual-falls-list-item');
        render(<Item item={ele} index={index} slots={context.slots} key={ele.id} onHeightChange={onHeightChange}></Item>, div);
        contentHtml.appendChild(div);
        div.style.top = ele?.__cache__?.top + 'px';
        div.style.left = ele?.__cache__?.left;
        div.style.width = ele?.__cache__?.width;
        if (ele.__cache__.height) div.style.height = ele?.__cache__?.height + 'px';
        // console.log(div.offsetHeight);

        ele.__cache__.height = div.offsetHeight;
        node.height = node.height + div.offsetHeight;
        ele.__cache__.bottom = node.height;
        ele.__cache__.vTop = ele.__cache__.top - window.innerHeight
        ele.__cache__.vBottom = ele.__cache__.bottom + window.innerHeight

        count++;
        if (count > 30) return true;
      });
    }

    function layout() {
      let item = find(scrollTop());
      if (!item) return;
      if (cacheitem === item) return;
      let cache = item.__cache__;
      falls.list = cache.columns;
      handleRender(cache.columnIndex, cache.index)
      cacheitem = item;
    }

    function resize() {
      let item = find(scrollTop());
      let cache = item.__cache__;
      falls.list = cache.columns;
      handleRender(cache.columnIndex, cache.index)
      cacheitem = item;
    }

    function idleCallback(deadline) {
      var timeRemaining = deadline.timeRemaining();

      if (timeRemaining > 0) {
        // 在剩余时间内执行尽可能多的工作
        console.log('空闲欲加载');

        // let div = document.createElement('div')
        // div.classList.add('r-scroll-virtual-falls-list-item');
        // render(<Item item={ele} index={index} slots={context.slots} key={ele.id} onHeightChange={onHeightChange}></Item>, div);
        // contentHtml.appendChild(div);

        // if (!deadline.didTimeout) {
        //   requestIdleCallback(idleCallback);
        // }
      } else {
        // 如果没有足够的时间，则放弃执行
        // console.log('Not enough time remaining to execute task.');
      }
    }

    // 注册回调
    requestIdleCallback(idleCallback);


    onMounted(() => {
      console.log('onMounted', scrollTop());
      handleRender()
    })

    function onHeightChange() {
      console.log('onHeightChange');
      resize()
    }

    function onTouchstart(params) {
      console.log('onTouchstart', scrollTop());
    }

    function onTouchend(params) {
      console.log('onTouchend', scrollTop());
    }

    function onScroll() {
      // console.log('onScroll', scrollTop());
      layout()
      requestIdleCallback(idleCallback);
    }

    function onResize() {
      console.log('onResize', scrollTop());
      layout()
    }

    provide("RScrollVirtualFallsListContext", mCtx);
    context.expose(mCtx);

    watch(() => LIST.value.length, (...arg) => {
      console.log('watch LIST', ...arg);
    })

    return () => {
      console.log('onRender', scrollTop());
      return (
        <div>
          <div
            style={{ minHeight: minHeight.value + 'px' }}
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
// {/* <Context keyExtractor={props.keyExtractor}></Context> */}