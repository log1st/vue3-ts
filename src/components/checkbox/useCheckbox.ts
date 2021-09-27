export type ICheckboxValue = string | number | boolean;

export enum ICheckboxState {
  default = 'default'
}

export type ICheckbox = {
  modelValue?: ICheckboxValue;
  trueValue?: ICheckboxValue;
  falseValue?: ICheckboxValue;
  state?: ICheckboxState | Array<ICheckboxState>;
  label?: string;
  errors?: string[];
}
