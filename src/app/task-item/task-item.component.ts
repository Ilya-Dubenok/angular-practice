import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [RouterLink],
  template: `
    <li
      class="relative flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
      [class.bg-green-50]="task().done"
      [class.border-green-300]="task().done"
    >
      <input
        type="checkbox"
        class="relative z-10 h-4 w-4 accent-green-600"
        [checked]="task().done"
        (change)="onTaskToggled(task().id)"
      />
      <a [routerLink]="['/tasks', task().id]" class="absolute inset-0" [attr.aria-label]="task().title"></a>
      <span
        class="flex-1"
        [class.line-through]="task().done"
        [class.text-slate-400]="task().done"
      >
        {{ task().title }}
      </span>
      @if (task().done) {
        <span class="text-xs font-medium text-green-600">Done</span>
      }
    </li>
  `,
})
export class TaskItem {
  task = input.required<Task>();
  taskToggled = output<string>();

  onTaskToggled(id: string): void {
    this.taskToggled.emit(id);
  }
}
