import ReactDOM from "react-dom/client";
import { useMemo } from "react";

export function RRVirtualGridList(props) {
  let fn = (val) => val.item;

  function onRef(el) {
    if (!el) return;
    el.keyExtractor = props.keyExtractor || fn;
  }

  function onRenderList(event) {
    if (!event.ele._reactRoot) event.ele._reactRoot = ReactDOM.createRoot(event.ele);
    event.ele._reactRoot.render(
      <Item
        list={props.value}
        index={event.index}
        item={event.item}
        event={event}
        child={props.children}
      ></Item>,
    );
  }

  return <r-scroll-virtual-grid-list ref={onRef} value={props.value} onrenderList={onRenderList} />;
}

function Item(props) {
  const data = useMemo(() => {
    if (props.item.__isProxy) return props.item;
    props.item.__isProxy = true;
    const proxy = new Proxy(props.item, {
      set: (obj, prop, value) => {
        obj[prop] = value;
        props.event?.target?.$$?.layout?.();
        return true;
      },
    });
    props.list[props.index] = proxy;
    return proxy;
  }, []);

  const args = { ...props.event, data, item: data };

  return <div className="r-scroll-virtual-grid-list-item-content">{props?.child?.(args)}</div>;
}
