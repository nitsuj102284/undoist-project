import { Component, OnDestroy } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { Project } from '../../classes/generated/Project';
import { Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-listing',
  imports: [
    CommonModule
  ],
  templateUrl: './project-listing.component.html',
  styleUrl: './project-listing.component.scss'
})
export class ProjectListingComponent implements OnDestroy {

  projects: Project[] = [];
  unsubscribe: Subject<void> = new Subject();

  constructor(
    private projectService: ProjectService
  ) {
    this.initProjectsSubscription();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  initProjectsSubscription(): void {
    this.projectService.projects$
      .pipe(
        takeUntil(this.unsubscribe),
        tap(projects => this.projects = projects
          .filter(p => !p.isDefault)
        ),
      )
      .subscribe();
  }

}
