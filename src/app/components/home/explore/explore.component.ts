import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  imports: [CommonModule, FormsModule, ContactComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit, AfterViewInit, OnDestroy {
  properties: any[] = [];
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

  constructor(
    private readonly router: Router,
    private readonly propertyService: PropertyService
  ) {}

  toggleFilters() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  applyFilters() {
    this.currentPage = 1;
    this.fetchPropertiesWithImages();
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

  ngOnInit(): void {
    this.fetchPropertiesWithImages();
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

  fetchPropertiesWithImages() {
    this.propertyService.getPaginatedProperties(this.currentPage, this.pageSize, this.filters).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.isSuccess) {
          this.properties = response.data.data.map((property: any) => {
            console.log('Property:', property);
            const firstImage = this.extractFirstImage(property.imageURLs);
            return {
              ...property,
              firstImage, // Afișează doar prima imagine
            };
          });
          this.totalPages = Math.ceil(response.data.totalCount / this.pageSize);
        } else {
          console.error('Error fetching properties:', response.errorMessage);
        }
      },
      (error: any) => {
        console.error('Error fetching properties:', error);
      }
    );
  }
  
  extractFirstImage(imageUrls: string): string {
    if (!imageUrls) {
      return '';
    }
  
    try {
      const imagesArray = JSON.parse(imageUrls); // Parsează șirul JSON într-un array
      return imagesArray.length > 0 ? `data:image/jpeg;base64,${imagesArray[0].trim()}` : '';
    } catch (error: any) {
      console.error('Error parsing image URLs:', error);
      return '';
    }
  }  


  goToPage(page: number) {
    this.currentPage = page;
    this.fetchPropertiesWithImages();
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
    this.fetchPropertiesWithImages();
  }

  navigateToPropertyDetail(propertyId: string | undefined) {
    if (propertyId) {
      this.router.navigate([`/property/${propertyId}`]);
    } else {
      console.error('Property ID is undefined');
    }
  }
}
