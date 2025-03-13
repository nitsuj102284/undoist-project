import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../classes/generated/Project';
import { TasksListComponent } from "../../../components/tasks-list/tasks-list/tasks-list.component";

@Component({
  selector: 'app-project-view',
  imports: [
    TasksListComponent
  ],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent implements OnInit {

  project: Project;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProject();
  }

  getProject(): void {
    const projectId: string = this.route.snapshot.params['id'];
    if (!projectId) {
      let projectView: string = this.route.snapshot.data['projectView'];
      projectView = typeof projectView  === 'string' ? (projectView).toLowerCase() : projectView;
      
      switch (projectView) {
        case 'default' :
          this.loadDefaultProject();
          break;
      }
      
      return;
    }
  }

  loadDefaultProject(): void {
    this.projectService.getDefaultProject(true)
      .subscribe(project => this.project = project);
  }

}
