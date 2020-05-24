export class Menu {
  id: string;
  name: string;
  subtitle?: string;
  path?: string;
  url?: string;
  level?: number;
  icon?: string;
  disabled?: boolean;

  private _children?: Menu[];

  public get children(): Menu[] {
    return this._children;
  }

  public set children(children: Menu[]) {
    this._children = children;
  }
}
