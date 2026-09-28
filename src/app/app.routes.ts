import { Routes } from '@angular/router';
import { TaskList } from './task-list/task-list.component';
import { TaskDetails } from './task-details/task-details.component';
import { TaskCreate } from './task-create/task-create.component';

export const routes: Routes = [
    {path: '', redirectTo: 'tasks', pathMatch: 'full' },
    {path: 'tasks', component: TaskList},
    {path: 'tasks/new', component: TaskCreate},
    {path: 'tasks/:id', component: TaskDetails}
];
