import { SumPipe } from './sum.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [SumPipe],
  exports: [SumPipe]
})
export class PipesModule {}
