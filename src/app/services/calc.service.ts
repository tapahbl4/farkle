import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalcService {
  constructor() { }

  private static asc(a: number, b: number) { return a - b; }
  private static desc(a: number, b: number) { return b - a; }

  static proceed(dices: number[]): number | boolean {
    dices = dices.sort(this.asc);
    console.log(dices);
    if (dices.length > 0) {
      if (dices.length == 6) {
        let bad = false;
        dices.map((item, index) => {if (index+1 != item) bad = true;});
        if (!bad) return 1500;

        bad = false;
        dices.map((item, index) => {if (index % 2 == 1 && dices[index] != dices[index - 1]) bad = true;});
        if (!bad) return 750;

        // TODO
      }
    } else {
      return false;
    }
  }
}
