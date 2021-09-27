import { RouteRecordRaw } from 'vue-router';

export enum ITabsState {
  sign = 'sign',
}

export type ITab<T extends string = string> = {
  key: T;
  to?: Partial<RouteRecordRaw>;
  exact?: boolean;
  icon?: string;
  disabled?: boolean;
  onClick?(event: MouseEvent): void;
  label: string;
}

export type ITabs<T extends string = string> = {
  state?: ITabsState | Array<ITabsState>;
  tabs: Array<ITab<T>>;
  modelValue?: ITab<T>['key'];
}
