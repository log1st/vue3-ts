/* eslint-disable */
import {DispatchOptions, Payload} from "vuex";

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vuex' {
  export interface Dispatch<T> {
    (type: string, payload?: any, options?: DispatchOptions): Promise<T>;
  }
}
