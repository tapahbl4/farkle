import {Injectable} from '@angular/core';
import {Combinations, DiceValue, IDice} from '../interfaces/idice';
import {Result} from '../classes/result';

@Injectable({
  providedIn: 'root'
})
export class CalcService {
  static checkFullstack(dices: IDice[], marked: boolean = false): boolean|Result[] {
    if (dices.length == 6) {
      let bad = false;
      dices.map((item, index) => {if (index+1 != item.humanValue) bad = true;});
      if (!bad) {
        if (marked) dices.map((item) => {item.isActive = true;});
        return new Array(new Result(Combinations.FULL, 1500));
      }
    }
    return false;
  }

  static checkPairs(dices: IDice[], marked: boolean = false): boolean|Result[] {
    if (dices.length == 6) {
      let bad = false;
      dices.map((item, index) => {
        if (index % 2 == 1 && dices[index].value != dices[index - 1].value) bad = true;
        else if ((index == 1 || index == 3) && dices[index].value == dices[index + 1].value) bad = true;
      });
      if (!bad) {
        if (marked) dices.map((item) => {item.isActive = true;});
        return new Array(new Result(Combinations.PAIRS, 750));
      }
    }
    return false;
  }

  static checkSets(dices: IDice[], marked: boolean = false): boolean|Result[] {
    let setIndex = 0, multiplier = 0, isSet = false, results = [];
    if (dices.length >= 3) {
      for (let i = 0; i < 4; i++) {
        if (dices[i].value == dices[i + 1].value && dices[i].value == dices[i + 2].value) {
          if ((i > 0 && dices[i].value == dices[i - 1].value)
            || (i > 1 && dices[i].value == dices[i - 2].value)
          ) continue;
          isSet = true;
          if (marked) { for (let j = 0; j < 3; j++) dices[i + j].isActive = true; }
          multiplier = (dices[i].value == DiceValue.ONE ? 10 : dices[i].humanValue);
          setIndex = i;
        }
        if (isSet) {
          results.push(new Result(Combinations.SET, multiplier * 100, dices[i].value));
          isSet = false;
        }
      }
      for (let i = setIndex + 3; results.length == 1 && i < dices.length; i++) {
        if (dices[i].value == dices[setIndex].value) {
          if (marked) dices[i].isActive = true;
          results[0].total += multiplier * 100;
        }
      }
      return results;
    }
    return false;
  }

  static checkOnes(dices: IDice[], marked: boolean = false): boolean|Result[] {
    let results = [], ones = 0;
    dices.map((item) => {
      if (item.value == DiceValue.ONE) {
        ones++;
        if (marked) item.isActive = true;
        results.push(new Result(Combinations.ONE, 100, DiceValue.ONE));
      }
    });
    return results.length > 0 && results.length < 3 ? results : false;
  }

  static checkFives(dices: IDice[], marked: boolean = false): boolean|Result[] {
    let results = [], fives = 0;
    dices.map((item) => {
      if (item.value == DiceValue.FIVE) {
        fives++;
        if (marked) item.isActive = true;
        results.push(new Result(Combinations.FIVE, 50, DiceValue.FIVE));
      }
    });
    return results.length > 0 && results.length < 3 ? results : false;
  }
}
