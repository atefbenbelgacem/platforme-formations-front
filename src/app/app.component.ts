import { Component } from '@angular/core';
import { ColorSchemeService } from './shared/color-schema.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'platforme-formations-front';

  constructor(private colorSchemeService: ColorSchemeService) {
    // Load Color Scheme
    this.colorSchemeService.load()
  }
}
