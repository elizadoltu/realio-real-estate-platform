import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PostPropertyComponent } from './post-property.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { jwtDecode } from "jwt-decode";

describe('PostPropertyComponent', () => {
  let component: PostPropertyComponent;
  let fixture: ComponentFixture<PostPropertyComponent>;
  let propertyService: PropertyService;
  let router: Router;
  let authService: AuthService;
  let location: Location;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, FormsModule, PostPropertyComponent],
      providers: [
        PropertyService,
        AuthService,
        Router,
        Location
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPropertyComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    location = TestBed.inject(Location);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize userId from token on ngOnInit', () => {
  //   const mockToken = 'fake-token';
  //   const mockDecodedToken = { nameid: 'user123' };

  //   spyOn(authService, 'getAuthToken').and.returnValue(mockToken);
  //   spyOn(jwtDecode, 'jwtDecode').and.returnValue(mockDecodedToken);
  //   spyOn(component.propertyForm.controls['userId'], 'setValue');

  //   component.ngOnInit();

  //   expect(component.userId).toBe('user123');
  //   expect(component.propertyForm.controls['userId'].setValue).toHaveBeenCalledWith('user123');
  // });

  it('should fetch predicted price on fetchPredictedPrice', () => {
    const mockPrice = 500000;
    const squareFootage = 1200;
    const numberOfBedrooms = 3;

    spyOn(propertyService, 'generatePricePrediction').and.returnValue(of(mockPrice));

    component.propertyForm.controls['squareFootage'].setValue(squareFootage);
    component.propertyForm.controls['numberOfBedrooms'].setValue(numberOfBedrooms);
    component.fetchPredictedPrice();

    expect(component.isLoadingPrediction).toBeTrue();
    expect(component.predictedPrice).toBe(mockPrice);
    expect(component.isLoadingPrediction).toBeFalse();
  });

  it('should handle error when fetching predicted price', fakeAsync(() => {
    const errorResponse = { message: 'Error fetching data' };
    spyOn(propertyService, 'generatePricePrediction').and.returnValue(throwError(errorResponse));
  
    component.propertyForm.controls['squareFootage'].setValue(1200);
    component.propertyForm.controls['numberOfBedrooms'].setValue(3);
    component.fetchPredictedPrice();
    tick(); // Ensure async operations complete
  
    expect(component.isLoadingPrediction).toBeFalse();
    expect(component.predictedPrice).toBeUndefined(); // Or some default state indicating failure
  }));
  

  it('should submit the form successfully when valid', () => {
    const mockFormData = {
      title: 'Large Family Home',
      address: '789 Pine Blvd',
      type: 'House',
      price: 350000,
      squareFootage: 1800,
      numberOfBedrooms: 4,
      numberOfBathrooms: 3,
      description: 'A large family home',
      status: 'Available',
      listingDate: '2024-12-05',
      imageURLs: 'https://image.png',
      userId: 'user123'
    };

    spyOn(propertyService, 'createProperty').and.returnValue(of(null));
    spyOn(router, 'navigate');

    component.propertyForm.setValue(mockFormData);
    component.onSubmit();

    expect(propertyService.createProperty).toHaveBeenCalledWith(mockFormData);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle error on form submission', () => {
    const mockFormData = {
      title: 'Large Family Home',
      address: '789 Pine Blvd',
      type: 'House',
      price: 350000,
      squareFootage: 1800,
      numberOfBedrooms: 4,
      numberOfBathrooms: 3,
      description: 'A large family home',
      status: 'Available',
      listingDate: '2024-12-05',
      imageURLs: 'https://image.png', // Changed to a single string
      userId: 'user123'
    };
  
    spyOn(propertyService, 'createProperty').and.returnValue(throwError({ message: 'Error posting property' }));
  
    component.propertyForm.setValue(mockFormData);
    component.onSubmit();
  
    expect(propertyService.createProperty).toHaveBeenCalledWith(mockFormData);
    // Add additional checks for error handling
  });
  
  

  it('should go back to the previous page', () => {
    spyOn(location, 'back');

    component.goBack();

    expect(location.back).toHaveBeenCalled();
  });

});
