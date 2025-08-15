import "./index.scss";
import { RainbowElement } from "../../base/index.js";
import { createElement, createSlot } from "../../../utils/index.js";

export class RMarquee extends HTMLElement {
  constructor() {
    super();
    // 创建 Shadow DOM
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // 每次连接时重新渲染（可选：也可在 constructor 中做）
    this.render();
  }

  render() {
    // 清空 shadowRoot
    this.shadowRoot.innerHTML = '';

    // 创建两个默认插槽（用于无缝滚动）
    const slot1 = document.createElement('slot');
    const slot2 = document.createElement('slot');

    // 可选：给插槽命名（但默认插槽不需要 name）
    // slot1.name = ''; // 默认插槽
    // slot2.name = '';

    // 将两个插槽放入 shadow root
    this.shadowRoot.appendChild(slot1);
    this.shadowRoot.appendChild(slot2);

    // ✅ 样式建议：用 CSS 控制布局（如横向排列）
    const style = document.createElement('style');
    style.textContent = `
      :host {

      }
      slot {
        /* 默认插槽会显示 light DOM 内容 */
      }
    `;
    this.shadowRoot.appendChild(style);
  }
}
