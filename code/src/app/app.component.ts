import { Component } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'space-defender';

  constructor(private ngbModalConfig: NgbModalConfig) {
    ngbModalConfig.backdrop = 'static';
  }
}
