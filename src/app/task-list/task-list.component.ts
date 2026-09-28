import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../task.service';
import { TaskCountPipe } from '../taskCount.pipe';
import { TaskItem } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, TaskCountPipe, TaskItem],
  template: `
    <section class="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <h1 class="text-center text-2xl font-semibold text-slate-800">Task Tracker</h1>

      <div class="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-sm text-slate-500">{{ taskService.tasks().length | taskCount }}</p>
        <div class="flex gap-2">
          <button
            [disabled]="!taskService.tasks().some(t => t.done)"
            (click)="taskService.undoneAll()"
            class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            Mark all as undone
          </button>
          <a
            routerLink="/tasks/new"
            class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Новая задача
          </a>
        </div>
      </div>

      <ul class="flex flex-col gap-2">
        @for (task of taskService.tasks(); track task.id) {
          <app-task-item [task]="task" (taskToggled)="taskService.toggleTask($event)" />
        }
      </ul>
    </section>
  `,
})
export class TaskList {
  protected readonly taskService = inject(TaskService);
}
