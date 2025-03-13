import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { TaskGroup } from '../../classes/generated/TaskGroup';
import { map, Observable } from 'rxjs';
import { EntityRecords } from '../../interfaces/entity-records.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskGroupService {

  private readonly _entityName: string = 'taskGroup';

  constructor(
    private databaseService: DatabaseService
  ) {}

  getTaskGroupsByProjectId(projectId: string): Observable<TaskGroup[]> {
    return this.databaseService.getByIndexValues<TaskGroup>(this._entityName, 'projectId', [projectId]);
  }

  insertTaskGroup(taskGroup: TaskGroup): Observable<TaskGroup> {
    const entityRecords: EntityRecords = {
      entityName: this._entityName,
      records: [taskGroup]
    };

    return this.databaseService.addRecords<TaskGroup>([entityRecords])
      .pipe(
        map(taskGroups => taskGroups[0])
      );
  } 

}
