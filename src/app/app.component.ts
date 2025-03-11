import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavPanelComponent } from './components/nav-panel/nav-panel.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    NavPanelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
