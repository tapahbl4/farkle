import { Component, OnInit } from '@angular/core';
import {ITurn} from '../../interfaces/iturn';
import {Constants} from '../../constants';
import {CalcService} from '../../services/calc.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  round: number;
  ztable: any[];
  currentThrow: number[];
  currentTurn: number;
  turns: ITurn[];

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  next() {
    CalcService.proceed([2, 3, 5, 6, 1, 4]);
    // let turnResult = this.turns[this.currentTurn].next();
  }

  newGame() {
    this.destroyGame();
    this.currentTurn = 1;
    this.generateEmptyZtable();
    for (let i = 1; i <= Constants.TURN_COUNT; i++) {
      // this.turns.push(new Turn(i));
    }
  }

  destroyGame() {
    this.turns = [];
  }

  generateEmptyZtable() {
    this.ztable = [];
    for (let i = Constants.DICE_COUNT; i > 0; i--) {
      this.ztable.push(new Array(i));
    }
  }
}
