// export function stringUriToObject(str) {
//   if (!stringIsUseful(str)) return {};
//   let queryString = str;
//   if (str.includes("?")) queryString = str.split("?")[1];
//   const params = {};
//   const pairs = queryString.split("&");
//   pairs.forEach((pair) => {
//     if (!pair) return;
//     try {
//       pair = decodeURIComponent(pair);
//     } catch (e) {}
//     try {
//       pair = decodeURIComponent(pair);
//     } catch (e) {}
//     const [key, ...valueParts] = pair.split("=");
//     if (!key) return;
//     const encodedValue = valueParts.length ? valueParts.join("=") : ""; // 处理 value 中含 "="
//     let val = encodedValue;
//     if (val === "null") val = null;
//     if (val === "undefined") val = undefined;
//     try {
//       val = JSON.parse(val);
//     } catch (error) {}
//     params[key] = val;
//   });
//   return params;
// }

// export function stringObjectToUri(object) {
//   if (!object) return "";
//   if (typeof object !== "object") return object;
//   if (!Object.keys(object).length) return "";
//   const parts = [];
//   for (const [key, val] of Object.entries(object)) {
//     if (val === undefined) continue;
//     let value = val;
//     if (typeof val === "object") value = JSON.stringify(val);
//     if (typeof value === "number" && !isFinite(value)) value = null;
//     parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
//   }
//   return parts.join("&");
// }

class RURL extends URL {
  searchs = {};

  constructor(url, base, args = {}) {
    try {
      if (url === undefined) url = window?.location?.href;
    } catch (error) {}
    super(url, base);
    this._syncSearchs();

    this.searchParams.convertSet = (name, value) => {
      const val = JSON.stringify(value);
      this.searchParams.set(name, val);
    };

    this.searchParams.convertAppend = (name, value) => {
      const val = JSON.stringify(value);
      this.searchParams.append(name, val);
    };
  }

  _syncSearchs() {
    const o = {};
    for (const [key, value] of this.searchParams) {
      let val = (() => {
        if (value === "undefined") return undefined;
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      })();
      if (!Object.keys(o).includes(key)) {
        o[key] = val;
      } else {
        o[key] = [o[key], val].flat(Infinity);
      }
    }
    Object.assign(this.searchs, o);
  }
}

let uuu = new RURL();
console.log(uuu);
let newUrl = new RURL("/h5/aaa.html?a=5&b=6&b=8", "https://www.baidu.com", {});
console.log(newUrl.searchParams.convertSet("c", "9"));
console.log(newUrl);
// const aa = stringUriToObject(window.location.href);
// const bb = stringObjectToUri(aa);
// const cc = stringUriToObject(bb);

// console.log("toString", uuu.searchParams.toString());

// const params1 = new URLSearchParams(
//   "?tt=undefined&a=1&b=张三%23section1&c=%5B1%2C2%5D&d=http%3A%2F%2Fwww.baidu.com%3Fdfg%3D123456&e=undefined&f=1,2,3",
// );
// console.log(params1.toString());
// // params1.set("ssss", { 5: 6 });

// for (const [key, value] of params1) {
//   console.log(key, value);
// }
// console.log(bb);
// console.log(cc);
