import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from "bignumber.js";

@Pipe({
  name: 'cc'
})
export class CcPipe implements PipeTransform {

  transform(value: string, unitRate: string): number {
    return new BigNumber(value).dividedBy(new BigNumber(unitRate)).toNumber()
  }

}
