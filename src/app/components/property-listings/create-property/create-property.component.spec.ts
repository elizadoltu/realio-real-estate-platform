import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePropertyComponent } from './create-property.component';
import { PropertyService } from '../../../services/property.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { title } from 'node:process';

describe('CreatePropertyComponent', () => {
  let component: CreatePropertyComponent;
  let fixture: ComponentFixture<CreatePropertyComponent>;
  let mockPropertyService: jasmine.SpyObj<PropertyService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPropertyService = jasmine.createSpyObj('PropertyService', ['createProperty']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [CreatePropertyComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createProperty and navigate on successful form submission', () => {
    const formData = {
      title: 'Large Family Home',
      address: '123 Main St',
      type: 'House',
      price: 300000,
      squareFootage: 1500,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      description: 'A beautiful house',
      status: 'Available',
      listingDate: '2024-12-01T00:00:00.000Z',  
      imageUrls: 'http://example.com/image.jpg',
      userId: 'user123',
    };

    component.propertyForm.setValue(formData);

    mockPropertyService.createProperty.and.returnValue(of(null));

    component.onSubmit();

    expect(mockPropertyService.createProperty).toHaveBeenCalledWith(formData);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/property-listings/create-property']);
  });

  it('should not call createProperty if the form is invalid', () => {
    component.propertyForm.setValue({
      title: '',
      address: '',
      type: '',
      price: null,
      squareFootage: null,
      numberOfBedrooms: null,
      numberOfBathrooms: null,
      description: '',
      status: '',
      listingDate: '',
      imageUrls: '',
      userId: '',
    });

    component.onSubmit();

    expect(mockPropertyService.createProperty).not.toHaveBeenCalled();
  });

  it('should handle errors from the property service and log them', () => {
    const formData = {
      title: 'Large Family Home',
      address: '123 Main St',
      type: 'House',
      price: 300000,
      squareFootage: 1500,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      description: 'A beautiful house',
      status: 'Available',
      listingDate: '2024-12-01',
      imageUrls: 'http://example.com/image.jpg',
      userId: 'user123',
    };

    component.propertyForm.setValue(formData);

    mockPropertyService.createProperty.and.returnValue(throwError(() => new Error('Service error')));

    spyOn(console, 'error');

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error posting property:', jasmine.any(Error));
  });
});
