export interface ITurn {
  score: number;
  isFarkle: boolean;
  turn: number;
  available: number;
  rounds: any[];
  throwed: boolean;

  next(): boolean|number[];
}
