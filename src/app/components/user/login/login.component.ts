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

  constructor(private router: Router, private authService: AuthService) {}

  email: string = '';
  password: string = '';
  tokenKey: string = 'authToken'; 

  onSubmit(data: { email: string; password: string }) {
    console.log('Entered Email:', data.email);
    console.log('Entered Password:', data.password);

    if (data.email && data.password) {
      this.authService.login(data).subscribe(
        (response: any) => {
          console.log('Login successful', response);
          const token = response.token;
          localStorage.setItem(this.tokenKey, token);
          this.router.navigate(['/account']);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
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