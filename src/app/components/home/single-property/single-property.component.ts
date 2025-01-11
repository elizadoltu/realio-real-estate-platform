import { Component, OnInit } from '@angular/core';
import { PropertyListing } from '../../../models/property.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule, Location, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ContactComponent } from "../contact/contact.component";
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-single-property',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ContactComponent],
  templateUrl: './single-property.component.html',
  styleUrl: './single-property.component.css',
  providers: [DatePipe]
})
export class SinglePropertyComponent implements OnInit {
  property: any;
  userId: string = '';
  userDetails: any;
  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private userService: UserService,
    private location: Location,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    console.log(propertyId);
    
    if (propertyId) {
      this.propertyService.getPropertyById(propertyId).pipe(
        switchMap((response) => {
          console.log(response); 
  
          if (response && response.propertyId) {
            this.property = response;
            console.log('Property:', this.property);
  
            this.userId = this.property.userID;
            console.log('User ID:', this.userId);
  
            return this.userService.getUserDetailsById(this.userId);
          } else {
            throw new Error('Property not found');
          }
        })
      ).subscribe(
        (userDetails) => {
          this.userDetails = userDetails;
          console.log('User details:', userDetails);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }  

  goBack(): void {
    this.location.back();
  }

  onBuyAction(): void {
    const apiUrl = 'https://abundant-reflection-production.up.railway.app/api/Transactions';
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
  
    if (!token) {
      console.error('No authentication token found');
      alert('You are not authenticated. Please log in and try again.');
      return;
    }
  
    let buyerId: string;
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
      buyerId = decodedToken.nameid;
    } catch (err) {
      console.error('Error decoding token:', err);
      alert('Authentication token is invalid. Please log in again.');
      return;
    }
  
    const sellerId = this.userId;
    const propertyId = this.property?.data?.propertyId;
    const propertyPrice = this.property?.data?.price;
  
    if (!propertyId || !propertyPrice || !sellerId) {
      console.error('Invalid property or user data:', { propertyId, propertyPrice, sellerId });
      alert('Unable to process the transaction. Please try again later.');
      return;
    }
  
    const data = { propertyId, buyerId, sellerId, propertyPrice };
    console.log('Request payload:', data);
  
    this.http.post<any>(`${apiUrl}`, data, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      catchError((error) => {
        console.error('Error at POST transaction:', error);
        alert('Transaction failed. Please try again.');
        return throwError(() => new Error('Error at POST transaction'));
      })
    ).subscribe({
      next: (response) => {
        console.log('Transaction successful:', response);
      },
      error: (error) => {
        console.error('Error during transaction:', error);
      }
    });
  }
  

  // fetchPropertyDetails(id: string): void {
  //   this.propertyService.getPropertyById(id).subscribe(
  //     (response) => {
  //       if (response) {
  //         console.log(response);
  //         this.property = response;
  //         this.userID = this.property.userID;
  //       } else {
  //         this.property = null;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching property', error);
  //       this.property = null;
  //     }
  //   );
  // }

  // fetchUserDetails(): void {
  //   if (this.userID){
  //     this.userService.getUserDetailsById(this.userID).subscribe(
  //       (response) => {
  //         this.userDetails = response;
  //         console.log('User details:', response);
  //       },
  //       (error) => {
  //         console.error('Error fetching user details:', error);
  //       }
  //     )
  //   }
  // }
}
