import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPropertyComponent } from './edit-property.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditPropertyComponent', () => {
  let component: EditPropertyComponent;
  let fixture: ComponentFixture<EditPropertyComponent>;
  let propertyService: jest.Mocked<PropertyService>;
  let activatedRoute: jest.Mocked<ActivatedRoute>;
  let router: jest.Mocked<Router>;
  let location: jest.Mocked<Location>;

  beforeEach(async () => {
    const propertyServiceMock = {
      getPropertyById: jest.fn(),
      updateProperty: jest.fn(),
      deleteProperty: jest.fn(),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn(),
        },
      },
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    const locationMock = {
      back: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditPropertyComponent],
      providers: [
        { provide: PropertyService, useValue: propertyServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements or attributes
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPropertyComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService) as jest.Mocked<PropertyService>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jest.Mocked<ActivatedRoute>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    location = TestBed.inject(Location) as jest.Mocked<Location>;

    (activatedRoute.snapshot.paramMap.get as jest.Mock).mockReturnValue('1'); // Mock propertyId
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with property details if propertyId exists', () => {
    const mockProperty = {
      title: 'Test Property',
      address: '123 Test St',
      type: 'House',
      price: 100000,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      squareFootage: 1200,
      description: 'A nice house',
      imageURLs: '["image1.jpg", "image2.jpg"]',
    };

    propertyService.getPropertyById.mockReturnValue(of(mockProperty));

    component.ngOnInit();

    expect(propertyService.getPropertyById).toHaveBeenCalledWith('1');
    expect(component.editPropertyForm.value.title).toBe('Test Property');
  });

  it('should handle error when property details cannot be loaded', () => {
    propertyService.getPropertyById.mockReturnValue(throwError('Error loading property'));

    console.error = jest.fn(); // Mock console error
    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading property details:', 'Error loading property');
  });

  it('should call updateProperty on save with correct data', () => {
    const mockProperty = {
      title: 'Test Property',
      address: '123 Test St',
      type: 'House',
      price: 100000,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      squareFootage: 1200,
      description: 'A nice house',
      imageURLs: '[]',
    };

    component.editPropertyForm.setValue(mockProperty);
    propertyService.updateProperty.mockReturnValue(of(null)); // Simulate successful update

    component.onSaveProperty('1');

    expect(propertyService.updateProperty).toHaveBeenCalledWith('1', mockProperty, '');
    expect(router.navigate).toHaveBeenCalledWith(['/account']);
  });

  it('should handle error on updateProperty if the API fails', () => {
    const mockProperty = {
      title: 'Test Property',
      address: '123 Test St',
      type: 'House',
      price: 100000,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      squareFootage: 1200,
      description: 'A nice house',
      imageURLs: '["image1.jpg", "image2.jpg"]',
    };

    component.editPropertyForm.setValue(mockProperty);
    propertyService.updateProperty.mockReturnValue(throwError('Error updating property'));

    console.error = jest.fn(); // Mock console error
    component.onSaveProperty('1');

    expect(console.error).toHaveBeenCalledWith('Error updating property:', 'Error updating property');
  });

  it('should call deleteProperty on delete and navigate back', () => {
    const propertyId = '1';
    propertyService.deleteProperty.mockReturnValue(of(null));

    component.onDeleteProperty(propertyId);

    expect(location.back).toHaveBeenCalled();
  });

  it('should not delete property if propertyId is null', () => {
    component.onDeleteProperty(null);

    expect(propertyService.deleteProperty).not.toHaveBeenCalled();
  });

  it('should go back when goBack() is called', () => {
    component.goBack();

    expect(location.back).toHaveBeenCalled();
  });
});
