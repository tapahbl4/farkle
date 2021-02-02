import {Combinations, IDice} from './idice';
import {IResult} from './iresult';

export interface ITurn {
  score: number;
  isFarkle: boolean;
  turn: number;
  dices: IDice[];

  next(): boolean;
  proceed(dices: IDice[]): boolean|IResult[];
}
