import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardComponent } from '../board/board.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'board',
  templateUrl: './menu-modal.component.html'
})
export class MenuModalComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<any>();

  topScore = '0';
  board: BoardComponent;
  form: FormGroup;

  constructor(private activeModal: NgbActiveModal) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      columns: new FormControl(parseInt(localStorage.getItem('columns'), 0) || 5, [
        Validators.required,
        Validators.min(5),
        Validators.max(10)
      ]),
      rows: new FormControl(parseInt(localStorage.getItem('rows'), 0) || 10, [
        Validators.required,
        Validators.min(5),
        Validators.max(10)
      ]),
      speed: new FormControl(parseInt(localStorage.getItem('speed'), 0) || 30, [
        Validators.required,
        Validators.min(10),
        Validators.max(30)
      ])
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {
      localStorage.setItem('columns', values.columns);
      localStorage.setItem('rows', values.rows);
      localStorage.setItem('speed', values.speed);
    });

    if (this.board.score > (parseInt(localStorage.getItem('topScore'), 0) || 0)) {
      localStorage.setItem('topScore', this.board.score.toString());
    }

    this.topScore = localStorage.getItem('topScore') || '0';
  }

  start() {
    this.board.columns = this.form.get('columns').value;
    this.board.rows = this.form.get('rows').value;
    this.board.speed = this.form.get('speed').value;
    this.activeModal.dismiss();
    this.board.start();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
