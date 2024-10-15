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


const Context = defineComponent({
  props: {
    ...mProps,
  },
  setup(props, context) {
    const mCtx = inject("RScrollVirtualFallsListContext") || {};

    function handleMark(item) {
      if (item.item.__markCount !== mCtx.markCount) {
        item.item.__markCount = mCtx.markCount;
        mCtx.context.emit("itemMarkrender", item);
      }
    }

    return () => {
      return renderList(mCtx.renderList, (item, index) => {
        handleMark(item);
        return (
          <div class="r-scroll-virtual-falls-list-item" style={item.style} key={props.keyExtractor(item)}>
            {renderSlot(mCtx.slots, "default", item)}
          </div>
        );
      });
    };
  },
});

const Item = defineComponent({
  props: {
    item: Object,
    index: Number,
    slots: Object
  },
  setup(props, context) {
    // const parentCtx = inject("RScrollVirtualFallsListContext");
    let vm;

    const rObserver = useResizeObserver(() => vm.$el, onSizeChange);


    onBeforeMount(() => {
      // console.log('item onBeforeMount');
    })


    function onSizeChange(events) {
      // console.log([events[0].target]);
      // console.log(events[0].target.offsetHeight);
      const height = events[0].target.offsetHeight;
      if (height === 0) {
        return
      }
      // console.log('onSizeChange', props.item?.__cache__?.height, height);
      // console.log();
      if (props.item?.__cache__?.height !== height) {
        console.log('高度发生变化', props.item?.__cache__?.height, height);
      }



    }

    // parentCtx?.slots?.default?.(props)
    // top: props.item?.__cache__?.top + 'px',
    // left: props.item?.__cache__?.left,
    // width: props.item?.__cache__?.width,
    return (el) => {
      vm = el
      return <div class=" r-scroll-virtual-falls-list-item2 " style={{}}>{props?.slots?.default?.(props)}</div>
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

    const falls = useFallsLayout(props);

    function each(nth, list, formater) {
      for (let index = nth; index < list.length; index++) {
        const ele = list[index];
        if (formater(list[index], index)) return { index, ele }
      }
    }





    //  4,5,6,7,8,9
    //  6,7,8,9,10


    function layout(columnIndex, begin = 0) {
      contentHtml.innerHTML = ''
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

        let div = document.createElement('div')
        div.classList.add('r-scroll-virtual-falls-list-item');
        render(<Item item={ele} index={index} slots={context.slots} key={ele.id} ></Item>, div);
        contentHtml.appendChild(div);
        div.style.top = ele?.__cache__?.top + 'px';
        div.style.left = ele?.__cache__?.left;
        div.style.width = ele?.__cache__?.width;
        // console.log(div.offsetHeight);

        ele.__cache__.height = div.offsetHeight;
        node.height = node.height + div.offsetHeight;
        ele.__cache__.bottom = node.height;
        ele.__cache__.vTop = ele.__cache__.top - window.innerHeight
        ele.__cache__.vBottom = ele.__cache__.bottom + window.innerHeight

        count++;
        if (count > 20) return true;
      });
    }


    onMounted(() => {
      layout()
    })




    const minHeight = computed(() => {
      if (!LIST.value.length) return 0;
      return ((props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) - props.gap);
    });







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

    let cacheitem;
    const scrollController = useScrollController({
      onScroll(event, sTop) {
        // console.log();
        let item = find(sTop);
        if (cacheitem === item) return;
        let cache = item.__cache__;
        // console.log(sTop, cache);
        // console.log(cache.columnIndex, cache.index);
        falls.list = cache.columns;
        layout(cache.columnIndex, cache.index)
        cacheitem = item;

      },
      onResize(entries, sTop) {
        // layout();
      },
    });


    const mCtx = reactive({
      context,
      slots: context.slots,
      renderList: [],


    });


    provide("RScrollVirtualFallsListContext", mCtx);

    context.expose(mCtx);



    return () => {
      return (
        <div>
          <div
            style={{ minHeight: minHeight.value + 'px' }}
            data-length={LIST.value.length}
            ref={(el) => (contentHtml = el)}
            class="r-scroll-virtual-falls-list"
          >
            {/* {
            renderList(LIST.value, (item, index) => {
              return <Item item={item} index={index} ></Item>
            })
          } */}

          </div>
        </div>
      );
    };
  },
});
// {/* <Context keyExtractor={props.keyExtractor}></Context> */}