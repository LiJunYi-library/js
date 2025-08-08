export function createOverload(overloadCB, verifyObjectType = true) {
  const overloads = {};

  function fun(...arg) {
    const key = arg.reduce((add, el) => {
      let t;
      const type = Object.prototype.toString.call(el);
      t = type.replace(/(\[object )([^\]]*?)(\])/, "$2");
      if (type === "[object Object]" && verifyObjectType) {
        t = el.constructor.name;
      }
      add = add + t;
      return add;
    }, "");
    let res;
    try {
      res = overloads[key].call(this, ...arg);
    } catch (error) {
      console.error("函数重载失败");
      console.error(error);
    }
    return res;
  }

  function addimpl(...params) {
    let [KEY, VOID] = params;
    if (params.length === 1) {
      VOID = KEY;
      KEY = "";
    }
    if (KEY instanceof Array) KEY = KEY.join("");
    overloads[KEY] = VOID;
  }

  overloadCB({ addimpl });

  return fun;
}

// 板栗
// const getUrls = createOverload((overload) => {
//   overload.addimpl("String", (url) => {
//     console.log("String url", url);
//   });

//   overload.addimpl(["String", "Array"], (url, arr) => {
//     console.log("String Array", url, arr);
//   });

//   overload.addimpl("Number", (num) => {
//     console.log("Number num", num);
//   });

//   overload.addimpl(() => {
//     console.log("无参函数");
//   });
// });
// getUrls();
// getUrls(1);
// getUrls("sssssssssssss");
// getUrls("sssssssssssss", []);


export const isFunction = (val) => typeof val === "function";