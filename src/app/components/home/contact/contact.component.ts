import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})



export class ContactComponent {

  constructor(private readonly router: Router, public authService: AuthService) {}

  navigateToAccount() {
    this.router.navigate(['/account']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToExplore() {
    this.router.navigate(['/explore']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToSearch() {
    this.router.navigate(['/search']);
  }

  navigateToPostProperty() {
    this.router.navigate(['/post-property']);
  }
}
