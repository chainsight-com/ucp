import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {PlatformLocation} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Menu} from "./menu";
import {MenuTreeService} from "../../services/menu-tree.service";

@Component({
  selector: 'pfy-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Input() isCollapsed: boolean;
  _menus: Menu[];
  private _menuRoot: Menu;
  private _filteredMenuRoot: Menu;
  private menus$: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>(null);

  constructor(private platformLocation: PlatformLocation,
              private menuTreeService: MenuTreeService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const menus = this.menuTreeService.loadTree();
    this.menus$.next(menus);
    this.menuRoot = new Menu();
    this.menuRoot.children = menus;
    this.filteredMenuRoot = this.getFilteredMenuRoot(null);


  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get menuRoot(): Menu {
    return this._menuRoot;
  }

  set menuRoot(value: Menu) {
    this._menuRoot = value;
  }


  get filteredMenuRoot(): Menu {
    return this._filteredMenuRoot;
  }

  set filteredMenuRoot(value: Menu) {
    this._filteredMenuRoot = value;
  }

  getFilteredMenuRoot(filter: string): Menu {
    if (filter && filter.length > 0) {
      filter = filter.trim();
      const retVal = new Menu();
      retVal.children = this.menuTreeService.filteredTree(this.menuRoot, filter);
      // console.log(retVal);
      return retVal;
    }
    // console.log(this.menuRoot);
    return this.menuRoot;
  }

  goToPath(path: string) {
    this.router.navigate([path]);
  }

  goToUrl(urlToOpen: string) {
    // console.log('url', urlToOpen);

    let url = '';
    if (!/^http[s]?:\/\//.test(urlToOpen)) {
      url += 'http://';
    }

    url += urlToOpen;
    window.location.href = url;
  }

  notUrl(m: Menu) {
    if (m.url === undefined || m.url === null) {
      return true;
    }
    return false;
  }

  isLeafNode(item) {
    return (item.path || item.url) && item.children.length === 0;
  }

}
