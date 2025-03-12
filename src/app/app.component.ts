import { Component, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavPanelComponent } from './components/nav-panel/nav-panel.component';
import { HeaderComponent } from './components/header/header.component';
import { DatabaseService } from './services/database/database.service';
import { filter, tap } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    NavPanelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  kiosk: boolean;

  constructor(
    private databaseService: DatabaseService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initRouterEventsSubscription();
  }

  initRouterEventsSubscription(): void {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        tap(() => {
          this.setKioskMode();
          this.setBodyClass();
        })
      )
      .subscribe();
  }

  setKioskMode(): void {
    this.kiosk = !!this.route.snapshot.firstChild?.data['kiosk'];
  }

  setBodyClass(): void {
    const body: HTMLElement = this.document.body;
    const classPrefix: string = 'view-'
    const viewClass: string = this.route.snapshot.firstChild?.data['viewClass'];
    const classes: string[] = Array.from(body.classList);

    //remove all view classes
    classes.forEach(className => {
      if (className.startsWith(classPrefix)) {
        this.renderer.removeClass(body, className);
      }
    });

    //add
    if (viewClass) {
      const className: string = `${classPrefix}${viewClass}`;
      this.renderer.addClass(body, className);
    };
  }

}
