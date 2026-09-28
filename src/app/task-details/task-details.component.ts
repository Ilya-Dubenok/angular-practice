import { Component, computed, inject, input } from '@angular/core';
import { TaskService } from '../task.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-details',
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-xl p-6">
      @if (!task()) {
        <div
          class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-400 shadow-sm"
        >
          Task not found
        </div>
      } @else {
        <div
          class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-400 shadow-sm"
        >
          {{ task()?.title ?? 'Task not found' }}
        </div>
        <div>{{ task()?.done ? 'Done' : 'Not done' }}</div>
      }
      <a [routerLink]="['/tasks']" class="text-blue-600 hover:underline">Back to tasks</a>
    </section>
  `,
})
export class TaskDetails {
  readonly id = input.required<string>();
  private readonly taskService = inject(TaskService);

  readonly task = computed(() => this.taskService.getTaskById(this.id()));
}
