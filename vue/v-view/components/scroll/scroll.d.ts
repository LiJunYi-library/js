import { DefineComponent } from "vue";

export declare const RScroll: DefineComponent<any>;

export class ScrollController {
  onScroll: void;
  onFlotage: void;
  events: any[];
  scrollAllTop: (top: number) => void;
}

