import {Combinations, DiceValue} from './idice';

export interface IResult {
  combination: Combinations,
  total: number;
  result: DiceValue;
}
