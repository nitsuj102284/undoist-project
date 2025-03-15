import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../services/project/project.service';
import { Project } from '../../../classes/generated/Project';
import { of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { InlineEditorComponent } from "../../editor/inline-editor/inline-editor.component";
import { ButtonModule } from 'primeng/button';
import { TaskService } from '../../../services/task/task.service';
import { FormGroup } from '@angular/forms';
import { Task } from '../../../classes/generated/Task';
import { HelperService } from '../../../services/helper/helper.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    InlineEditorComponent
],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit, OnDestroy {

  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() save: EventEmitter<void> = new EventEmitter();

  currentProject: Project;
  formGroup: FormGroup;
  unsubscribe: Subject<void> = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private helperService: HelperService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.initCurrentProjectSubscription();
    this.initNewTask();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  initCurrentProjectSubscription(): void {
    this.projectService.currentProject$
      .pipe(
        takeUntil(this.unsubscribe),
        tap(project => {
          this.currentProject = project;
          this.changeDetector.detectChanges();
        })
      )
      .subscribe();
  }

  initNewTask(): void {
    const task: Task = new Task();
    task.projectId = this.currentProject?.id;
    this.formGroup = this.taskService.buildReactiveFormGroup(task);
    this.initFormChangesSubscription();
  }

  initFormChangesSubscription(): void {
    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        tap(() => this.helperService.clearFormControlsWithOnlyHtml(this.formGroup)) //TODO: write custom validator instead?
      )
      .subscribe();
  }

  addTask(): void {
    const task: Task = this.formGroup.value;
    this.taskService.insertTask(task)
      .pipe(
        switchMap(() => {
          if (task.projectId !== this.currentProject?.id) return of(task);
          return this.projectService.refreshTasksForCurrentProject();
        })
      )
      .subscribe(() => {
        this.save.emit();
      });
  }

  onTitleInputEnterKey(): void {
    this.onAdd();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onAdd(): void {
    this.addTask();
  }

}
