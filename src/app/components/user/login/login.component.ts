import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    console.log("Login form submitted");
  
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          console.log('Login response:', response);
  
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('email', this.email);
  
            this.router.navigate(['/']).then(() => {
              console.log('Navigated to home');
            }).catch((error) => {
              console.error('Navigation failed:', error);
            });
          } else {
            this.errorMessage = 'Unexpected error occurred';
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid email or password';
        }
      );
    } else {
      this.errorMessage = 'Please fill in all fields';
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

  scrollToAboutSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
