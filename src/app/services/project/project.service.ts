import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { UserService } from '../user/user.service';
import { BehaviorSubject, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../../classes/generated/User';
import { Project } from '../../classes/generated/Project';
import { EntityRecords } from '../../interfaces/entity-records.interface';
import { HelperService } from '../helper/helper.service';
import { TaskService } from '../task/task.service';
import { TaskGroupService } from '../task-group/task-group.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private _currentProjectSubject$: BehaviorSubject<Project> = new BehaviorSubject(null);
  private _currentUser: User;
  private _defaultProject: Project;
  private readonly _entityName: string = 'project';
  private _projectsSubject$: BehaviorSubject<Project[]> = new BehaviorSubject([]);

  currentProject$: Observable<Project> = this._currentProjectSubject$.asObservable();
  projects$: Observable<Project[]> = this._projectsSubject$.asObservable();

  constructor(
    private databaseService: DatabaseService,
    private helperService: HelperService,
    private taskService: TaskService,
    private taskGroupService: TaskGroupService,
    private userService: UserService
  ) {
    this.init();
  }

  private init(): void {
    this.userService.currentUser$
      .pipe(
        filter(user => !!user),
        tap(user => this._currentUser = user),
        switchMap(() => this.getDefaultProject(true)),
        switchMap(() => this.fetchProjects())
      )
      .subscribe();
  }

  setCurrentProject(project?: Project): void {
    project = project || this._defaultProject;
    this._currentProjectSubject$.next(project);
  }

  getDefaultProject(withTasks?: boolean): Observable<Project> {
    const userId: string = this._currentUser?.id;
    if (!userId) return of(null);

    return this.databaseService.getByIndexValues<Project>(this._entityName, 'default', [userId, true])
      .pipe(
        map(results => results[0]),
        switchMap(project => {
          if (!project) return this.createDefaultProject();
          if (withTasks) return this.getTasksForProject(project);
          return of(project);
        }),
        tap(project => this._defaultProject = project)
      );
  }

  fetchProjects(): Observable<Project[]> {
    const userId: string = this._currentUser?.id;
    if (!userId) return of([]);

    return this.databaseService.getByIndexValues<Project>(this._entityName, 'userId', [userId])
      .pipe(
        tap(projects => {
          projects = projects
            .filter(p => !p.isDefault)
            .sort(this.helperService.defaultSort);
          this._projectsSubject$.next(projects);
        })
      )
  }



  getProjectById(id: string, withTasks?: boolean): Observable<Project> {
    const userId: string = this._currentUser?.id;
    if (!userId) return of(null);

    return this.databaseService.getById<Project>(this._entityName, id)
      .pipe(
        switchMap(project => {
          if (project.userId !== this._currentUser.id) return of(null);
          if (withTasks) return this.getTasksForProject(project);
          return of(project);
        })
      );
  }

  refreshTasksForCurrentProject(): Observable<Project> {
    const currentProject: Project = this._currentProjectSubject$.value;
    if (!currentProject) return of(null);
    
    return this.getTasksForProject(currentProject)
      .pipe(
        tap(project => {
          this._currentProjectSubject$.next(project)
        })
      );
  }

  private getTasksForProject(project: Project): Observable<Project> {
    if (!project) return of(null);

    const projectWithTasks: Observable<Project> = this.taskService.getTasksByProjectId(project.id)
      .pipe(
        map(tasks => {
          project.tasks = tasks;
          return project
        }),
        switchMap(project => this.taskGroupService.getTaskGroupsByProjectId(project.id)),
        map(taskGroups => {
          project.taskGroups = taskGroups;
          return project;
        })
      );

    return projectWithTasks;
  }

  private insertProject(project: Project): Observable<Project[]> {
    const entityRecords: EntityRecords = {
      entityName: this._entityName,
      records: [project]
    };

    return this.databaseService.addRecords<Project>([entityRecords]);
  }

  private createDefaultProject(): Observable<Project> {
    const userId: string = this._currentUser?.id;
    if (!userId) return null;

    const project: Project = new Project();
    project.id = this.helperService.generateUuid();
    project.name = 'Inbox';
    project.userId = userId;
    project.isDefault = true;

    return this.insertProject(project)
      .pipe(
        map(projects => projects[0])
      );
  }


}
