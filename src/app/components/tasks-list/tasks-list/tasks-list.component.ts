import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Project } from '../../../classes/generated/Project';
import { TaskGroup } from '../../../classes/generated/TaskGroup';
import { Task } from '../../../classes/generated/Task';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-tasks-list',
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    ButtonModule,
    MenuModule,
    RadioButtonModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent implements OnInit, OnChanges {

  @Input() project: Project;

  activeTaskGroupTabs: number[] = [];
  defaultTaskGroup: TaskGroup;
  taskGroups: TaskGroup[];
  taskGroupMenuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.initTaskGroupMenuItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project']?.currentValue?.tasks) this.mapTasks();
  }

  initTaskGroupMenuItems(): void {
    this.taskGroupMenuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil'
      },
      {
        label: 'Move to...',
        icon: 'pi pi-arrow-circle-right'
      },
      {
        label: 'Duplicate',
        icon: 'pi pi-clone'
      },
      {
        label: 'Copy link to section',
        icon: 'pi pi-link'
      },
      {
        separator: true
      },
      {
        label: 'Archive',
        icon: 'pi pi-inbox'
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'delete'
      }
    ]
  }
  
  mapTasks(): void {
    const project: Project = this.project;
    const tasks: Task[] = project.tasks
    const taskGroups: TaskGroup[] = project.taskGroups
      .map(tg => {
        tg.tasks = [];
        return tg;
      })
      .sort((a,b) => a.sortOrder - b.sortOrder);

    //add catchall task group
    const defaultTaskGroup: TaskGroup = new TaskGroup();
    defaultTaskGroup.catchAll = true;
    defaultTaskGroup.sortOrder = 0;
    this.defaultTaskGroup = defaultTaskGroup

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

    this.defaultTaskGroup = defaultTaskGroup;
    this.taskGroups = taskGroups;
    this.activeTaskGroupTabs = taskGroups.map((_, i) => i);

  }

}
