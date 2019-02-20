import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public keyword: string;
  public maxDist: number = 5;
  constructor(protected router: Router) {

  }

  ngOnInit() {
  }

  search() {
    this.router.navigateByUrl('/result/' + this.keyword + '/' + this.maxDist);
  }

}
