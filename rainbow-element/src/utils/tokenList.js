export class CustomDOMTokenList {
  constructor(element, attributeName) {
    this.element = element;
    this.attributeName = attributeName;
    this.tokens = this.parseTokens();
  }

  // 解析当前属性值并初始化 tokens 数组
  parseTokens() {
    const attrValue = this.element.getAttribute(this.attributeName);
    return attrValue ? attrValue.trim().split(/\s+/) : [];
  }

  // 更新属性值
  updateAttribute() {
    this.element.setAttribute(this.attributeName, this.tokens.join(" "));
  }

  // 添加标记
  add(...tokens) {
    tokens.forEach((token) => {
      if (!this.contains(token)) {
        this.tokens.push(token);
      }
    });
    this.updateAttribute();
  }

  // 移除标记
  remove(...tokens) {
    tokens.forEach((token) => {
      const index = this.tokens.indexOf(token);
      if (index !== -1) {
        this.tokens.splice(index, 1);
      }
    });
    this.updateAttribute();
  }

  // 切换标记
  toggle(token, force) {
    const hasToken = this.contains(token);
    if (force === true || (force !== false && !hasToken)) {
      this.add(token);
      return true;
    } else if (force === false || hasToken) {
      this.remove(token);
      return false;
    }
    return hasToken;
  }

  // 检查标记是否存在
  contains(token) {
    return this.tokens.includes(token);
  }

  // 替换标记
  replace(oldToken, newToken) {
    if (this.contains(oldToken)) {
      this.remove(oldToken);
      this.add(newToken);
      return true;
    }
    return false;
  }

  // 获取指定索引处的标记
  item(index) {
    return this.tokens[index];
  }

  // 返回字符串表示形式
  toString() {
    return this.tokens.join(" ");
  }

  // 返回迭代器（可选）
  *[Symbol.iterator]() {
    for (const token of this.tokens) {
      yield token;
    }
  }
}

// 扩展 HTMLElement 原型以支持自定义属性
(function () {
  // HTMLElement.prototype
  // const proto = HTMLElement.prototype;
  // // proto.getAttribute('cssList')
  // Object.defineProperty(proto, "cssList", {
  //   value: new CustomDOMTokenList(this, "cssName"),
  // });

})();
