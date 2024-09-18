import {
  defineComponent,
  renderSlot,
  renderList,
  computed,
  inject,
  reactive,
  provide,
} from "vue";
import { useScrollController } from "../scroll";
import { arrayLoop } from "@rainbow_ljy/rainbow-js";
import './index.scss'

const mProps = {
  bothEndsHeight: { type: Number, default: 0 }, //列表 两端的高度
  avgHeight: { type: Number, default: 120 }, // 每个item高度
  keyExtractor: { type: Function, default: ({ index }) => index },
  columns: { type: Number, default: 1 }, // 一行几个item
  gap: { type: Number, default: 10 }, // 列表之间空格的间距
  inline: Boolean,
  minWidth: Number,
  listHook: Object,
  list: Array,
  openAnimationFrame: Boolean,
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
    const mCtx = inject("RScrollVirtualGridListContext") || {};

    function handleMark(item) {
      if (typeof item.item !== 'object') return;
      if (item.item.__markCount !== mCtx.markCount) {
        item.item.__markCount = mCtx.markCount;
        mCtx.context.emit("itemMarkrender", item);
      }
    }

    return () => {
      return renderList(mCtx.renderList, (item, index) => {
        handleMark(item);
        return (
          <div data-index={item.index} class="r-scroll-virtual-grid-list-item" style={item.style} key={props.keyExtractor(item)}>
            {renderSlot(mCtx.slots, "default", item)}
          </div>
        );
      });
    };
  },
});

export const RScrollVirtualGridList = defineComponent({
  props: {
    ...mProps,
  },
  setup(props, context) {
    let cache = {
      index: undefined,
    }
    let contentHtml;
    const recycleHeight = () => window.innerHeight;  //window.innerHeight; // 有些浏览器初始拿innerHeight有时为0;
    const itemWidth = computed(() => `calc( ${100 / props.columns}% - ${((props.columns - 1) * props.gap) / props.columns}px )`);
    const LIST = computed(() => (props.listHook ? props.listHook.list : props.list) || []);
    const HEIGHT = computed(() => {
      if (!LIST.value.length) return 0;
      return (
        (props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) -
        props.gap +
        props.bothEndsHeight * 2
      );
    });




    const scrollController = useScrollController({
      onScroll(event, sTop) {
        layout();
      },
      onResize(entries, sTop) {
        layout();
      },
    });


    const mCtx = reactive({
      context,
      slots: context.slots,

      itemWidth,
      height: HEIGHT,
      renderList: [],

      markCount: 0,
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
      return `calc( ${(100 / props.columns) * i}% - ${(((props.columns - 1) * props.gap) / props.columns) * i
        }px + ${i * props.gap}px )`;
    }



    function getRenderList(index, addH = 0, pList = []) {
      const sTop = scrollController.context.element.scrollTop;
      const offsetTop = scrollController.getOffsetTop(contentHtml);
      if (index >= LIST.value.length) return pList;

      arrayLoop(props.columns, (i) => {
        if (index >= 0) {
          const nth = Math.floor(index / props.columns);
          let top = nth * (props.avgHeight + props.gap) + props.bothEndsHeight + "px";
          if (nth === 0) top = props.bothEndsHeight + "px";
          const left = getLeft(i);
          const width = itemWidth.value;
          const height = props.avgHeight + "px";
          pList.push({
            index,
            style: { top, left, width, height },
            item: LIST.value[index],
          });
        }

        index++;
      });
      addH = addH + props.avgHeight + props.gap;
      if (addH < window.innerHeight + recycleHeight() * 2) return getRenderList(index, addH, pList);
      return pList;
    }

    function doLayout(isCache = true) {
      if (!scrollController.context.element) return;
      const sTop = scrollController.context.element.scrollTop;
      const offsetTop = scrollController.getOffsetTop(contentHtml);
      const renderTop = offsetTop - sTop - window.innerHeight - recycleHeight();
      if (renderTop > 0) return;
      let aaa = Math.floor(recycleHeight() / (props.avgHeight + props.gap)) * props.columns
      let bbb = Math.floor((sTop - offsetTop) / (props.avgHeight + props.gap)) * props.columns;
      let index = bbb - aaa
      if (cache.index === index && isCache) return;
      cache.index = index;
      mCtx.renderList = getRenderList(index);
      // console.log('---------layout ---------');
      // console.log(`renderTop : ${renderTop}`);
      // console.log(`index : ${index}`);
      // console.log(mCtx.renderList);
      // console.log('  ');
    }

    let time;
    function layout(isCache = true) {
      if (!props.openAnimationFrame) return doLayout(isCache)
      cancelAnimationFrame(time)
      time = requestAnimationFrame(() => {
        doLayout(isCache)
      })
    }

    return () => {
      // console.log('---------render ---------');
      layout(false);
      return (
        <div
          data-length={LIST.value.length}
          ref={(el) => (contentHtml = el)}
          style={{ height: HEIGHT.value + "px" }}
          class="r-scroll-virtual-grid-list"
        >
          <Context keyExtractor={props.keyExtractor}></Context>
        </div>
      );
    };
  },
});
