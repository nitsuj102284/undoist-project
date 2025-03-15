import { Component, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavPanelComponent } from './components/nav-panel/nav-panel.component';
import { HeaderComponent } from './components/header/header.component';
import { filter, take, tap } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ProjectService } from './services/project/project.service';
import { AddTaskComponent } from "./components/task/add-task/add-task.component";
import { DialogModule } from 'primeng/dialog';
import { TaskService } from './services/task/task.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    NavPanelComponent,
    AddTaskComponent,
    DialogModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  addTaskDialog: boolean;
  kiosk: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private projectService: ProjectService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {
    this.initRouterEventsSubscription();
    this.initAddTaskDialogSubscription();
    this.setInitialProject();
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

  initAddTaskDialogSubscription(): void {
    this.taskService.showAddTaskDialog$
      .pipe(
        tap(show => this.addTaskDialog = show)
      )
      .subscribe();
  }

  setInitialProject(): void {
    this.projectService.projects$
      .pipe(
        filter(projects => !!projects.length),
        take(1),
      )
      .subscribe(() => this.projectService.setCurrentProject());
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

  onAddTaskDialogSave(): void {
    this.addTaskDialog = false;
  }

  onAddTaskDialogCancel(): void {
    this.addTaskDialog = false;
  }

}
