import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        console.error('Сеть недоступна — проверь, что JSON Server запущен на :3000');
      } else if (error.status === 401) {
        router.navigate(['/login']);
      } else if (error.status >= 500) {
        console.error('Серверная ошибка:', error.status, error.message);
      } else if (error.status >= 400) {
        console.error('Ошибка запроса:', error.status, error.message);
      }
      return throwError(() => error);
    }),
  );
};
