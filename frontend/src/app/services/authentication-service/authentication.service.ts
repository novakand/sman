import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, of } from 'rxjs';
import { User } from '../../model/user.interface';

export interface LoginForm {
  email: string;
  password: string;
};

export const JWT_NAME = 'blog-token';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  public login(loginForm: LoginForm) {

    return this.http.post<any>('/api/users/login', { email: loginForm.email, password: loginForm.password }).pipe(
      map((token: any) => {
        console.log('token' + token.access_token);
        localStorage.setItem(JWT_NAME, token.access_token);
        localStorage.setItem('ROLE', token.user.role);
        return of({ success: this.isAuthenticated(), role: token.user.role });
      })
    )
  }

  logout() {
    localStorage.removeItem(JWT_NAME);
    localStorage.removeItem('ROLE');
  }

  register(user: User) {
    return this.http.post<any>('/api/users', user);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUserId(): Observable<number> {
    return of(localStorage.getItem(JWT_NAME)).pipe(
      switchMap((jwt: string) => of(this.jwtHelper.decodeToken(jwt)).pipe(
        map((jwt: any) => jwt.user.id)
      )
      ));
  }

  getRole(): string {
    return localStorage.getItem('ROLE');
  }

}
