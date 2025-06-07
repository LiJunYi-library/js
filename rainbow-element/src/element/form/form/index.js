import "./index.css";
import { RainbowElement } from "../../base/index.js";
import {
  findParentByLocalName,
  createCustomEvent,
  createElement,
  createSlot,
  resizeObserver,
  getBoundingClientRect,
} from "../../../utils/index.js";

export class RForm extends RainbowElement {
  $$ = {
  };

  constructor(...arg) {
    super(...arg);
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
  }

  disconnectedCallback(...arg) {
    super.disconnectedCallback(...arg);
  }
}
