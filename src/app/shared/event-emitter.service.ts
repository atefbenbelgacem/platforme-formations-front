import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeSideNavToggle = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  onNavBarButtonClick() {
    this.invokeSideNavToggle.emit();
  }
}
