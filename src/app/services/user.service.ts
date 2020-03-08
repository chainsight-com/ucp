import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ProjectDto} from '@profyu/unblock-ng-sdk';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  project$ = new BehaviorSubject<ProjectDto>(null);

  constructor() {

  }

}
