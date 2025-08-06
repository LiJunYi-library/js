import { arrayRemoves } from "../array";
import { objectClear, objectIncludes } from "../object";

function getSearchValue(value) {
  if (value === "undefined") return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function JSONParse(val) {
  if (val === undefined) return undefined;
  return JSON.parse(val);
}

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
      this.searchs[name] = JSONParse(val);
    };

    this.searchParams.convertAppend = (name, value) => {
      const val = JSON.stringify(value);
      const newV = JSONParse(val);
      this.searchParams.append(name, val);
      if (objectIncludes(this.searchs, name)) {
        this.searchs[name] = [this.searchs[name], newV].flat(Infinity);
      } else {
        this.searchs[name] = newV;
      }
    };

    this.searchParams.convertDelete = (name, value) => {
      const val = JSON.stringify(value);
      this.searchParams.delete(name, val);
      (() => {
        if (!(this.searchs[name] instanceof Array) || value === undefined) {
          delete this.searchs[name];
          return;
        }
        arrayRemoves(this.searchs[name], JSONParse(val));
      })();
    };
  }

  _syncSearchs() {
    const o = {};
    for (const [key, value] of this.searchParams) {
      let val = getSearchValue(value);
      if (!objectIncludes(o, key)) {
        o[key] = val;
      } else {
        o[key] = [o[key], val].flat(Infinity);
      }
    }
    objectClear(this.searchs);
    Object.assign(this.searchs, o);
  }
}

let uuu = new RURL();
console.log(uuu);
let newUrl = new RURL("/h5/aaa.html?a=5&b=6&b=8", "https://www.baidu.com", {
  cc: 9,
  dd: [1, 2, 3],
  ee: { a: 1 },
});
// newUrl.searchParams.convertSet("c", "9");
// newUrl.searchParams.convertSet("d", undefined);
// newUrl.searchParams.convertAppend("d", "11");
// newUrl.searchParams.convertAppend("e", undefined);
// newUrl.searchParams.convertAppend("e", '44');
// newUrl.searchParams.convertAppend("e", 12);
// newUrl.searchParams.convertDelete("e", '44');
console.log();
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
