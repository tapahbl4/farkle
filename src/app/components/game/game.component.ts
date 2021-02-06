import {Component, OnInit} from '@angular/core';
import {ITurn, TurnResult} from '../../interfaces/iturn';
import {Constants} from '../../constants';
import {Turn} from '../../classes/turn';
import {RandomService} from '../../services/random.service';

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
  isShownModal: boolean;

  ngOnInit(): void {
    this.isShownModal = false;
    this.newGame();
  }

  next() {
    this.generateRandomPositions();
    let result = this.turns[this.currentTurn].next();
    console.log(`Turn ${this.currentTurn}`, result);
    if (result === TurnResult.FARKLE) {
      this.farkleLabel = true;
      this.turns[this.currentTurn].totalScore = this.turns[this.currentTurn].score = 0;
      this.farkleCount++;
      // TODO: Add penalty mechanics for farkle
      if (this.farkleCount % 3 === 0) {
        this.turns[this.currentTurn].isPenalty = true;
        this.turns[this.currentTurn].totalScore = -500;
      }
      if (this.currentTurn == Constants.TURN_COUNT) {
        this.endGame();
      }
    }
  }

  getScore(nextTurn: boolean = false): number|void {
    if (nextTurn) {
      let turn = this.turns[this.currentTurn];
      if (turn.totalScore + turn.score < Constants.MIN_TURN_SCORE) return;
      turn.totalScore += turn.score;
      turn.score = 0;
      if (this.currentTurn == Constants.TURN_COUNT) {
        this.endGame();
      } else this.currentTurn++;
      return;
    }
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
    // TODO: Make game over mechanics
    console.log(`Your score: ${this.getScore()}`);
  }

  updateScore(): void {
    let turn = this.turns[this.currentTurn];
    turn.update();
  }

  newGame(): void {
    this.destroyGame();
    this.currentTurn = this.farkleCount = 0;
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

  farkleAccept() {
    this.farkleLabel = false;
    this.currentTurn++;
  }
}
