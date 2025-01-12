import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export class LoginComponent implements OnDestroy {
  email: string = '';
  password: string = '';
  tokenKey: string = 'authToken';
  private routerSubscription: any;

  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  onSubmit(data: { email: string; password: string }): void {
    if (data.email && data.password) {
      this.authService.login(data).subscribe(
        (response: any) => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('email', data.email);
          localStorage.setItem('password', data.password);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  
  navigateHome() {
    this.router.navigate(['/']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToExplore() {
    this.router.navigate(['/explore']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSearch() {
    this.router.navigate(['/search']);
  }

}