export enum ITextInputState {
  default = 'default'
}

export enum ITextInputType {
  text = 'text',
  number = 'number',
  textarea = 'textarea',
}

export type ITextInput = {
  modelValue?: string;
  placeholder?: string;
  type?: ITextInputType;
  state?: ITextInputState | Array<ITextInputState>;
  errors?: string[];
  label?: string;
  hint?: string;
  isDisabled?: boolean;
}
