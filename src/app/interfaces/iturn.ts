import {Combinations, IDice} from './idice';
import {IResult} from './iresult';

export enum TurnResult {
  NONE, FARKLE, EMPTY_STAGE
}

export interface ITurn {
  score: number;
  totalScore: number;
  isFarkle: boolean;
  turn: number;
  dices: IDice[];
  started: boolean;
  results: IResult[];
  prevResults: IResult[];
  savedStage: number;
  freeRolls: ITurn[];

  next(): TurnResult;
  update(): number;
  proceed(dices: IDice[]): boolean|IResult[];
  availableDices(saved: boolean, stage: number): IDice[];
  generate(): IDice[];
}
