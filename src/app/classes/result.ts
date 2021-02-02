import {IResult} from '../interfaces/iresult';
import {Combinations, DiceValue} from '../interfaces/idice';

export class Result implements IResult{
  combination: Combinations;
  total: number;
  result: DiceValue;

  constructor(combination: Combinations = Combinations.NONE, total: number = 0, result: DiceValue = DiceValue.NONE) {
    this.combination = combination;
    this.total = total;
    this.result = result;
  }

}
