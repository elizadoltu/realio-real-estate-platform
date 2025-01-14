import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule, Location, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ContactComponent } from "../contact/contact.component";
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-single-property',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ContactComponent],
  templateUrl: './single-property.component.html',
  styleUrls: ['./single-property.component.css'],
  providers: [DatePipe],
})
export class SinglePropertyComponent implements OnInit {
  property: any;
  userId: string = '';
  userDetails: any;
  private routerSubscription: any;
  decodedImages: string[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly propertyService: PropertyService,
    private readonly userService: UserService,
    private readonly location: Location,
    private readonly datePipe: DatePipe,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
          if (event instanceof NavigationStart) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.propertyService
        .getPropertyById(propertyId)
        .pipe(
          switchMap((response) => {
            if (response && response.propertyId) {
              this.property = response;

              // Decodăm imaginile și le stocăm corect în lista `decodedImages`
              this.decodedImages = this.extractImages(response.imageURLs);
              console.log('Decoded Images:', this.decodedImages);

              this.userId = this.property.userID;
              return this.userService.getUserDetailsById(this.userId);
            } else {
              throw new Error('Property not found');
            }
          })
        )
        .subscribe(
          (userDetails) => {
            this.userDetails = userDetails;
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
    }
  }

  extractImages(imageUrls: string): string[] {
    if (!imageUrls) return [];
    try {
      const imagesArray = JSON.parse(imageUrls); // Parsează șirul JSON în array
      if (!Array.isArray(imagesArray)) {
        console.error('imageURLs is not an array:', imagesArray);
        return [];
      }
      return imagesArray.map((image: string) => `data:image/jpeg;base64,${image.trim()}`);
    } catch (error) {
      console.error('Error parsing image URLs:', error);
      return [];
    }
  }

  goBack(): void {
    this.location.back();
  }

  onBuyAction(): void {
    const apiUrl = 'https://abundant-reflection-production.up.railway.app/api/Transactions';
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      alert('You are not authenticated. Please log in and try again.');
      return;
    }
  
    let buyerId: string;
    try {
      const decodedToken: any = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      buyerId = decodedToken.nameid;
    } catch {
      alert('Authentication token is invalid. Please log in again.');
      return;
    }
  
    const sellerId = this.userId;
    const propertyId = this.property?.propertyId;
    const salePrice = this.property?.price;
  
    if (!propertyId || !salePrice || !sellerId) {
      alert('Unable to process the transaction. Please try again later.');
      return;
    }
  
    // Check if the buyer and seller are the same
    if (buyerId === sellerId) {
      alert('You cannot buy your own property.');
      return;
    }
  
    // Add confirmation prompt
    const confirmation = confirm(
      `Are you sure you want to buy this property for ${salePrice}? This action cannot be undone.`
    );
  
    if (!confirmation) {
      alert('Transaction canceled.');
      return;
    }
  
    const data = { propertyId, buyerId, sellerId, salePrice };
    console.log(data);
  
    this.http
      .post<any>(`${apiUrl}`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((error) => {
          alert('Transaction failed. Please try again.');
          return throwError(() => new Error('Error at POST transaction'));
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Transaction successful:', response);
          alert('Transaction successful!');
        },
        error: (error) => {
          console.error('Error during transaction:', error);
        },
      });
  }  
}
