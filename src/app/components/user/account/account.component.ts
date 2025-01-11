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

  onDelete(): void {
    // First, delete all properties associated with the user
    const deletePropertiesObservables = this.properties.map((property) =>
        this.propertyService.deleteProperty(property.propertyId).toPromise()
    );

    Promise.all(deletePropertiesObservables)
        .then(() => {
            console.log('All properties deleted successfully.');

            // After all properties are deleted, delete the user
            this.userService.deleteUser(this.userDetails.userId).subscribe(
                (response) => {
                    console.log('User deleted successfully:', response);
                    alert('Profile deleted successfully!');
                    localStorage.removeItem('authToken'); // Remove only the authToken
                    this.router.navigate(['/']);
                },
                (error) => {
                    console.error('Error deleting user:', error);
                    alert('Failed to delete profile. Please ensure all fields are correct.');
                }
            );
        })
        .catch((error) => {
            console.error('Error deleting properties:', error);
            alert('Failed to delete properties. Please try again.');
        });
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
          if (response && Array.isArray(response) && response.length > 0) {
            this.properties = response;
            this.mapRandomImagesToProperties(); // Assign random images
            console.log('Properties loaded:', this.properties);
          } else {
            console.error('No properties found or invalid response:', response);
            alert('No properties found.');
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
