import {Injectable} from '@angular/core';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {

  }

  transformDateShort(date: Date) {
    let res = null;
    try {
      res = formatDate(date, 'short', 'en-US', '');
    } catch (e) {
      res = 'N/A';
    }
    return res;
  }
}
