import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { Router, NavigationStart } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  userDetails: any = {
    userId: '',
    name: '',
    email: '',
    phoneNumber: ''
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.userService.getUserDetails().subscribe(
        (data) => {
          this.userDetails = data;
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('No auth token found');
      alert('No authentication token found');
    }
  }

  onSave() {
    const updatedData = {
      name: this.userDetails.name,
      email: this.userDetails.email,
      phoneNumber: this.userDetails.phoneNumber,
    };
  
    console.log('Payload sent to server:', updatedData);
  
    this.authService.updateUser(this.userDetails.userId, updatedData).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update profile. Please ensure all fields are correct.');
      }
    );
  }  

  onLogout() {
    this.userService.logout();
    this.router.navigate(['/']);
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

  logout(): void {
    this.userService.logout();
  }
}
