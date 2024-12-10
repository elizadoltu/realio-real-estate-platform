import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyListing } from '../../../models/property.model';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit {
  properties: PropertyListing[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 16;
  filters: any = {
    Type: '',
    price: 0,
    nrOfBathrooms: 0,
    nrOfBedrooms: 0,
    status: '',
    squareFootage: 0,
  };

  testImages = [
    'assets/testimage-1.jpg',
    'assets/testimage-2.jpg',
    'assets/testimage-3.jpg',
    'assets/testimage-4.jpg',
    'assets/testimage-5.jpg',
    'assets/testimage-6.jpg',
    'assets/testimage-7.jpg',
  ];

  randomImage: string = '';
  isLoading: boolean = true; // To track preloading status

  private apiUrl = 'https://abundant-reflection-production.up.railway.app/api/PropertyListings';

  constructor(private router: Router, private propertyService: PropertyService) {}

  navigateToSearch() {
    this.router.navigate(['/search']);
  }

  navigateToPostProperty() {
    this.router.navigate(['/post-property']);
  }

  navigateToExplore() {
    this.router.navigate(['/explore']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  getRandomImage(): string {
    return this.testImages[Math.floor(Math.random() * this.testImages.length)];
  }

  preloadImages(images: string[]): Promise<void[]> {
    return Promise.all(
      images.map((image) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = image;
          img.onload = () => resolve();
          img.onerror = (err) => reject(err);
        });
      })
    );
  }

  ngOnInit(): void {
    this.preloadImages(this.testImages)
      .then(() => {
        console.log('Images preloaded successfully');
        this.randomImage = this.getRandomImage();
        this.fetchProperties();
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
        this.fetchProperties(); // Continue even if some images fail to preload
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  fetchProperties() {
    this.propertyService
      .getPaginatedProperties(this.currentPage, this.pageSize, this.filters)
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          if (response.isSuccess) {
            this.properties = response.data.data.map((property: PropertyListing) => ({
              ...property,
              imageUrls: this.getRandomImage(),
            }));
            this.totalPages = Math.ceil(response.data.totalCount / this.pageSize);
          } else {
            console.error('Error fetching properties:', response.errorMessage);
          }
        },
        (error) => {
          console.error('Error fetching properties:', error);
        }
      );
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchProperties();
  }
}
