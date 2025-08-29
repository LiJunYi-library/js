import { useEffect } from "react";
import { useListLoad } from "@rainbow_ljy/r-hooks";
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import { useMFetch } from "../../../../fetch";
import "./index.css";

function App() {
  const ff = useMFetch({
    url: "/serve/page",
    method: "post",
    loading: true,
  });
  const listload = useListLoad({
    asyncHook: ff,
    list: arrayLoopMap(10, (i) => ({ value: i, label: i })),
  });

  async function click(item, index) {}

  function push() {
    listload.continueAwaitSend();
  }

  function copy() {
    listload.afreshNextBeginSend();
  }

  useEffect(() => {
    listload.afreshNextBeginSend();
  }, []);

  return (
    <div className="hooks-list-load">
      <div className="hooks-list-load-header">
        <button onClick={push}>push</button>
        <button onClick={copy}>copy</button>
      </div>

      <div> hooks-list-load </div>

      <div>
        {listload.list.map((el, index) => (
          <div onClick={() => click(el, index)} key={el.value} className="list-item">
            value {el.value} label {el.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
