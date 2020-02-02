import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReusablesModule } from './reusables/reusables.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReusablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
