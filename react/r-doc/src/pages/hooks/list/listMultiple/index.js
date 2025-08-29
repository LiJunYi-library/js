import { useState, useMemo, useRef, useEffect } from "react";
import { useListSelect } from "@rainbow_ljy/r-hooks";
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import "./index.css";

function App() {
  const listRadio = useListSelect({
    isMultiple: true,
    list: arrayLoopMap(10, (i) => ({ value: i, label: i })),
  });
  const [val, setVal] = useState(0);

  // console.log(listRadio);
  async function click(item, index) {
    listRadio.onSelect(item, index);
    console.log(listRadio.value);
    setVal(listRadio.value);
    console.log(val);
  }

  function push() {}

  function copy() {}

  return (
    <div className="hooks-list-multiple">
      <button onClick={push}>push</button>
      <button onClick={copy}>copy</button>
      <div> hooks-list-multiple</div>
      <div>
        {listRadio.list.map((el, index) => (
          <div
            className={`${listRadio.same(el, index) && "item-activite"}`}
            onClick={() => click(el, index)}
            key={el.value}
          >
            value {el.value} label {el.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
