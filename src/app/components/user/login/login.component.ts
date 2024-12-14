import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; 

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
  tokenKey: string = 'authToken'; 

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginData).subscribe(
      (response: any) => {
        console.log('Login successful', response);

        // Storing the token and user details in localStorage
        const token = response.token;
        const userDetails = {
          name: response.name,
          email: response.email,
          phoneNumber: response.phoneNumber,
        };

        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem('userDetails', JSON.stringify(userDetails));

        // Navigate to the account page
        this.router.navigate(['/account']);

        // Example of making an authenticated request after login
        this.authService.makeAuthenticatedRequest('/api/protected-endpoint', 'GET').subscribe(
          (data) => {
            console.log('Authenticated request success:', data);
          },
          (error) => {
            console.error('Authenticated request failed:', error);
          }
        );
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }

  // Other navigation methods...
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
