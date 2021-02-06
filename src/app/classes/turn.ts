import {ITurn, TurnResult} from '../interfaces/iturn';
import {IDice} from '../interfaces/idice';
import {Constants} from '../constants';
import {Dice} from './dice';
import {CalcService} from '../services/calc.service';
import {IResult} from '../interfaces/iresult';

export class Turn implements ITurn {
  dices: IDice[];
  isFarkle: boolean;
  isPenalty: boolean;
  score: number;
  turn: number;
  totalScore: number;
  started: boolean;
  savedStage: number;
  freeRolls: ITurn[];
  freeRollTurn: number;

  constructor(turn: number) {
    this.turn = turn;
    this.score = this.totalScore = this.savedStage = this.freeRollTurn = 0;
    this.dices = this.freeRolls = [];
    this.started = this.isFarkle = this.isPenalty = false;
    for (let i = 0; i < Constants.DICE_COUNT; i++) {
      this.dices.push(new Dice());
    }
  }

  next(): TurnResult {
    if (!this.started) this.started = true;
    if (this.savedStage > 0 && this.availableDices(true, this.savedStage).length == 0) return TurnResult.EMPTY_STAGE;
    if (!this.isFarkle) this.generate();
    this.savedStage++;
    this.totalScore += this.score;
    this.score = 0;
    let resultArray = this.proceed(this.availableDices());
    console.log(`Turn ${this.turn}`, resultArray);
    if (resultArray instanceof Array) {
      resultArray = resultArray.flat();
      if (resultArray.length > 0) {
        if (this.availableDices(true).length == Constants.DICE_COUNT) {
          // TODO; Make free roll
          return TurnResult.FREE_ROLL;
        }
        return TurnResult.NONE;
      }
    }
    this.isFarkle = true;
    return TurnResult.FARKLE;
  }

  update(): number {
    this.score = 0;
    let resultArray = this.proceed(this.availableDices(true, this.savedStage));
    if (resultArray instanceof Array && resultArray.length > 0) {
      resultArray.flat().map((r) => { this.score += r.total; });
      // TODO: Add free rolls score
    }
    return this.score;
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

  availableDices(saved: boolean = false, stage: number = 0): IDice[] {
    return this.dices.filter((item: IDice) => { return item.isSaved == saved && (stage > 0 ? stage == item.savedStage : true); })
      .sort((a: IDice, b: IDice) => { return a.humanValue - b.humanValue; });
  }

  generate(): IDice[] {
    this.dices.map((item) => { if (!item.isSaved) item.generate()});
    return this.availableDices();
  }
}
