import logo from "./logo.svg";
import "./App.css";
import { useState, PureComponent } from "react";
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
import ReactDOM from "react-dom/client";
import { useMemo } from "react";
import { RRVirtualFallsList,RRVirtualGridList } from "./r-view";

const d = arrayLoopMap(50, (value) => ({
  value,
  id: Math.random(),
  title: arrayLoopMap(Math.floor(Math.random() * 50), () => "标题").join(""),
}));

function App() {
  const [count, setcount] = useState(5);
  const [list, setList] = useState(d);

  function changeitem(item, index) {
    item.title = "poiuu";
  }

  function remove(item, index) {
    list.splice(index, 1);
  }

  return (
    <div className="App">
      <r-scroll-view>
        <r-scroll-refresh slot="r-scroll-top"></r-scroll-refresh>

        <RRVirtualFallsList value={list}>
          {({ item, index }) => (
            <div onClick={() => changeitem(item, index)}>
              <div  onClick={() => remove(item, index)}>删除</div>
              <div>{index}</div>
              <div>{item.id}</div>
              <div>{item.title}</div>
            </div>
          )}
        </RRVirtualFallsList>
      </r-scroll-view>
    </div>
  );
}

export default App;
