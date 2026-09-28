import { HttpClient } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Task } from './task.model';

const API_URL = 'http://localhost:3000/tasks';

@Service()
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly _tasks = signal<Task[]>([]);
  public readonly tasks = this._tasks.asReadonly();

  constructor() {
    this.http.get<Task[]>(API_URL).subscribe((tasks) => this._tasks.set(tasks));
  }

  public getTaskById(id: string): Task | undefined {
    return this._tasks().find((task) => task.id === id);
  }

  public toggleTask(id: string): void {
    const task = this.getTaskById(id);
    if (!task) {
      return;
    }
    this.http.patch<Task>(`${API_URL}/${id}`, { done: !task.done }).subscribe((updated) => {
      this._tasks.update((tasks) => tasks.map((t) => (t.id === id ? updated : t)));
    });
  }

  public addTask(newTitle: string, urgent: boolean): void {
    const title = newTitle.trim();
    if (!title) {
      return;
    }
    const newTask = { title, done: false, urgent, createdAt: new Date().toISOString() };
    this.http.post<Task>(API_URL, newTask).subscribe((created) => {
      this._tasks.update((tasks) => [...tasks, created]);
    });
  }

  public undoneAll(): void {
    const doneTasks = this._tasks().filter((task) => task.done);
    if (doneTasks.length === 0) {
      return;
    }
    const requests = doneTasks.map((task) => this.http.patch<Task>(`${API_URL}/${task.id}`, { done: false }));
    forkJoin(requests).subscribe((updatedTasks) => {
      this._tasks.update((tasks) =>
        tasks.map((task) => updatedTasks.find((updated) => updated.id === task.id) ?? task),
      );
    });
  }

  public searchTasks(query: string): Observable<Task[]> {
    return this.http.get<Task[]>(API_URL, { params: { 'title:contains': query } });
  }
}
