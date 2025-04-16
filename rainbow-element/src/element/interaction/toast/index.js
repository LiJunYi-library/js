import "./index.css";
import { RainbowElement } from "../../base/index.js";
import { transition } from "../../../utils/index.js";

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
    };
  })();

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.cssList.add("r-toast-hide");
  }
}



export function createRToast() {
  // const toast = document.getElement("r-toast");

  // const RToastQueue = useQueue({
  //   onPushed(queue, current) {
  //     update({ ...current, visible: true });
  //   },
  //   onRemoved(queue, current) {
  //     const last = queue.at(-1);
  //     if (last) {
  //       update({ ...last, visible: true });
  //     } else {
  //       update({ ...current, visible: false });
  //     }
  //   },
  // });

  // function update(props = {}) {
  //   node = <RToast {...props}></RToast>;
  //   render(node, div);
  // }

  // function show(props = {}) {
  //   const config = { ...props };
  //   RToastQueue.push(config);
  //   setTimeout(() => {
  //     close(config);
  //   }, config.ms || 3000);
  // }

  // function open(props = {}) {
  //   RToastQueue.push(props);
  // }

  // function close(props = {}) {
  //   RToastQueue.remove(props);
  // }

  // function look() {
  //   console.log(RToastQueue);
  // }

  // return { show, open, close, update, look };
}
