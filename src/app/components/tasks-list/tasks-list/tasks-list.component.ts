import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Project } from '../../../classes/generated/Project';
import { TaskGroup } from '../../../classes/generated/TaskGroup';
import { Task } from '../../../classes/generated/Task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks-list',
  imports: [
    CommonModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent implements OnChanges {

  @Input() project: Project;

  taskGroups: TaskGroup[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project']?.currentValue) this.mapTasks();
  }
  
  mapTasks(): void {
    const project: Project = this.project;
    const tasks: Task[] = project.tasks
    const taskGroups: TaskGroup[] = project.taskGroups
      .sort((a,b) => a.sortOrder - b.sortOrder);

    //add catchall task group
    const defaultTaskGroup: TaskGroup = new TaskGroup();
    defaultTaskGroup.catchAll = true;
    defaultTaskGroup.sortOrder = 0;
    taskGroups.unshift(defaultTaskGroup);

    //map tasks to task groups
    tasks.forEach(t => {
      const taskGroupId: string = t.taskGroupId;

      //add to task group
      if (taskGroupId) {
        const taskGroup: TaskGroup = taskGroups.find(tg => tg.id === taskGroupId);
        taskGroup.tasks = taskGroup.tasks || [];
        taskGroup.tasks.push(t);
        return;
      }

      //no task group, add to default
      defaultTaskGroup.tasks = defaultTaskGroup.tasks || [];
      defaultTaskGroup.tasks.push(t);
    });

    this.taskGroups = taskGroups;
  }

}
