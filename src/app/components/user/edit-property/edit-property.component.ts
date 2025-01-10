import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { CommonModule, Location } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
properties: any[] = [];
editPropertyForm: FormGroup;
propertyId: string | null = null;
property: any;
editingProperty: any;

constructor(private fb: FormBuilder, private propertyService: PropertyService, private route: ActivatedRoute, private router: Router, private location: Location,) {
  this.editPropertyForm = this.fb.group({
    title: [''],
    address: [''],
    type: [''],
    price: [''],
    numberOfBedrooms: [''],
    numberOfBathrooms: [''],
    squareFootage: [''],
    description: [''],
  });
}

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('propertyId');
    if (this.propertyId) {
      this.loadPropertyDetails();
    }
  }
  
  loadPropertyDetails(): void {
    if (this.propertyId) {
      this.propertyService.getPropertyById(this.propertyId).subscribe(
        (response) => {
          if (response.isSuccess) {
            this.property = response.data; // Extrage datele din răspuns
            console.log('Property details:', this.property);
            this.editPropertyForm.patchValue({
              title: this.property.title,
              address: this.property.address,
              type: this.property.type,
              price: this.property.price,
              numberOfBedrooms: this.property.numberOfBedrooms,
              numberOfBathrooms: this.property.numberOfBathrooms,
              squareFootage: this.property.squareFootage,
              description: this.property.description,
            });
          } else {
            console.error('Failed to load property details:', response.errorMessage);
          }
        },
        (error) => {
          console.error('Error loading property details:', error);
        }
      );
    }
  }  

  onDeleteProperty(propertyId: string | null): void {
    if (!propertyId) {
      console.error('Property ID is null!');
      alert('Cannot delete property: Property ID is missing.');
      return;
    }
  
    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.deleteProperty(propertyId).subscribe(
        () => {
          console.log('Property deleted successfully');
          alert('Property deleted successfully!');
          this.goBack(); 
        },
        (error) => {
          console.error('Error deleting property:', error);
          alert('Failed to delete property. Please try again.');
        }
      );
    }
  }  

  onSaveProperty(propertyId: string | null): void {
    if (!propertyId) {
      console.error('Property ID is null!');
      alert('Cannot save property: Property ID is missing.');
      return;
    }
  
    if (this.editPropertyForm.valid) {
      const updatedProperty = this.editPropertyForm.value;
      const userId = this.property.userID;
      console.log(userId)
      this.propertyService.updateProperty(propertyId, updatedProperty, userId).subscribe(
        () => {
          console.log('Property updated successfully');
          alert('Property updated successfully!');
          this.router.navigate(["/account"]);
        },
        (error) => {
          console.error('Error updating property:', error);
          alert('Failed to update property.');
        }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }
}
