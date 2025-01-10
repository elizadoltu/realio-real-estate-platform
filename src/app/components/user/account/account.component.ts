import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
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

  properties: any[] = [];
  activeSection: 'profile' | 'properties' = 'profile';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private propertyService: PropertyService,
    public router: Router
  ) {}

  testImages = [
    'assets/testimage-1.jpg',
    'assets/testimage-2.jpg',
    'assets/testimage-3.jpg',
    'assets/testimage-4.jpg',
    'assets/testimage-5.jpg',
    'assets/testimage-6.jpg',
    'assets/testimage-7.jpg',
  ];

  getRandomImage(): string {
    return this.testImages[Math.floor(Math.random() * this.testImages.length)];
  }

  mapRandomImagesToProperties(): void {
    this.properties = this.properties.map(property => ({
      ...property,
      randomImage: this.getRandomImage(),
    }));
  }  

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.userService.getUserDetails().subscribe(
        (data) => {
          this.userDetails = data;
          console.log(data);
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

  onSave(): void {
    const updatedData = {
      userId: this.userDetails.userId,
      name: this.userDetails.name,
      email: this.userDetails.email,
      phoneNumber: this.userDetails.phoneNumber,
    };
    console.log(updatedData);
  
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

  onLogout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  showProperties(): void {
    this.activeSection = 'properties';
    this.loadProperties();
  }

  loadProperties(): void {
    console.log('Loading properties for user ID:', this.userDetails.userId);
    if (this.userDetails.userId) {
      this.propertyService.getPropertiesByUserId(this.userDetails.userId).subscribe(
        (response) => {
          if (response.isSuccess) {
            this.properties = response.data;
            this.mapRandomImagesToProperties(); // Assign random images
            console.log('Properties loaded:', this.properties);
          } else {
            console.error('Failed to load properties:', response.errorMessage);
            alert('Failed to load properties: ' + response.errorMessage);
          }
        },
        (error) => {
          console.error('Error fetching properties:', error);
          alert('An error occurred while fetching properties.');
        }
      );
    } else {
      console.error('User ID is missing!');
    }
  }  

  onEditProperty(propertyId: string): void {
    console.log('Property ID received:', propertyId); // Debug
    this.router.navigate([`/edit-property/${propertyId}`]);
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
}
