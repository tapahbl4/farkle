import {IDice} from './idice';
import {IResult} from './iresult';

export enum TurnResult {
  NONE, FARKLE, EMPTY_STAGE, FREE_ROLL
}

export interface ITurn {
  score: number;
  totalScore: number;
  isFarkle: boolean;
  isPenalty: boolean;
  turn: number;
  dices: IDice[];
  started: boolean;
  savedStage: number;
  freeRolls: ITurn[];
  freeRollTurn: number;
  isFreeRoll: boolean;
  parent: ITurn;

  next(): TurnResult;
  update(): number;
  proceed(dices: IDice[]): boolean|IResult[];
  availableDices(saved: boolean, stage: number): IDice[];
  generate(): IDice[];
  addFreeRoll(): void;
  getLastFreeRoll(): ITurn;
  getScore(): number;
}
