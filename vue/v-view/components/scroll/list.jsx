import { defineComponent, renderSlot, renderList, onMounted } from "vue";
import { useLoading } from "@rainbow_ljy/v-hooks";
import { RILoading } from "../icon";

const mProps = {
  skelectonCount: {
    type: Number,
    default: 5,
  },
  showSapce: {
    type: Boolean,
    default: true,
  },
  sapceBothEnds: {
    type: Boolean,
    default: false,
  },
  sapceHeight: {
    type: [Number, String],
    default: 10,
  },
  sapceStyle: [Object],
  sapceClass: String,
  finishedText: {
    type: [Number, String],
    default: "没有更多了",
  },
  loadingText: {
    type: [Number, String],
    default: "正在加载中",
  },
  errorText: {
    type: [Number, String],
    default: "出错了",
  },
  emptySrc: {
    type: [Number, String],
    default: '',
  },
  emptyText: {
    type: [Number, String],
    default: "暂无相关数据，试试其他条件吧",
  },

  accumulationList: {
    type: Boolean,
    default: true,
  },

  listHook: {
    type: Object,
    default: () => ({}),
  },

  list: {
    type: Array,
    default: () => [],
  },

  isUseHook: {
    type: Boolean,
    default: true,
  },

  loadingHook: [Object, Array],
};

export const RScrollList = defineComponent({
  props: mProps,
  setup(props, context) {
    let bottomHtml;
    let isobserver = false;
    const loadHook = useLoading({ ...props, promiseHook: props.listHook });
    const spaceStyle = { height: props.sapceHeight + "px" };

    const observerBottom = new IntersectionObserver(([entries]) => {
      if (entries.isIntersecting && isobserver) {
        context.emit("scrollEnd");
      }
      isobserver = true;
    });

    onMounted(() => {
      observerBottom.observe(bottomHtml);
    });

    function renderLoading(props, context) {
      if (!loadHook.loading) return null;
      if (!props.loadingText) return null;
      return renderSlot(context.slots, "loading", props.listHook, () => [
        <div class={"list-loading"}>
          <RILoading class="r-loadings-icon" />
          <div class={["r-loadings-text"]}>{props.loadingText}</div>
        </div>,
      ]);
    }

    function renderBegin() {
      if (!loadHook.begin) return null;
      return (
        <div class="r-list-begin">
          {renderSlot(context.slots, "begin", props.listHook, () => [
            <div class="r-list-skelectons" style={{ padding: `0 ${props.sapceHorizontal}px` }}>
              {renderList(props.skelectonCount, (item, index) => {
                return [
                  index !== 0 && <div class="r-list-space" style={spaceStyle}></div>,
                  renderSlot(context.slots, "skelecton", { item, index }, () => [
                    <div class="r-list-skelecton"> </div>,
                  ]),
                ];
              })}
            </div>,
          ])}
        </div>
      );
    }

    function renderfinished() {
      if (loadHook.loading) return null;
      if (!props.listHook.finished) return null;
      if (!props.listHook.list || !props.listHook.list.length) return null;
      if (!props.finishedText) return null;
      return renderSlot(context.slots, "finished", props.listHook, () => [
        <div class="list-finished">{props.finishedText}</div>,
      ]);
    }

    function renderEmpty() {
      if (loadHook.loading) return null;
      if (!props.listHook.finished) return null;
      if (props.listHook?.list?.length) return null;
      if (!props.emptyText && !props.emptySrc) return null;
      return renderSlot(context.slots, "empty", props.listHook, () => [
        <div class="list-empty">
          {renderSlot(context.slots, "emptyImg", props.listHook, () => [
            props.emptySrc && <img width={100} fit="contain" src={props.emptySrc} />,
          ])}
          {props.emptyText && <div class={" list-empty-text"}>{props.emptyText}</div>}
        </div>,
      ]);
    }

    function renderError() {
      if (loadHook.loading) return null;
      if (!props.listHook.error) return null;
      return renderSlot(context.slots, "error", props.listHook, () => [
        <div class={"list-error"}>
          <div>{props.errorText}</div>
          <div
            onClick={() => {
              context.emit("errorClick");
            }}
          >
            点击重新加载
          </div>
        </div>,
      ]);
    }

    function renderContent() {
      if (loadHook.begin) return null;
      const listData = props.isUseHook ? props.listHook.list : props.list;
      return renderList(listData || [], (item, index) => {
        return [
          index !== 0 && <div class="r-list-space" style={spaceStyle}></div>,
          renderSlot(context.slots, "default", { item, index }),
        ];
      });
    }

    return (vm) => {
      return (
        <div class="r-scroll-list">
          {renderContent()}
          <div ref={(el) => (bottomHtml = el)} class="r-scroll-list-bottom" />
          {renderError()}
          {renderBegin()}
          {renderLoading(props, context)}
          {renderfinished()}
          {renderEmpty()}
        </div>
      );
    };
  },
});
