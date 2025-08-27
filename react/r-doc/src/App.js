import "./App.css";
import { useState, useMemo, useRef } from "react";
import ReactDOM from "react-dom/client";
import { fetchHOC } from "@rainbow_ljy/rainbow-js";
import { useEffect } from "react";

export function ref(state) {
  const [, dispatch] = useState(state);
  const cacheRef = useRef(state);
  return useMemo(() => {
    return {
      __v_isRef: true,
      set value(val) {
        cacheRef.current = val;
        dispatch(val);
      },
      get value() {
        return cacheRef.current;
      },
      toRef(value) {
        cacheRef.current = value;
        return {
          __v_isRef: true,
          set value(val) {
            cacheRef.current = val;
            dispatch(val);
          },
          get value() {
            return cacheRef.current;
          },
        };
      },
    };
  }, []);
}

function useMemoRef() {
  const [, dispatch] = useState();
  const cacheRef = useRef();
  return useMemo(() => {
    return {
      get value() {
        return cacheRef.current;
      },
      toRef(value) {
        cacheRef.current = value;
        return {
          __v_isRef: true,
          set value(val) {
            cacheRef.current = val;
            dispatch(val);
          },
          get value() {
            return cacheRef.current;
          },
        };
      },
    };
  }, []);
}

export function useFetchHOC(props = {}) {
  return function (config = {}) {
    const loading = useMemoRef();
    const begin = useMemoRef();
    const error = useMemoRef();
    const data = useMemoRef();
    const errorData = useMemoRef();
    return useMemo(() => {
      const hooks = fetchHOC(props)({
        loadingRef: loading.toRef,
        beginRef: begin.toRef,
        errorRef: error.toRef,
        dataRef: data.toRef,
        errorDataRef: errorData.toRef,
        ...config,
      });
      return hooks;
    }, []);
  };
}

const useMFetch = useFetchHOC({
  interceptResponseSuccess: async (res, data, config) => {
    try {
      if (data instanceof Blob) return data;
      if (data.code !== 200) throw data;
      return data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  headers: {
    "content-type": "application/json",
  },
  time: 30000,
  baseUrl: "http://192.168.192.202:5000",
});

function App() {
  const ff = useMFetch({
    url: "/serve/page",
    method: "post",
    loading: true,
  });

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
    console.log(" ff.abort()");
    ff.abort();
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
    </div>
  );
}

export default App;
