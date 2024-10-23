import {
  DefineComponent,
  ComponentObjectPropsOptions,
  ComponentPropsOptions,
  ComputedOptions,
  ExtractPropTypes,
  ExtractPublicPropTypes,
  EmitsOptions,
} from "vue";
import { HocOptions } from "../utils";

type Capitalize<S extends string> = intrinsic;

export interface RFoldTextProps {
  text: string;
  maxLine: number;
  isFold: boolean;
  animation: boolean;
}

export type RFoldTextEmits = {
  unfold: () => void;
  fold: () => void;
  click: (event: Event) => void;
};

// type EventHandlers<T extends string[]> = {
//   [K in T[number]]?: (...args: any[]) => any;
// };

// type Events<T extends string[]> = {
//   [K in T[number]]?: (...args: any[]) => any;
// };

// type RevEmits<T extends EmitsOptions> = {
//   [K in keyof T]?: (...args: any[]) => any;
// };

type RevEmits<T extends EmitsOptions> = T extends string[]
  ? { [K in Capitalize<T[number]>]: ((...args: any[]) => any) | null }
  : T;

export type RFoldTextComponent<
  P extends Readonly<ComponentPropsOptions>,
  E extends EmitsOptions,
> = DefineComponent<
  ExtractPublicPropTypes<RFoldTextProps & P>,
  {},
  {},
  any,
  {},
  any,
  any,
  RFoldTextEmits & RevEmits<E>
>;

export declare const RFoldText: RFoldTextComponent<RFoldTextProps, RFoldTextEmits>;

export declare function RFoldTextHoc<P extends Readonly<ComponentPropsOptions>, E extends EmitsOptions>(
  options: HocOptions<P, E>,
): RFoldTextComponent<P, E>;
