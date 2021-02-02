import {ITurn} from '../interfaces/iturn';
import {DiceValue, IDice} from '../interfaces/idice';
import {Constants} from '../constants';
import {Dice} from './dice';
import {CalcService} from '../services/calc.service';
import {IResult} from '../interfaces/iresult';

export class Turn implements ITurn {
  dices: IDice[];
  isFarkle: boolean;
  score: number;
  turn: number;
  totalScore: number;

  constructor(turn: number) {
    this.score = this.totalScore = 0;
    this.turn = turn;
    this.dices = [];
    for (let i = 0; i < Constants.DICE_COUNT; i++) {
      this.dices.push(new Dice());
    }
  }

  next(): boolean {
    this.generate(); // For dev
    let resultArray = this.proceed(this.availableDices());
    if (resultArray instanceof Array) {
      // @ts-ignore
      resultArray = resultArray.flat();
      let total = 0;
      // @ts-ignore
      resultArray.map((r) => { total += r.total; });
      console.log(`Total: ${total}`, resultArray);
    } else {
      this.isFarkle = true;
    }
    return !this.isFarkle;
  }

  proceed(dices: IDice[]): boolean|IResult[] {
    dices.map((item) => {item.isActive = false;});
    let results = [];
    if (CalcService.checkFullstack(dices)) return CalcService.checkFullstack(dices, true);
    if (CalcService.checkPairs(dices)) return CalcService.checkPairs(dices, true);
    if (CalcService.checkSets(dices)) results.push(CalcService.checkSets(dices, true));
    if (CalcService.checkOnes(dices)) results.push(CalcService.checkOnes(dices, true));
    if (CalcService.checkFives(dices)) results.push(CalcService.checkFives(dices, true));
    return results.length ? results : false;
  }

  availableDices(): IDice[] {
    return this.dices.sort((a: IDice, b: IDice) => { return a.humanValue - b.humanValue; })
      .filter((item: IDice) => { return !item.isSaved; });
  }

  generate(): IDice[] {
    this.dices.map((item) => {item.generate()});
    return this.availableDices();
  }
}
