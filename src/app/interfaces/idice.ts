export enum DiceValue {
  NONE = 0, ONE, TWO, THREE, FOUR, FIVE, SIX
}

export enum Combinations {
  NONE, FULL, PAIRS, SET, ONE, FIVE
}

export interface IDice {
  value: DiceValue;
  isActive: boolean;
  isSaved: boolean;
  humanValue: number;
  toggleActive(): boolean;
  toggleSave(): boolean;
  generate(): DiceValue;
}
