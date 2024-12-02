import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { PropertyListing } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-all-properties',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './all-properties.component.html',
  styleUrl: './all-properties.component.css'
})

export class AllPropertiesComponent implements OnInit {
  properties: PropertyListing[] = [];
  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit(): void {
    this.propertyService.getProperties().subscribe(
      (properties: PropertyListing[]) => {
        this.properties = properties;
      },
      (error) => {
        console.error('Error getting properties:', error);
      }
    );
  }

  navigateToCreate() {
    this.router.navigate(['property-listings/create-property']);
  }

  navigateToDelete() {
    this.router.navigate(['property-listings/delete-property']);
  }
}
