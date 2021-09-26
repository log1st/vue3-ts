import { RouteRecordRaw } from 'vue-router';

export enum DataTypeKey {
  instruction = 'instruction',
  pretrial = 'pretrial',
  executive = 'executive',
  judicial = 'judicial',
  paymentOrder = 'payment-order',
  judgment = 'judgment',
  housebook = 'housebook',
}

export type DebtorsDataTypeKey =
  DataTypeKey.pretrial
  | DataTypeKey.judicial
  | DataTypeKey.executive;

export type DataType<T> = {
  key: string & T;
  label: string;
  to: Partial<RouteRecordRaw>;
}
