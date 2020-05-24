import {Inject, Injectable} from '@angular/core';
import {Menu} from "../shared/side-menu/menu";


@Injectable({
  providedIn: 'root'
})
export class MenuTreeService {

  constructor( @Inject('MENU_TREE_DATA') private data: Menu[]) {
  }

  public loadTree(): Menu[] {
    return this.data;
  }

  public getMenuByPath(root: Menu, path: string): Menu {
    if (root.path === path) {
      return root;
    } else if (root.children && root.children.length > 0) {
      for (const child of root.children) {
        const res = this.getMenuByPath(child, path);
        if (res) {
          return res;
        }
      }
    } else {
      return null;
    }
  }
  public filteredTree(menu: Menu, filter: string): Menu[] {
    const retVal: Menu[] = [];
    if (menu.children) {
      for (let i = 0; i < menu.children.length; i++) {
        const child = menu.children[i];
        const pushed = new Menu();
        pushed.id = child.id;
        pushed.name = child.name;
        pushed.path = child.path;
        pushed.url = child.url;
        pushed.level = child.level;
        if (child.name.includes(filter)) {
          pushed.children = child.children;
          retVal.push(pushed);
        } else {
          const childFilterTree = this.filteredTree(child, filter);
          if (childFilterTree.length > 0) {
            pushed.children = childFilterTree;
            retVal.push(pushed);
          }
        }
      }
    }
    return retVal;

  }
}
