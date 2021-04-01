import {WitnessDto} from "@profyu/unblock-ng-sdk/model/witness-dto";
import {Pageable} from "@profyu/unblock-ng-sdk/model/pageable";
import {Sort} from "@profyu/unblock-ng-sdk/model/sort";

export let EMPTY_PAGE: Page<any> = {
  content: [],
  first: true,
  last: true,
  number: 0,
  numberOfElements: 0,
  size: 0,
  totalElements: 1,
  totalPages: 0
};

export interface Page<T> {
  content?: Array<T>;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  totalElements?: string | number;
  totalPages?: number;
}

