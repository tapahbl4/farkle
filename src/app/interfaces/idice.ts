export enum DiceValue {
  NONE = 0, ONE, TWO, THREE, FOUR, FIVE, SIX
}

export interface IDice {
  value: DiceValue;
  isActive: boolean;
  isSaved: boolean;
  setValue(value: DiceValue): IDice;
  toggleActive(): boolean;
  toggleSave(): boolean;
}
