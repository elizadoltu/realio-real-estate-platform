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
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ContactComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
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
  searchTerm: string = '';
  private readonly lenis: Lenis | undefined;

  isLoading: boolean = true;

  constructor(private readonly router: Router, private readonly propertyService: PropertyService) {}

  toggleFilters() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  applyFilters() {
    this.currentPage = 1;
    this.fetchProperties();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.fetchProperties();
  }

  performSearch(): void {
    const trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm) {
      this.propertyService.searchClientInquiries(trimmedSearchTerm).subscribe(
        (response: any) => {
          if (response.isSuccess) {
            this.properties = response.data.map((property: any) => ({
              ...property,
              firstImage: this.extractFirstImage(property.imageURLs),
            }));
          } else {
            console.error('Error fetching data:', response.errorMessage);
            this.properties = [];
          }
        },
        (error: any) => {
          console.error('API error:', error);
        }
      );
    } else {
      this.fetchProperties();
    }
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
    this.fetchProperties();
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

  fetchProperties(): void {
    this.propertyService.getPaginatedProperties(this.currentPage, this.pageSize, this.filters).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.properties = response.data.data.map((property: any) => ({
            ...property,
            firstImage: this.extractFirstImage(property.imageURLs),
          }));
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
    if (!imageUrls) return '';
    try {
      const imagesArray = JSON.parse(imageUrls);
      return imagesArray.length > 0 ? `data:image/jpeg;base64,${imagesArray[0].trim()}` : '';
    } catch (error: any) {
      console.error('Error parsing image URLs:', error);
      return '';
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchProperties();
  }

  viewMode: 'grid' | 'list' = 'grid';

  changeView(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  clearFilters() {
    this.filters = {
      Type: '',
      price: 0,
      nrOfBathrooms: 0,
      nrOfBedrooms: 0,
      status: '',
      squareFootage: 0,
      query: '',
    };

    this.searchTerm = '';
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
