import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { Task } from '../../classes/generated/Task';
import { Observable } from 'rxjs';
import { EntityRecords } from '../../interfaces/entity-records.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly _entityName: string = 'task';

  constructor(
    private databaseService: DatabaseService
  ) {}

  getTasksByProjectId(projectId: string): Observable<Task[]> {
    return this.databaseService.getByIndexValues<Task>(this._entityName, 'projectId', [projectId]);
  }

  getTaskById(id: string): Observable<Task> {
    return this.databaseService.getById<Task>(this._entityName, id);
  }

  insertTask(task: Task): Observable<Task[]> {
    const entityRecords: EntityRecords = {
      entityName: this._entityName,
      records: [task]
    }
    return this.databaseService.addRecords<Task>([entityRecords]);
  }
  
}
