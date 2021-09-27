export enum ISelectInputState {
  default = 'default'
}

export type ISelectInput<
  T extends Record<any, any> = Record<any, any>,
  KeyField extends keyof T = keyof T
> = {
  modelValue?: T[KeyField] | Array<T[KeyField]>;
  placeholder?: string;
  state?: ISelectInputState | Array<ISelectInputState>;
  multiple?: boolean;
  errors?: string[];
  options?: Array<T>;
  valueField?: KeyField;
  displayField?: string;
  allowEmpty?: boolean;
  emptyValue?: any;
  label?: string;
  query?: string;
  isSearchable?: boolean;
  isDisabled?: boolean;
}
