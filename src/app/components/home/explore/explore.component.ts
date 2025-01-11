import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyListing } from '../../../models/property.model';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ContactComponent } from "../contact/contact.component";

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ContactComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit, AfterViewInit, OnDestroy {
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
  isFilterOpen: boolean = false; 
  private readonly lenis: Lenis | undefined;

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
  isLoading: boolean = true; 

  constructor(private readonly router: Router, private readonly propertyService: PropertyService) {}

  toggleFilters() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  applyFilters() {
    this.currentPage = 1; 
    this.fetchProperties();
  }

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
        this.fetchProperties(); 
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      gsap.from('.headline-text', {
        yPercent: 100,
        ease: 'power4.inOut',
        stagger: {
          amount: 0.5,
        },
        duration: 1.5,
      });
  
      gsap.to('.headline', {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        ease: 'power4.inOut',
        stagger: {
          amount: 0.5,
        },
        duration: 1.5,
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.lenis?.destroy();
    gsap.ticker.remove((time) => this.lenis?.raf(time * 1000));
  }

  fetchProperties() {
    this.propertyService
      .getPaginatedProperties(this.currentPage, this.pageSize, this.filters)
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          if (response.isSuccess) {
            this.properties = response.data.data.map((property: PropertyListing) => {
              console.log('Property ID:', property.propertyId);  
              return {
                ...property,
                imageURLs: this.getRandomImage(),
              };
            });
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

  clearFilters() {
    this.filters = {
      Type: '',
      price: 0,
      nrOfBathrooms: 0,
      nrOfBedrooms: 0,
      status: '',
      squareFootage: 0,
    };

    this.currentPage = 1;
    this.fetchProperties();
  }

  navigateToPropertyDetail(propertyId: string | undefined) {
    if (propertyId) {
      this.router.navigate([`/property/${propertyId}`]);
    } else {
      console.error('Property ID is undefined');
    }
  }
  
}
