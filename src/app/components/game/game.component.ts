import {Component, OnInit, ViewChild} from '@angular/core';
import {ITurn, TurnResult} from '../../interfaces/iturn';
import {Constants} from '../../constants';
import {Turn} from '../../classes/turn';
import {RandomService} from '../../services/random.service';
import {ModalComponent} from '../modal/modal.component';
import {IDice} from '../../interfaces/idice';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  viewTable: any[];
  currentTurn: number;
  turns: ITurn[];
  randomData: any[];
  farkleCount: number;
  farkleLabel: boolean;
  farkleMultiplier: number;
  @ViewChild('modal') modal: ModalComponent;

  ngOnInit(): void {
    this.newGame();
  }

  next(): void {
    this.generateRandomPositions();
    let result = this.turns[this.currentTurn].next();
    if (result === TurnResult.FARKLE) {
      this.turns[this.currentTurn].totalScore = this.turns[this.currentTurn].score = 0;
      this.farkleLabel = true;
      this.farkleCount++;
      if (this.farkleCount === 3) {
        this.turns[this.currentTurn].isPenalty = true;
        this.turns[this.currentTurn].totalScore = -500 * (++this.farkleMultiplier);
        this.farkleCount = 0;
      }
      if (this.currentTurn + 1 == Constants.TURN_COUNT) {
        this.endGame();
      }
    }
  }

  addToScore(): void {
    let turn = this.turns[this.currentTurn];
    if (turn.totalScore + turn.score < Constants.MIN_TURN_SCORE) return;
    turn.totalScore += turn.score;
    turn.score = 0;
    if (this.currentTurn + 1 == Constants.TURN_COUNT) {
      this.endGame();
    } else this.currentTurn++;
  }

  getScore(): number {
    let total = 0;
    this.turns.filter((item) => { return item.turn <= this.currentTurn; })
      .map((item) => {
        total += item.totalScore;
        if (item.turn == this.currentTurn) total += item.score;
        // TODO: Add recursive for free rolls
      });
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
    let turn = this.turns[this.currentTurn];
    turn.update();
    if (turn.availableDices(true, 0).length == Constants.DICE_COUNT) {
      console.log('Free roll outside');
      turn.addFreeRoll();
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
    if (save) dice.savedStage = this.turns[this.currentTurn].savedStage;
    else dice.savedStage = 0;
    this.updateScore();
  }
}
