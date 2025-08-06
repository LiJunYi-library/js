import { arrayRemoves } from "../array";
import { objectClear, objectIncludes, objectForIn } from "../object";

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

export class RURL extends URL {
  __searchs = {};

  searchs = new Proxy(this.__searchs, {
    get: (target, key, value, receiver) => {
      return this.__searchs[key];
    },
    set: (target, key, value, receiver) => {
      this.searchParams.convertSet(key, value);
      return Reflect.set(target, key, value, receiver);
    },
    deleteProperty: (target, key) => {
      this.searchParams.convertDelete(key);
      return Reflect.deleteProperty(target, key);
    },
  });

  constructor(url, base, args = {}) {
    try {
      if (url === undefined) url = window?.location?.href;
    } catch (error) {}
    super(url, base);
    objectForIn(args, (item, key) => this.searchParams.set(key, JSON.stringify(item)));

    (() => {
      const o = {};
      for (const [key, value] of this.searchParams) {
        let val = getSearchValue(value);
        if (!objectIncludes(o, key)) {
          o[key] = val;
        } else {
          o[key] = [o[key], val].flat(Infinity);
        }
      }
      objectClear(this.__searchs);
      Object.assign(this.__searchs, o);
    })();

    this.searchParams.convertSet = (name, value) => {
      const val = JSON.stringify(value);
      this.searchParams.set(name, val);
      this.__searchs[name] = JSONParse(val);
    };

    this.searchParams.convertAppend = (name, value) => {
      const val = JSON.stringify(value);
      const newV = JSONParse(val);
      this.searchParams.append(name, val);
      if (objectIncludes(this.__searchs, name)) {
        this.__searchs[name] = [this.__searchs[name], newV].flat(Infinity);
      } else {
        this.__searchs[name] = newV;
      }
    };

    this.searchParams.convertDelete = (name, value) => {
      const val = JSON.stringify(value);
      this.searchParams.delete(name, val);
      (() => {
        if (!(this.__searchs[name] instanceof Array) || value === undefined) {
          delete this.__searchs[name];
          return;
        }
        arrayRemoves(this.__searchs[name], JSONParse(val));
      })();
    };
  }
}

// let uuu = new RURL();
// console.log(uuu);
// let newUrl = new RURL("/h5/aaa.html?a=5&b=6&b=8", "https://www.baidu.com", {
//   cc: 9,
//   dd: [1, "2", 3],
//   ee: { a: "1" },
// });
// newUrl.searchParams.convertSet("c", "c");
// newUrl.searchParams.convertSet("d", "d");
// // newUrl.searchParams.convertAppend("d", "11");
// // newUrl.searchParams.convertAppend("e", undefined);
// // newUrl.searchParams.convertAppend("e", '44');
// // newUrl.searchParams.convertAppend("e", 12);
// // newUrl.searchParams.convertDelete("e", '44');
// newUrl.searchs.dd = Infinity
// newUrl.searchs.ee = 456789;
// console.log();
// console.log(newUrl);
// let newUrl2 = new RURL(newUrl.href);
// console.log(newUrl2);

