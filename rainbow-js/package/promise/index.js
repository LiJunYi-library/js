import { arrayRemove } from "../array";

export function useQueue(props = {}) {
  const options = {
    onBegin: () => undefined,
    onFinish: () => undefined,
    onPush: () => undefined,
    onPushed: () => undefined,
    onRemove: () => undefined,
    onRemoved: () => undefined,
    ...props,
  };

  const queue = [];

  function push(current) {
    if (queue.length === 0) options.onBegin(queue, current);
    options.onPush(queue, current);
    queue.push(current);
    options.onPushed(queue, current);
  }

  function change(current) {
    //
  }

  function remove(current) {
    options.onRemove(queue, current);
    arrayRemove(queue, current);
    options.onRemoved(queue, current);
    if (queue.length === 0) options.onFinish(queue, current);
  }

  return { queue, push, remove, change };
}
