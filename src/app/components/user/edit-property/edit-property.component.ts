import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

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
    private readonly fb: FormBuilder,
    private readonly propertyService: PropertyService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly router: Router
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
      imageURLs: [''],
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
                // Elimină verificarea isSuccess/data dacă răspunsul este direct obiectul dorit
                if (response) {
                    this.property = response;
                    this.populateForm(this.property);
                    this.uploadedPhotos = this.extractAndDecodeImages(this.property.imageURLs || '[]');
                } else {
                    console.error('Failed to load property details: Invalid API response');
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
      imageURLs: JSON.parse(property.imageURLs || '[]')
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
          const img = new Image();
          img.onload = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;
  
            // Maintain the aspect ratio
            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
              if (width > height) {
                height = (MAX_HEIGHT / width) * height;
                width = MAX_WIDTH;
              } else {
                width = (MAX_WIDTH / height) * width;
                height = MAX_HEIGHT;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
  
            // Draw the resized image onto the canvas
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
            }
  
            // Convert the canvas to a Base64 string
            const resizedBase64 = canvas.toDataURL('image/jpeg', 1); // Adjust quality (0.8 = 80%)
            
            this.uploadedPhotos.push(resizedBase64); // Preview
            const base64String = resizedBase64.split(',')[1];
            this.base64Images.push(base64String); // Prepare for backend
          };
  
          // Set the image source to the uploaded file
          img.src = e.target.result;
        };
  
        reader.readAsDataURL(file);
      });
    }
  }

  onDeletePhoto(photo: string): void {
    // Remove photo from uploadedPhotos
    const uploadedPhotoIndex = this.uploadedPhotos.findIndex((uploadedPhoto) => uploadedPhoto === photo);
    if (uploadedPhotoIndex > -1) {
      this.uploadedPhotos.splice(uploadedPhotoIndex, 1);
      this.base64Images.splice(uploadedPhotoIndex, 1); // Synchronize base64Images
      console.log('Photo deleted from uploadedPhotos:', photo);
    } else if (this.property?.imageURLs) {
      // Remove from existing backend images
      let existingImages = JSON.parse(this.property.imageURLs);
      existingImages = existingImages.filter((existingPhoto: string) => existingPhoto !== photo);
      this.property.imageURLs = JSON.stringify(existingImages);
      this.editPropertyForm.patchValue({ imageURLs: existingImages });
      console.log('Photo deleted from existingImages:', photo);
    } else {
      console.warn('No matching photo found to delete.');
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
  
      // Combine only the non-deleted images
      const existingImages = JSON.parse(this.property?.imageURLs || '[]');
      const mergedImages = [...existingImages, ...this.base64Images];
  
      // Remove duplicates and ensure deleted images are excluded
      const uniqueImages = mergedImages.filter((image) =>
        this.uploadedPhotos.includes(`data:image/jpeg;base64,${image}`)
      );
  
      updatedProperty.imageURLs = JSON.stringify(uniqueImages);
  
      const userID = this.property?.userID || '';
  
      this.propertyService.updateProperty(propertyId, updatedProperty, userID).subscribe(
        () => {
          console.log('Property updated successfully.');
          alert('Property updated successfully.');
          this.router.navigate(['/account']);
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
