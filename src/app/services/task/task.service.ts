import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { Task } from '../../classes/generated/Task';
import { map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { EntityRecords } from '../../interfaces/entity-records.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../helper/helper.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly _entityName: string = 'task';
  private _showAddTaskDialogSubject$: Subject<boolean> = new Subject();

  showAddTaskDialog$: Observable<boolean> = this._showAddTaskDialogSubject$.asObservable();

  constructor(
    private databaseService: DatabaseService,
    private helperservice: HelperService,
    private formBuilder: FormBuilder
  ) {}

  setShowAddTaskDialog(val: boolean): void {
    this._showAddTaskDialogSubject$.next(val);
  }

  getTasksByProjectId(projectId: string): Observable<Task[]> {
    return this.databaseService.getByIndexValues<Task>(this._entityName, 'projectId', [projectId])
      .pipe(
        map(tasks => tasks.sort(this.helperservice.defaultSort))
      );
  }

  getTaskById(id: string): Observable<Task> {
    return this.databaseService.getById<Task>(this._entityName, id);
  }

  insertTask(task: Task): Observable<Task[]> {
    return new Observable<number>(observable => observable.next(task.sortOrder))
      .pipe(
        switchMap(sortOrder => sortOrder
          ? of(sortOrder) : this.getSortOrderForNewTask(task)
        ),
        map(sortOrder => task.sortOrder = sortOrder),
        map(() => {
          const entityRecords: EntityRecords = {
            entityName: this._entityName,
            records: [task]
          };
          return entityRecords;
        }),
        switchMap(entityRecords => this.databaseService.addRecords<Task>([entityRecords]))
      )
  }

  buildReactiveFormGroup(task?: Task): FormGroup {
    return this.formBuilder.group({
      description: task?.description,
      id: task?.id,
      projectId: [task?.projectId, Validators.required],
      taskGroupId: task?.taskGroupId,
      title: [task?.title, Validators.required]
    });
  }

  private getSortOrderForNewTask(task: Task): Observable<number> {
    const projectId: string = task.projectId;
    const taskGroupId: string = task.taskGroupId;

    return this.getTasksByProjectId(projectId)
      .pipe(
        map(tasks => taskGroupId
          ? tasks.filter(t => t.taskGroupId === taskGroupId) : tasks
        ),
        map(tasks => tasks.reduce((acc, curr) => curr.sortOrder > acc ? curr.sortOrder : acc, 0) + 1)
      );
  }
  
}
