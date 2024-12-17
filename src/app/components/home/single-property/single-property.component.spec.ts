import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglePropertyComponent } from './single-property.component';
import { PropertyService } from '../../../services/property.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

class ActivatedRouteStub {
  snapshot = {
    paramMap: {
      get: (key: string) => '1'  // Mock the property ID
    }
  };
}

describe('SinglePropertyComponent', () => {
  let component: SinglePropertyComponent;
  let fixture: ComponentFixture<SinglePropertyComponent>;
  let propertyService: jasmine.SpyObj<PropertyService>;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async () => {
    const propertyServiceSpy = jasmine.createSpyObj('PropertyService', ['getPropertyById']);

    // Create the mock ActivatedRoute
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, SinglePropertyComponent],
      providers: [
        { provide: PropertyService, useValue: propertyServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }  // Provide the mocked ActivatedRoute
      ]
    }).compileComponents();

    // Create the component fixture
    fixture = TestBed.createComponent(SinglePropertyComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call propertyService.getPropertyById on ngOnInit and assign data to property', () => {
    const mockProperty = { id: '1', name: 'Test Property', location: 'Somewhere' };
    propertyService.getPropertyById.and.returnValue(of(mockProperty));

    component.ngOnInit();

    // Check if the service was called with the correct parameter
    expect(propertyService.getPropertyById).toHaveBeenCalledWith('1');
    // Ensure the property is assigned correctly
    expect(component.property).toEqual(mockProperty);
  });

  it('should handle errors when propertyService.getPropertyById fails', () => {
    propertyService.getPropertyById.and.returnValue(throwError('Error fetching property'));

    component.ngOnInit();

    // Ensure the property is set to null if an error occurs
    expect(component.property).toBeNull();
  });

  it('should set property to null if the response is empty', () => {
    propertyService.getPropertyById.and.returnValue(of(null));

    component.ngOnInit();

    // Ensure that property is null when no property is returned
    expect(component.property).toBeNull();
  });

  // it('should call fetchPropertyDetails method with correct id', () => {
  //   const mockProperty = { id: '1', name: 'Test Property' };
  //   propertyService.getPropertyById.and.returnValue(of(mockProperty));

  //   component.fetchPropertyDetails('1');

  //   // Verify if service method was called correctly
  //   expect(propertyService.getPropertyById).toHaveBeenCalledWith('1');
  //   expect(component.property).toEqual(mockProperty);
  // });

  // it('should set property to null when fetchPropertyDetails encounters an error', () => {
  //   propertyService.getPropertyById.and.returnValue(throwError('Error'));

  //   component.fetchPropertyDetails('1');

  //   expect(component.property).toBeNull();
  // });
});
