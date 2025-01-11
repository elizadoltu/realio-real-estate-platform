import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
  editPropertyForm: FormGroup;
  propertyId: string | null = null;
  property: any;
  uploadedPhotos: string[] = []; // Previzualizările imaginilor
  base64Images: string[] = []; // Imaginile codificate pentru backend

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.editPropertyForm = this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      type: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      numberOfBedrooms: ['', [Validators.required, Validators.min(0)]],
      numberOfBathrooms: ['', [Validators.required, Validators.min(0)]],
      squareFootage: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('propertyId');
    console.log('Property ID received:', this.propertyId); // Debugging
    if (this.propertyId) {
      this.loadPropertyDetailsWithImages();
    } else {
      console.error('Property ID is missing.');
    }
  }

  loadPropertyDetailsWithImages(): void {
    if (this.propertyId) {
      this.propertyService.getPropertyById(this.propertyId).subscribe(
        (response) => {
          console.log('Property details response:', response);
          if (response.isSuccess && response.data) {
            this.property = response.data;
            this.populateForm(this.property);
            this.uploadedPhotos = this.extractAndDecodeImages(this.property.imageURLs || '[]');
          } else {
            console.error('Failed to load property details:', response.errorMessage || 'Unknown error');
          }
        },
        (error) => {
          console.error('Error loading property details:', error);
        }
      );
    }
  }

  populateForm(property: any): void {
    this.editPropertyForm.patchValue({
      title: property.title,
      address: property.address,
      type: property.type,
      price: property.price,
      numberOfBedrooms: property.numberOfBedrooms,
      numberOfBathrooms: property.numberOfBathrooms,
      squareFootage: property.squareFootage,
      description: property.description,
    });
  }

  extractAndDecodeImages(imageUrls: string): string[] {
    if (!imageUrls) {
      console.log('No images found for property.');
      return [];
    }

    try {
      const imagesArray = JSON.parse(imageUrls);
      return imagesArray.map((image: string) => `data:image/jpeg;base64,${image.trim()}`);
    } catch (error: any) {
      console.error('Error decoding image URLs:', error);
      return [];
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result.split(',')[1];
          this.uploadedPhotos.push(e.target.result);
          this.base64Images.push(base64String);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onDeletePhoto(photo: string): void {
    const index = this.uploadedPhotos.indexOf(photo);
    if (index > -1) {
      this.uploadedPhotos.splice(index, 1);
      this.base64Images.splice(index, 1);
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
      updatedProperty.imageURLs = JSON.stringify(this.base64Images); // Include imaginile noi
      const userID = this.property?.userID || ''; // Obține userID din detalii proprietate sau fallback
  
      this.propertyService.updateProperty(propertyId, updatedProperty, userID).subscribe(
        () => {
          console.log('Property updated successfully.');
          alert('Property updated successfully.');
        },
        (error) => {
          console.error('Error updating property:', error);
          alert('Failed to update property.');
        }
      );
    } else {
      console.error('Form is invalid. Please check the fields.');
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

  goBack(): void {
    this.location.back();
  }
}
