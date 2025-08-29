import { useState, useMemo, useRef, useEffect } from "react";
import { useMFetch } from "../../../fetch";

function App() {
  const ff = useMFetch({
    url: "/serve/page",
    method: "post",
    loading: true,
  });
  console.log("ff", ff.data);
  const div = useRef();

  const [bio, setBio] = useState(null);

  useEffect(() => {
    console.log("useEffect");
  }, [bio]);

  useEffect(() => {
    console.log(div.current);
  }, [ff.data]);

  async function click() {
    ff.nextSend()
      .then((res) => {
        console.log("pList.nextSend  then", res);
      })
      .catch((err) => {
        console.log("pList.nextSend catch", err);
      });
  }

  function close() {
    // console.log(" ff.abort()");
    // ff.abort();
    ff.data = { ...ff.data, list: [...ff.data.list, { label: 8888 }] };
    // ff.data?.list?.push?.({ label: 8888 });
    console.log(" ff.data", ff.data);
  }

  return (
    <div className="App">
      <div> loading:{ff.loading + ""}</div>
      <div> begin:{ff.begin + ""}</div>
      <div> error:{ff.error + ""}</div>
      <div ref={(el) => (div.current = el)}> data:{ff.data?.total}</div>
      {/* <div> errorData:{ff.errorData}</div> */}
      <button onClick={click}>click</button>
      <button onClick={close}>close</button>

      <div>
        {ff.data?.list?.map?.((el) => (
          <div key={el.label}> el:{el.label + ""}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
