import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication-service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private router: Router, private authService: AuthenticationService) {

  }
  public ngOnInit(): void {
  }

  public navigateTo(value: string): void {
    this.router.navigate(['../', value]);
  }

  public logout(): void {
    this.authService.logout();
    this.navigateTo('login');
  }
}
