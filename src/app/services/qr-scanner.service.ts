import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {

  public code$ = new BehaviorSubject('12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq');
  constructor() {

  }
}
