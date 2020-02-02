import { NgModule } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipe/pipes.module';
import { MenuModalComponent } from './menu-modal/menu-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BoardComponent, MenuModalComponent],
  imports: [ReactiveFormsModule, CommonModule, PipesModule, NgbModule],
  exports: [BoardComponent],
  entryComponents: [MenuModalComponent]
})
export class ReusablesModule {}
