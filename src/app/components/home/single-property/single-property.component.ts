import { Component, OnInit } from '@angular/core';
import { PropertyListing } from '../../../models/property.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-property',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './single-property.component.html',
  styleUrl: './single-property.component.css'
})
export class SinglePropertyComponent implements OnInit {
  property: any;
  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');  
    if (propertyId) {
      this.fetchPropertyDetails(propertyId);
    }
  }

  fetchPropertyDetails(id: string): void {
    this.propertyService.getPropertyById(id).subscribe(
      (response) => {
        if (response) {
          console.log(response);
          this.property = response;
        } else {
          this.property = null;
        }
      },
      (error) => {
        console.error('Error fetching property', error);
        this.property = null;
      }
    );
  }
}
