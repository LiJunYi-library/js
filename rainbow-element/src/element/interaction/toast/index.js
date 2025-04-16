import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { transition, createElement } from "../../../utils/index.js";
import { useQueue } from "@rainbow_ljy/rainbow-js";

export class RToast extends RainbowElement {
  $$ = (() => {
    return {
      transition: transition({
        node: this,
        dispatchNode: this,
        eventNode: this,
        name: "r-toast",
        hideName: "r-toast-hide",
      }),
      loading: createElement("div", "r-toast-loading loading-icon iconfont", ""),
      content: createElement("div", "r-toast-content", ""),
      queue: useQueue({
        onBegin: () => {
          this.value = true;
          this.$$.transition.show();
        },
        onFinish: () => {
          this.value = false;
          this.$$.transition.hide();
        },
      }),
      textQueue: useQueue({
        onPushed: (queue, current) => {
          this.$$.update(current);
        },
        onRemoved: (queue, current) => {
          const last = queue.at(-1);
          if (last) this.$$.update(last);
          else this.$$.content.innerHTML = "";
        },
      }),
      loadingQueue: useQueue({
        onBegin: () => {
          this.insertBefore(this.$$.loading, this.firstChild);
        },
        onFinish: () => {
          this.$$.loading.remove();
        },
      }),
      update: (props = {}) => {
        const { text } = props;
        const { content } = this.$$;
        content.innerHTML = "";
        if (typeof text === "string") {
          content.innerHTML = text;
        }
        if (typeof text === "object") {
          content._vnode = undefined;
          rainbow.customRender(props.text, content);
        }
      },
    };
  })();

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.cssList.add("r-toast-hide");
    this.append(this.$$.content);
  }

  open(props) {
    if (props) this.$$.queue.push(props);
    if (props?.text !== undefined) this.$$.textQueue.push(props);
    if (props?.loading !== undefined) this.$$.loadingQueue.push(props);
  }

  close(props) {
    if (props) this.$$.queue.remove(props);
    if (props?.text !== undefined) this.$$.textQueue.remove(props);
    if (props?.loading !== undefined) this.$$.loadingQueue.remove(props);
  }

  show(props) {
    const config = { ...props };
    this.open(config);
    setTimeout(() => this.close(config), config.ms || 3000);
  }
}
