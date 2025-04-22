import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { transition, createElement, addEventListenerOnce } from "../../../utils/index.js";
import { useQueue } from "@rainbow_ljy/rainbow-js";

export class RMessage extends RainbowElement {
  $$ = (() => {
    return {
      transition: transition({
        node: this,
        dispatchNode: this,
        eventNode: this,
        name: "r-message",
        hideName: "r-message-hide",
      }),
      loading: createElement("div", "r-message-loading loading-icon iconfont", ""),
      content: createElement("div", "r-message-content", ""),
      queue: useQueue({
        onBegin: () => {
          this.value = true;
          document.body.append(this);
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
          if (!last && this.$$.queue.queue.length) this.$$.content.innerHTML = "";
        },
      }),
      loadingQueue: useQueue({
        onBegin: () => {
          this.insertBefore(this.$$.loading, this.firstChild);
        },
        onFinish: () => {
          if (this.$$.queue.queue.length) this.$$.loading.remove();
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
      onAfterEnter: () => {},
      onAfterLeave: () => {
        this.$$.content.innerHTML = "";
        this.$$.loading.remove();
        this.remove();
      },
    };
  })();

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.cssList.add("r-message-hide");
    this.append(this.$$.content);
    addEventListenerOnce(this, "afterEnter", this.$$.onAfterEnter);
    addEventListenerOnce(this, "afterLeave", this.$$.onAfterLeave);
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
