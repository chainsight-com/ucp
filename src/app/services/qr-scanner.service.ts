import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {

  public code$ = new BehaviorSubject(null);
  constructor() {

  }
}
