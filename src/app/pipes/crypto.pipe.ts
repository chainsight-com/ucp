import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';

@Pipe({
  name: 'crypto'
})
export class CryptoPipe implements PipeTransform {

  transform(value: number, from: string, to: string): number {
    if (from === 'satoshi') {
      if (to === 'btc') {
        return new BigNumber(value).multipliedBy('1e-8').toNumber();
      }
    }
    return value;
  }

}
