import { ITextInput } from '@/components/textInput/useTextInput';
import { ISelectInput } from '@/components/selectInput/useSelectInput';

export enum ActiveFormFieldType {
  input = 'input',
  select = 'select',
  date = 'date'
}

export type ActiveFormField<T extends Record<any, any>> = {
  key: string | keyof T;
  field: string | keyof T;
  label?: string;
  type: ActiveFormFieldType;
  options?: Record<any, any>;
  defaultValue?: any;
  isVisible?: boolean;
  width?: number;
  isReadonly?: boolean;
  blockedBy?: string[];
} & ({
  type: ActiveFormFieldType.input;
  options?: Partial<ITextInput>;
  defaultValue?: string | number;
} | {
  type: ActiveFormFieldType.select;
  options?: Partial<ISelectInput<any>>;
  onQuery?(payload: {query: string}): Promise<void>;
  defaultValue?: string | number | Array<string | number>;
} | {
  type: ActiveFormFieldType.date;
  options?: Partial<any>;
  defaultValue?: Date | [Date, Date];
})

export type IActiveForm<T extends Record<any, any>> = {
  fields: Array<ActiveFormField<T>>;
}

export type ActiveFormModel<T extends Record<any, any>> = {
  [key in ActiveFormField<T>['key']]: ActiveFormField<T>['defaultValue'] | null;
}
