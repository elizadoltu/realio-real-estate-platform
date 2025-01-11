import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-post-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-property.component.html',
  styleUrl: './post-property.component.css'
})
export class PostPropertyComponent implements OnInit {
  propertyForm: FormGroup;
  userId: string = '';
  predictedPrice: number | null = null;
  isLoadingPrediction: boolean = false;
  uploadedPhotos: string[] = []; // Previzualizările imaginilor (Base64)
  base64Images: string[] = []; // Imaginile codificate pentru backend

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly propertyService: PropertyService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly authService: AuthService
  ) {
    this.propertyForm = this.formBuilder.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      type: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      squareFootage: [null, [Validators.required, Validators.min(0)]],
      numberOfBedrooms: [null, [Validators.required, Validators.min(0)]],
      numberOfBathrooms: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      status: ['available', Validators.required],
      listingDate: [new Date().toISOString(), Validators.required],
      imageUrls: [''],
      userId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const token = this.authService.getAuthToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
        const userId = decodedToken.nameid;
        this.userId = userId;
        this.propertyForm.controls['userId'].setValue(this.userId);
        console.log(this.propertyForm);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('Authentication token is null or missing');
      this.router.navigate(['/account']);
    }
  }

  goBack(): void {
    this.location.back();
  }

  fetchPredictedPrice(): void {
    const squareFootage = this.propertyForm.controls['squareFootage'].value;
    const numberOfBedrooms = this.propertyForm.controls['numberOfBedrooms'].value;

    if (!squareFootage || !numberOfBedrooms) {
      console.error('Square footage, number of bedrooms, and price are required');
      return;
    }

    this.isLoadingPrediction = true;
    this.propertyService.generatePricePrediction(squareFootage, numberOfBedrooms).subscribe({
      next: (response) => {
        this.predictedPrice = response;
        this.isLoadingPrediction = false;
        console.log('Predicted price:', this.predictedPrice);
      },
      error: (error) => {
        console.error('Error fetching predicted price:', error);
        this.isLoadingPrediction = false;
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result.split(',')[1]; // Codificare în Base64
          this.uploadedPhotos.push(e.target.result); // Previzualizare
          this.base64Images.push(base64String); // Pregătire pentru backend
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onDeletePhoto(photo: string): void {
    const index = this.uploadedPhotos.indexOf(photo);
    if (index > -1) {
      this.uploadedPhotos.splice(index, 1); // Elimin din previzualizări
      this.base64Images.splice(index, 1); // Elimin din codificările pentru backend
    }
  }

  onSubmit(): void {
    if (this.propertyForm.invalid) {
      console.error('Form is invalid:', this.propertyForm);
  
      // Afișeaz starea fiecărui câmp
      Object.keys(this.propertyForm.controls).forEach((key) => {
        const control = this.propertyForm.get(key);
        console.log(`Control: ${key}, Valid: ${control?.valid}, Errors: ${control?.errors}`);
      });
  
      return;
    }
  
    const formData = this.propertyForm.value;
  
    // Codific imaginile într-un format JSON pentru separare mai sigură
    formData.imageUrls = JSON.stringify(this.base64Images);
  
    console.log('Form Data Submitted:', formData);
  
    this.propertyService.createProperty(formData).subscribe(
      () => {
        console.log('Property posted successfully with images!');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error posting property:', error);
      }
    );
  }

  capitalizeFirstLetter(value: string): string {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
