import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  sanitizeInput(value: string): string {
    return value.trim();
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isPhoneNumberValid(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  }

  isPasswordValid(password: string): boolean {
    return password.length >= 8;
  }

  onSubmit() {
    this.errorMessage = '';

    this.fullName = this.sanitizeInput(this.fullName);
    this.phoneNumber = this.sanitizeInput(this.phoneNumber);
    this.email = this.sanitizeInput(this.email);
    this.password = this.sanitizeInput(this.password);

    if (!this.fullName || !this.phoneNumber || !this.email || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (!this.isEmailValid(this.email)) {
      this.errorMessage = 'Invalid email address.';
      return;
    }

    if (!this.isPhoneNumberValid(this.phoneNumber)) {
      this.errorMessage = 'Phone number must contain 10 to 15 digits.';
      return;
    }

    if (!this.isPasswordValid(this.password)) {
      this.errorMessage = 'Password must be at least 8 characters long.';
      return;
    }

    const registerData = {
      name: this.fullName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      password: this.password,
    };

    this.authService.register(registerData).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      () => {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToExplore() {
    this.router.navigate(['/explore']);
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
