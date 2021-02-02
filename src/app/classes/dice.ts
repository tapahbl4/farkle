import {DiceValue, IDice} from '../interfaces/idice';
import {RandomService} from '../services/random.service';

export class Dice implements IDice {
  isActive: boolean;
  isSaved: boolean;
  value: DiceValue;
  humanValue: number;

  constructor() {
    this.value = this.generate();
    this.isSaved = false;
    this.isActive = false;
  }

  toggleActive(): boolean {
    this.isActive = !this.isActive;
    return this.isActive;
  }

  toggleSave(): boolean {
    this.isSaved = !this.isSaved;
    return this.isSaved;
  }

  generate(): DiceValue {
    this.value = RandomService.getRandomFromEnum(DiceValue);
    this.humanValue = Number(this.value);
    return this.value;
  }
}
