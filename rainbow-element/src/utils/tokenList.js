import { convertToCamelCase } from "./default.js";

function getTokenArgs(...args) {
  return args
    .filter(Boolean)
    .map((str) => str.trim().split(/\s+/).filter(Boolean))
    .flat(Infinity);
}

class DomTokenList extends Array {
  get value() {
    return this.filter(Boolean).join(" ");
  }

  add(...args) {
    getTokenArgs(...args).forEach((token) => {
      if (!this.includes(token)) this.push(token);
    });
    this?.onValuesChange?.();
  }

  remove(...args) {
    getTokenArgs(...args).forEach((token) => {
      const index = this.indexOf(token);
      if (index !== -1) this.splice(index, 1);
    });
    this?.onValuesChange?.();
  }

  toggle(bool, addToken = "", removeToken = "") {
    if (bool) {
      if (addToken) this.add(addToken);
      if (removeToken) this.remove(removeToken);
    } else {
      if (removeToken) this.add(removeToken);
      if (addToken) this.remove(addToken);
    }
  }

  updated() {
    this?.onValuesChange?.();
  }
}

export function createDomTokenList({ element, attributeName, formatterConnected = () => true }) {
  const tokenList = new DomTokenList(...parseTokens());
  const key = convertToCamelCase(attributeName);

  Object.defineProperties(tokenList, {
    onValuesChange: {
      value: () => {
        if (!formatterConnected()) return;
        try {
          if (tokenList.value) element.setAttribute(attributeName, tokenList.value);
          else element.removeAttribute(attributeName);
        } catch (error) {}
      },
    },
  });

  Object.defineProperties(element, {
    [key]: {
      get() {
        return tokenList.value;
      },
      set(str) {
        tokenList.splice();
        const arr = str.trim().split(/\s+/).filter(Boolean);
        tokenList.add(...arr);
      },
    },
  });

  function parseTokens() {
    const attrValue = element.getAttribute(attributeName);
    return attrValue ? attrValue.trim().split(/\s+/) : [];
  }
  return tokenList;
}
