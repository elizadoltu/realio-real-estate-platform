import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { title } from 'process';

@Component({
  selector: 'app-update-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-property.component.html',
  styleUrls: ['./update-property.component.css']
})
export class UpdatePropertyComponent implements OnInit {
  updateForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private propertyService: PropertyService,
    private router: Router
  ) {
    this.updateForm = this.formBuilder.group({
      propertyId: ['', Validators.required],
      title: ['', Validators.required],
      address: ['', Validators.required],
      type: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      squareFootage: [null, [Validators.required, Validators.min(0)]],
      numberOfBedrooms: [null, [Validators.required, Validators.min(0)]],
      numberOfBathrooms: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      status: ['', Validators.required],
      listingDate: ['', Validators.required],
      userID: ['', Validators.required],
      imageUrls: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onUpdate(): void {
    if (this.updateForm.valid) {
      const formData = this.updateForm.value;
  
      // Extract propertyId from the form data
      const propertyId = formData.propertyId;
  
      // Prepare the property object (excluding propertyId)
      const propertyData = {
        propertyId: propertyId,
        title: formData.title,
        address: formData.address,
        type: formData.type,
        price: formData.price,
        squareFootage: formData.squareFootage,
        numberOfBedrooms: formData.numberOfBedrooms,
        numberOfBathrooms: formData.numberOfBathrooms, // Add this line
        description: formData.description,
        status: formData.status,
        listingDate: new Date(formData.listingDate).toISOString(),
        userID: formData.userID,
        imageUrls: formData.imageUrls
      };
  
      console.log('Updating Property with Data:', propertyId, propertyData);
  
      this.propertyService.updateProperty(propertyId, propertyData).subscribe(
        () => {
          console.log('Property updated successfully!');
          this.router.navigate(['/property-listings']);
        },
        (error) => {
          console.error('Error updating property:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
  
}
