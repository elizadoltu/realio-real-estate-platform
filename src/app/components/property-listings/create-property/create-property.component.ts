import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-property.component.html',
  styleUrl: './create-property.component.css'
})
export class CreatePropertyComponent implements OnInit {
  propertyForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private propertyService: PropertyService,
    private router: Router
  ) {
    this.propertyForm = this.formBuilder.group({
      address: ['', Validators.required],
      type: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      squareFootage: [null, [Validators.required, Validators.min(0)]],
      numberOfBedrooms: [null, [Validators.required, Validators.min(0)]],
      numberOfBathrooms: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      status: ['', Validators.required],
      listingDate: ['', Validators.required],
      imageUrls: ['', [Validators.required, Validators.pattern(/^https?:\/\/[^\s]+$/)]],  
      userId: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.propertyForm.controls['imageUrls'].value) {
      console.error('Image URL is required');
      return;
    }
  
    const formData = this.propertyForm.value;
    
    const utcListingDate = new Date(formData.listingDate).toISOString();
  
    formData.listingDate = utcListingDate;
  
    console.log('Form Data Submitted:', formData);
  
    this.propertyService.createProperty(formData).subscribe(
      () => {
        console.log('Property posted successfully!');
        this.router.navigate(['/property-listings/create-property']);
      },
      (error) => {
        console.error('Error posting property:', error);
      }
    );
  }
  
}
