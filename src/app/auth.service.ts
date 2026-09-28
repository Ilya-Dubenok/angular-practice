import { Service } from '@angular/core';

@Service()
export class AuthService {
  public getToken(): string {
    return 'fake-jwt-token';
  }
}
