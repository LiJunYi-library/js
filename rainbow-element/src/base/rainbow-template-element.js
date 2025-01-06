export class RainbowTemplateElement extends HTMLTemplateElement {
  append(...nodes) {
    console.log("append");
    return super.append(...nodes);
  }

  appendChild(node) {
    console.log("appendChild");
    return super.appendChild(node);
  }

  insertBefore(node, child) {
    console.log("insertBefore");
    return super.insertBefore(node, child);
  }

  removeChild(child) {
    console.log("removeChild");
    return super.removeChild(child);
  }
}

customElements.define("r-template", RainbowTemplateElement);
