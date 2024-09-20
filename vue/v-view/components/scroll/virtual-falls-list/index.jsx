import {
  defineComponent,
  renderSlot,
  renderList,
  computed,
  inject,
  reactive,
  provide,
  ref
} from "vue";
import { useScrollController } from "../scroll";
import { arrayLoop, arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import './index.scss'

const mProps = {
  avgHeight: { type: Number, default: 120 }, // 每个item高度
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

export const RScrollVirtualFallsList = defineComponent({
  props: {
    ...mProps,
  },
  setup(props, context) {
    let contentHtml;
    const recycleHeight = () => window.innerHeight; // 有些浏览器初始拿innerHeight有时为0;
    const itemWidth = computed(() => `calc( ${100 / props.columns}% - ${((props.columns - 1) * props.gap) / props.columns}px )`);
    const LIST = computed(() => (props.listHook ? props.listHook.list : props.list) || []);


    const FALLS = (() => {
      function getList() {
        const arr = arrayLoopMap(props.columns, (i) => ({ height: 0, with: itemWidth.value, left: getLeft(i), top: 0, children: [] }));
        return arr;
      }

      const list = ref(getList());

      // [].reduce

      function getMinHeight() {
        return LIST.value.reduce((val, item) => val = item.height < val.height ? item : val, list.value[0])
      }

      LIST.value.forEach((item, index) => {
        const col = getMinHeight();
        if(item.__height)
        col.children
      });


      return { list }
    })()


    console.log('FALLS', FALLS);



    function name(params) {

    }

    const HEIGHT = computed(() => {
      if (!LIST.value.length) return 0;
      return (
        (props.avgHeight + props.gap) * Math.ceil(LIST.value.length / props.columns) -
        props.gap

      );
    });


    const scrollController = useScrollController({
      onScroll(event, sTop) {
        // layout();
      },
      onResize(entries, sTop) {
        // layout();
      },
    });


    const mCtx = reactive({
      context,
      slots: context.slots,

      itemWidth,
      height: HEIGHT,
      renderList: [],

      markCount: 0,
      markVisible: 0,
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


    provide("RScrollVirtualFallsListContext", mCtx);

    context.expose(mCtx);

    function getLeft(i) {
      return `calc( ${(100 / props.columns) * i}% - ${(((props.columns - 1) * props.gap) / props.columns) * i
        }px + ${i * props.gap}px )`;
    }


    function layout() {
      if (!scrollController.context.element) return;
      const sTop = scrollController.context.element.scrollTop;
      const offsetTop = scrollController.getOffsetTop(contentHtml);
      let index = Math.floor((sTop - offsetTop) / (props.avgHeight + props.gap)) * props.columns;
      if (index < 0) index = 0;
    }

    return () => {
      layout();
      return (
        <div
          data-length={LIST.value.length}
          ref={(el) => (contentHtml = el)}
          style={{ height: HEIGHT.value + "px" }}
          class="r-scroll-virtual-falls-list"
        >
          {/* <Context keyExtractor={props.keyExtractor}></Context> */}
        </div>
      );
    };
  },
});
