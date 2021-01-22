import {DiceValue, IDice} from '../interfaces/idice';

export class Dice implements IDice {
  isActive: boolean;
  isSaved: boolean;
  value: DiceValue;

  constructor(value: DiceValue = DiceValue.NONE) {
    this.value = value;
    this.isSaved = false;
    this.isActive = false;
  }

  setValue(value: DiceValue): IDice {
    this.value = value;
    return this;
  }

  toggleActive(): boolean {
    this.isActive = !this.isActive;
    return this.isActive;
  }

  toggleSave(): boolean {
    this.isSaved = !this.isSaved
    return this.isSaved;
  }
}
