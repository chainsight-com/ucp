export class TblColumn<T> {
  title: string;
  property?: keyof T;
  width?: number;
  actions?: Array<{ name: string, title: string, more?: boolean }>;
  hidden?: boolean;
  slot?: string;
  detail?: boolean;
  type?: string;
  formatter?: (data: any) => {};
}
