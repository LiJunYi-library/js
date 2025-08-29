import { useState, useMemo, useRef, useEffect } from "react";
import { useListRadio } from "@rainbow_ljy/r-hooks";
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import "./radio.css";

let testList = arrayLoopMap(1000000, (i) => ({ value: i, label: i, i, o: i, p: { i } }));

function App() {
  const listRadio = useListRadio({ list: arrayLoopMap(10, (i) => ({ value: i, label: i })) });
  const [val, setVal] = useState(0);

  // console.log(listRadio);
  async function click(item, index) {
    listRadio.onSelect(item, index);
    console.log(listRadio.value);
    await setVal(listRadio.value);
    console.log(val);
  }

  function push() {
    const s = Date.now();
    testList.push({ value: 111, label: 1111 });
    const e = Date.now();
    console.log(e - s);
  }

  function copy() {
    const s = Date.now();
    testList = [...testList, { value: 111, label: 1111 }];
    const e = Date.now();
    console.log(e - s);
  }

  return (
    <div className="hooks-list-radio">
      <button onClick={push}>push</button>
      <button onClick={copy}>copy</button>
      <div> hooks-list-radio</div>
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
