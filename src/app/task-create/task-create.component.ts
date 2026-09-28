import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-create',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto max-w-xl p-6">
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="mb-4 text-lg font-semibold text-slate-800">Новая задача</h1>
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <input
              formControlName="title"
              placeholder="Название задачи"
              class="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            />
            @if (taskForm.get('title')?.hasError('required') && taskForm.get('title')?.touched) {
              <p class="text-xs text-red-500">Обязательное поле</p>
            }
            @if (taskForm.get('title')?.hasError('minlength') && taskForm.get('title')?.touched) {
              <p class="text-xs text-red-500">Минимум 3 символа</p>
            }
            @if (taskForm.get('title')?.hasError('uniqueTitle') && taskForm.get('title')?.touched) {
              <p class="text-xs text-red-500">Задача с таким названием уже есть</p>
            }
            @if (taskForm.get('title')?.pending) {
              <p class="text-xs text-slate-400">Проверяем название...</p>
            }
          </div>

          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" formControlName="isUrgent" class="h-4 w-4 accent-blue-600" />
            Срочная
          </label>

          <div class="flex gap-2">
            <button
              type="submit"
              [disabled]="taskForm.invalid || taskForm.pending"
              class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Создать
            </button>
            <a
              routerLink="/tasks"
              class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Отмена
            </a>
          </div>
        </form>
      </div>
    </section>
  `,
})
export class TaskCreate {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly taskForm = this.fb.group({
    title: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3), uniqueTitleValidator(this.taskService)],
      asyncValidators: [uniqueTitleAsyncValidator(this.taskService)],
      updateOn: 'blur',
    }),
    isUrgent: [false],
  });

  protected onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }
    const { title, isUrgent } = this.taskForm.value;
    this.taskService.addTask(title ?? '', isUrgent ?? false);
    this.router.navigate(['/tasks']);
  }
}

function uniqueTitleValidator(taskService: TaskService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const title = (control.value as string).trim().toLowerCase();
    const isDuplicate = taskService.tasks().some((task) => task.title.trim().toLowerCase() === title);
    return isDuplicate ? { uniqueTitle: true } : null;
  };
}

function uniqueTitleAsyncValidator(taskService: TaskService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const title = (control.value as string).trim().toLowerCase();
    return of(title).pipe(
      delay(400),
      map((value) => {
        const isDuplicate = taskService.tasks().some((task) => task.title.trim().toLowerCase() === value);
        return isDuplicate ? { uniqueTitle: true } : null;
      }),
    );
  };
}
