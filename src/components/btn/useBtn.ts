import { RouteRecordRaw } from 'vue-router';

export enum IBtnState {
  primary = 'primary',
  danger = 'danger',
  secondary = 'secondary',
  tertiary = 'tertiary',
  quaternary = 'quaternary',
  quinary = 'quinary',
  vertical = 'vertical',
}

export enum IBtnType {
  button = 'button',
  submit = 'submit',
}

export type IBtn = {
  to?: Partial<RouteRecordRaw>;
  label?: string;
  state?: IBtnState | Array<IBtnState>;
  type?: IBtnType;
  prependIcon?: string | boolean;
  appendIcon?: string | boolean;
  isDisabled?: boolean;
}
