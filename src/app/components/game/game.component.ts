import {Component, OnInit, ViewChild} from '@angular/core';
import {ITurn, TurnResult} from '../../interfaces/iturn';
import {Constants} from '../../constants';
import {Turn} from '../../classes/turn';
import {RandomService} from '../../services/random.service';
import {ModalComponent} from '../modal/modal.component';
import {IDice} from '../../interfaces/idice';
import {Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  router: Router;
  viewTable: any[];
  currentTurn: number;
  turns: ITurn[];
  randomData: any[];
  farkleCount: number;
  farkleLabel: boolean;
  farkleMultiplier: number;
  @ViewChild('modal') modal: ModalComponent;

  constructor(router: Router) {
    this.router = router;
  }

  ngOnInit(): void {
    this.newGame();
  }

  next(): void {
    this.generateRandomPositions();
    let result = this.getCurrentTurn().next();
    if (result === TurnResult.FARKLE) {
      this.getCurrentTurn().totalScore = this.getCurrentTurn().score = 0;
      this.farkleLabel = true;
      this.farkleCount++;
      // TODO: Fix farkle penalty
      if (this.farkleCount === 3) {
        this.getCurrentTurn().isPenalty = true;
        this.getCurrentTurn().totalScore = -500 * (++this.farkleMultiplier);
        this.farkleCount = 0;
      }
      if (this.currentTurn + 1 == Constants.TURN_COUNT) {
        this.endGame();
      }
    }
  }

  addToScore(): void {
    if (this.getCurrentTurn().totalScore + this.getCurrentTurn().score < Constants.MIN_TURN_SCORE) return;
    this.getCurrentTurn().totalScore += this.getCurrentTurn().score;
    this.getCurrentTurn().score = 0;
    if (this.currentTurn + 1 == Constants.TURN_COUNT) {
      this.endGame();
    } else this.currentTurn++;
  }

  getScore(): number {
    let total = 0;
    this.turns.filter((item) => { return item.turn <= this.currentTurn; })
      .map((item) => { total += item.getScore(); });
    return total;
  }

  endGame(): void {
    let score = this.getScore();
    this.modal.set(
      score >= Constants.MIN_GAME_SCORE ? 'Victory' : 'Game Over',
      `Your score is ${score} points`,
      true
    );
  }

  updateScore(): void {
    this.getCurrentTurn().update();
    if (this.getCurrentTurn().availableDices(true, 0).length == Constants.DICE_COUNT) {
      this.getCurrentTurn().addFreeRoll();
    }
  }

  newGame(): void {
    this.destroyGame();
    this.currentTurn = this.farkleCount = this.farkleMultiplier = 0;
    this.generateEmptyViewTable();
    for (let i = 0; i < Constants.TURN_COUNT; i++) {
      this.turns.push(new Turn(i));
    }
  }

  destroyGame(): void {
    this.randomData = [];
    this.farkleLabel = false;
    this.currentTurn = this.farkleCount = this.farkleMultiplier = 0;
    this.turns = [];
  }

  generateEmptyViewTable(): void {
    this.viewTable = [];
    for (let i = Constants.DICE_COUNT; i > 0; i--) {
      this.viewTable.push(new Array(i));
    }
  }

  generateRandomPositions(): void {
    this.randomData = [];
    for (let i = 0; i < Constants.DICE_COUNT; i++) {
      this.randomData.push({
        left: RandomService.getRandomInt(0, 15),
        top: RandomService.getRandomInt(0, 15),
        rotate: RandomService.getRandomInt(0, 90)
      });
    }
  }

  farkleAccept(): void {
    this.farkleLabel = false;
    this.currentTurn++;
  }

  toggleDice(dice: IDice, save: boolean): void {
    dice.toggleSave();
    dice.savedStage = save ? this.getCurrentTurn().savedStage : 0;
    this.updateScore();
  }

  getCurrentTurn(): ITurn {
    let turn = this.turns[this.currentTurn];
    return turn.isFreeRoll ? turn.getLastFreeRoll() : turn;
  }
}
