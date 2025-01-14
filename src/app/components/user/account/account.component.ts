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
  transactions: any[] = [];
  activeSection: 'profile' | 'properties' | 'transactions' = 'profile';
  transactionsWithProperties: any[] = [];
  isLoadingTransactions: boolean = false;
  isLoadingProperties: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly propertyService: PropertyService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.properties = [];
    const token = localStorage.getItem('authToken');
    if (token) {
      this.userService.getUserDetails().subscribe(
        (data: any) => {
          this.userDetails = data;
          console.log(data);

          // Începe încărcarea proprietăților imediat
          this.loadPropertiesWithImages();
          this.loadTransactions(1, 10);
        },
        (error: any) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('No auth token found');
      alert('No authentication token found');
    }
  }

  loadTransactions(page: number, pageSize: number): void {
    this.isLoadingTransactions = true;
  
    const buyerId = this.userDetails.userId;
    if (!buyerId) {
      console.error('Buyer ID is missing');
      this.isLoadingTransactions = false;
      return;
    }
  
    this.propertyService.getTransactionsByBuyerId(buyerId, page, pageSize).subscribe(
      (response: any) => {
        if (response?.data) {
          this.transactions = response.data;
  
          // Extract property IDs and fetch property details concurrently
          const propertyRequests = this.transactions.map((transaction) =>
            this.propertyService.getPropertyById(transaction.propertyId).toPromise().catch((error) => {
              console.error(`Error fetching property with ID ${transaction.propertyId}:`, error);
              return null; // Gracefully handle error by returning `null`
            })
          );
  
          Promise.all(propertyRequests).then(
            (properties: any[]) => {
              this.transactionsWithProperties = this.transactions.map((transaction, index) => {
                const property = properties[index];
                if (property) {
                  const imageKey = property.imageUrls ? 'imageUrls' : 'imageURLs';
                  const images = this.extractAndDecodeImages(property[imageKey]);
  
                  return {
                    ...transaction,
                    property: {
                      ...property,
                      images,
                    },
                  };
                }
  
                // Fallback if property details are missing
                return { ...transaction, property: null };
              });
  
              console.log('Transactions with properties:', this.transactionsWithProperties);
              this.isLoadingTransactions = false;
            },
            (error) => {
              console.error('Error fetching property details:', error);
              this.isLoadingTransactions = false;
            }
          );
        } else {
          console.error('Unexpected response format:', response);
          this.isLoadingTransactions = false;
        }
      },
      (error: any) => {
        console.error('Error fetching transactions:', error);
        this.isLoadingTransactions = false;
      }
    );
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
      (response: any) => {
        console.log('User updated successfully:', response);
        alert('Profile updated successfully!');
      },
      (error: any) => {
        console.error('Error updating user:', error);
        alert('Failed to update profile. Please ensure all fields are correct.');
      }
    );
  }

  onDelete(): void {
    this.userService.deleteUser(this.userDetails.userId).subscribe(
      (response: any) => {
        console.log('User deleted successfully:', response);
        alert('Profile deleted successfully!');
        localStorage.removeItem('authToken'); // Remove only the authToken
        this.router.navigate(['/']);
      },
      (error: any) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete profile. Please ensure all fields are correct.');
      }
    );
  }

  onLogout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  showProperties(): void {
    this.activeSection = 'properties';
    if (this.isLoadingProperties) {
      return; // Loading is already in progress or complete
    }

    if (this.properties.length === 0) {
      this.isLoadingProperties = true; // Show loading only when entering properties and they are not loaded yet
    }
  }

  loadPropertiesWithImages(): void {
    this.isLoadingProperties = true;
    if (this.userDetails.userId) {
      this.propertyService.getPropertiesByUserId(this.userDetails.userId).subscribe(
        (response: any) => {
          console.log('Properties response:', response);
          if (Array.isArray(response)) {
            this.properties = response.map((property: any) => {
              const imageKey = property.imageUrls ? 'imageUrls' : 'imageURLs';
              const images = this.extractAndDecodeImages(property[imageKey]);
              return { ...property, images };
            });
          } else {
            alert('Unexpected response format.');
          }
          this.isLoadingProperties = false;
        },
        (error: any) => {
          alert('An error occurred while fetching properties.');
          this.isLoadingProperties = false;
        }
      );
    } else {
      alert('User ID is missing!');
      this.isLoadingProperties = false;
    }
  }

  extractAndDecodeImages(imageUrls: string): string[] {
    if (!imageUrls) {
      console.log('No images found.');
      return [];
    }

    try {
      const imagesArray = JSON.parse(imageUrls); // Parsează șirul JSON într-un array
      return imagesArray.map((image: string) => `data:image/jpeg;base64,${image.trim()}`);
    } catch (error: any) {
      console.error('Error parsing image URLs:', error);
      return [];
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
