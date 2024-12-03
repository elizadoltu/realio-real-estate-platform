import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { PropertyListing } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-properties',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './all-properties.component.html',
  styleUrl: './all-properties.component.css'
})

export class AllPropertiesComponent implements OnInit {
  properties: PropertyListing[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 2;
  filters: any = {
    Type: '',
    price: 0,
    nrOfBathrooms: 0,
    nrOfBedrooms: 0,
    status: '',
    squareFootage: 0,
  };

  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit(): void {
    // this.propertyService.getProperties().subscribe(
    //   (properties: PropertyListing[]) => {
    //     this.properties = properties;
    //   },
    //   (error) => {
    //     console.error('Error getting properties:', error);
    //   }
    // );
    this.fetchProperties();
  }

  fetchProperties() {
    this.propertyService
      .getPaginatedProperties(this.currentPage, this.pageSize, this.filters)
      .subscribe(
        (response) => {
          console.log('API Response:', response); 
          if (response.isSuccess) {
            this.properties = response.data.data;
            this.totalPages = Math.ceil(response.data.totalCount / this.pageSize);
          } else {
            console.error('Error in API response:', response.errorMessage);
          }
        },
        (error) => {
          console.error('Error getting properties:', error);
        }
      );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.fetchProperties();
  }

  navigateToCreate() {
    this.router.navigate(['property-listings/create-property']);
  }

  navigateToDelete() {
    this.router.navigate(['property-listings/delete-property']);
  }
  navigateToGetById() {
    this.router.navigate(['property-listings/get-by-id']);
  }  

  navigateToUpdate() {
    this.router.navigate(['property-listings/update-property']);
  }
}
