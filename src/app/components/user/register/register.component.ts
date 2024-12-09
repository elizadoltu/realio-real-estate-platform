import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css', 
})
export class RegisterComponent {
  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Full Name:', this.fullName);
    console.log('Phone Number:', this.phoneNumber);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
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
