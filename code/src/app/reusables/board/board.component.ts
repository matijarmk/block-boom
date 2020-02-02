import { MenuModalComponent } from './../menu-modal/menu-modal.component';
import { Component, Input, HostListener, OnInit } from '@angular/core';
import { KeyCode } from './KeyCode.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() boardName: string;
  boardNumbers: Array<Array<number>> = null;

  colors = [
    '',
    'rgb(234, 234, 234)',
    'rgb(220, 172, 63)',
    'rgb(132, 130, 241)',
    'rgb(166, 206, 182)',
    'rgb(196, 243, 166)',
    'rgb(62, 239, 92)',
    'rgb(249, 123, 182)',
    'rgb(207, 249, 41)',
    'rgb(130, 233, 241)',
    'rgb(234, 112, 76)'
  ];

  // inputs

  left = false;
  right = false;
  down = false;

  // level settings
  speed = 20;
  level = 1;
  rows = 5;
  columns = 10;

  score = 0;
  lines = 0;
  tickNumber = 0;
  currentIndex = 2;
  currentRowIndex = 0;
  nitro = false;
  stop = false;

  inputTick = 0;
  randomNumbers = [0, 0, 0];

  // audios
  audios = this.getAudios();

  constructor(private modalService: NgbModal) {}
  ngOnInit(): void {
    const menu = this.modalService.open(MenuModalComponent, { centered: true });
    menu.componentInstance.board = this;

    this.inputs();
    this.getAudios();
  }

  start() {
    this.audios.background.currentTime = 0;
    this.audios.background.play();
    this.stop = false;
    this.boardNumbers = this.generateBoard();
    this.randomNumbers = [this.getRandomNumber(this.colors.length - 1), this.getRandomNumber(this.colors.length - 1)];

    this.interval();
  }

  end() {
    this.stop = true;
    const menu = this.modalService.open(MenuModalComponent, { centered: true });
    menu.componentInstance.board = this;
    this.audios.gameover.currentTime = 0;
    this.audios.gameover.play();
    this.audios.background.pause();
  }

  inputs() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.code === KeyCode.ArrowLeft) {
        this.left = true;
      }
      if (event.code === KeyCode.ArrowRight) {
        this.right = true;
      }
      if (event.code === KeyCode.ArrowDown) {
        this.nitro = true;
      }
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.code === KeyCode.ArrowLeft) {
        this.left = false;
      }
      if (event.code === KeyCode.ArrowRight) {
        this.right = false;
      }
      if (event.code === KeyCode.ArrowDown) {
        this.nitro = false;
      }
    });
  }

  generateBoard() {
    return Array.from(Array(this.rows), () => Array.from(Array(this.columns), () => 0));
  }

  getRandomNumber(max: number) {
    return Math.floor(Math.random() * max) + 1;
  }

  getTopAvailableNumbers() {
    const topColumnNumbers: Array<number> = [];
    for (let index = 0; index < this.boardNumbers[0].length; index++) {
      this.boardNumbers.some(row => {
        if (row[index] !== 0 && row[index] !== 10) {
          // topColumnNumbers.push(this.getRandomNumber(this.colors.length - 1 - row[index]));
          return true;
        }
      });
    }
    return topColumnNumbers;
  }

  setNextRandomNumbers() {
    this.randomNumbers.push(this.getRandomNumber(this.colors.length - 1));
    this.randomNumbers.splice(0, 1);
  }

  tick() {
    this.currentRowIndex = (this.currentRowIndex + 1) % this.boardNumbers.length;
  }

  interval() {
    if (this.tickNumber >= (this.nitro ? 2 : this.speed - this.level)) {
      this.tickNumber = 0;
      this.tick();
    } else {
      this.tickNumber++;
    }

    if (!this.stop) {
      requestAnimationFrame(this.interval.bind(this));
      this.processInput();
      this.algorithm();
    }
  }

  processInput() {
    try {
      if (
        this.left &&
        this.currentIndex - 1 >= 0 &&
        this.boardNumbers[this.currentRowIndex][this.currentIndex - 1] === 0
      ) {
        this.currentIndex--;
        this.left = false;
      }
      if (
        this.right &&
        this.currentIndex + 1 < this.boardNumbers[0].length &&
        this.boardNumbers[this.currentRowIndex][this.currentIndex + 1] === 0
      ) {
        this.currentIndex++;
        this.right = false;
      }
    } catch (e) {}
  }

  algorithm() {
    try {
      const isLast =
        this.currentRowIndex === this.rows - 1 ||
        (this.currentRowIndex < this.rows &&
          this.boardNumbers[this.currentRowIndex + 1][this.currentIndex] + this.randomNumbers[0] >
            this.colors.length - 1);

      const canAddCurrent =
        this.boardNumbers[this.currentRowIndex][this.currentIndex] + this.randomNumbers[0] < this.colors.length;

      if (isLast && canAddCurrent) {
        if (this.boardNumbers[this.currentRowIndex][this.currentIndex] === 0) {
          this.audios.hit.currentTime = 0;
          this.audios.hit.play();
        } else {
          this.audios.tuch.currentTime = 0;
          this.audios.tuch.play();
        }

        this.boardNumbers[this.currentRowIndex][this.currentIndex] =
          this.boardNumbers[this.currentRowIndex][this.currentIndex] + this.randomNumbers[0];
        this.setNextRandomNumbers();
        this.currentRowIndex = -1;
        this.score += this.randomNumbers[0];
      } else if (isLast) {
        this.end();
      }

      const newBoard = this.boardNumbers.filter(
        x => !(x.reduce((a, b) => a + b, 0) === this.columns * (this.colors.length - 1))
      );

      if (newBoard.length < this.boardNumbers.length) {
        this.score += 1000;
        this.speed++;
        this.lines++;
        if (this.lines === 3) {
          this.lines = 0;
          this.level += 1;
        }
        newBoard.unshift(Array.from(Array(this.columns), () => 0));
        this.boardNumbers = newBoard;
        this.audios.line.play();
      }
    } catch (e) {}
  }

  getRemainingColors(num: number) {
    const remainingColors = new Array();
    const percentage = 100 / (this.colors.length - 1 - num);
    let startPercentage = 0;
    let endPercentage = percentage;
    for (let index = 1; index <= this.colors.length - 1 - num; index++) {
      remainingColors.push(`${this.colors[index]} ${startPercentage.toFixed(2)}% ${endPercentage.toFixed(2)}%`);
      startPercentage = startPercentage + percentage;
      endPercentage = endPercentage + percentage;
    }
    const gradient = `linear-gradient(to right, ${remainingColors.join(',')})`;
    return remainingColors.length > 0 ? gradient : null;
  }

  getAudios() {
    const hit = new Audio();
    hit.src = './assets/sounds/hit.mp3';
    hit.volume = 0.5;
    hit.load();

    const tuch = new Audio();
    tuch.src = './assets/sounds/tuch.mp3';
    tuch.volume = 0.5;
    tuch.load();

    const line = new Audio();
    line.src = './assets/sounds/line-remove.mp3';
    line.volume = 0.5;
    line.load();

    const gameover = new Audio();
    gameover.src = './assets/sounds/gameover.mp3';
    gameover.volume = 0.5;
    gameover.load();

    const background = new Audio();
    background.loop = true;
    background.volume = 0.05;
    background.src = './assets/sounds/tetris.mp3';
    background.load();

    return { line: line, hit: hit, tuch: tuch, background: background, gameover: gameover };
  }
}
