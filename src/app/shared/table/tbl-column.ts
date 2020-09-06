import {TblAction} from "./tbl-action";

export class TblColumn<T> {
  title: string;
  property?: keyof T;
  width?: number;
  actions?: Array<TblColumnAction<T>> | ((row: T) => Array<TblColumnAction<T>>);
  hidden?: boolean;
  slot?: string;
  detail?: boolean;
  type?: string;
  formatter?: (data: T) => {};
}
export interface TblColumnAction<T> {
  name: string;
  title: string;
}
