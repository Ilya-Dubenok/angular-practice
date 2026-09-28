import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskCount'
})
export class TaskCountPipe implements PipeTransform {

  transform(count: number): string {
    switch (count) {
      case 0:
        return 'Нет задач';
      case 1:
        return '1 задача';
      case 2:
      case 3:
      case 4:
        return `${count} задачи`;
      default:
        return `${count} задач`;
    }
  }

}
