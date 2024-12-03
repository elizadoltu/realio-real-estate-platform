import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllPropertiesComponent } from './all-properties.component';
import { PropertyService } from '../../../services/property.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PropertyListing } from '../../../models/property.model';
import { of } from 'rxjs';

describe('AllPropertiesComponent with PropertyService', () => {
  let component: AllPropertiesComponent;
  let fixture: ComponentFixture<AllPropertiesComponent>;
  let propertyService: PropertyService;

  const mockPaginatedResponse = {
    isSuccess: true,
    data: {
      data: [
        {
          propertyId: '556fa628-1aa0-4f13-9557-04784f544bbb',
          title: 'Loft Apartment',
          address: 'Costache Negri, A1, B, ap 10',
          type: 'apartment',
          price: 3000,
          squareFootage: 34,
          numberOfBedrooms: 67,
          numberOfBathrooms: 56,
          description: 'hello',
          status: 'sold',
          listingDate: '2024-12-01T00:00:00Z',
          imageURLs: 'https://image.png',
          userID: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        }
      ],
      totalCount: 1
    },
    errorMessage: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule,
        // Importing the standalone component
        AllPropertiesComponent
      ],
      providers: [PropertyService]
    }).compileComponents();

    propertyService = TestBed.inject(PropertyService);
    fixture = TestBed.createComponent(AllPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch properties on component initialization and interact with the service correctly', () => {
    spyOn(propertyService, 'getPaginatedProperties').and.returnValue(of(mockPaginatedResponse));
  
    component.ngOnInit();
  
    // Update the expected object to match the actual parameters
    const expectedFilters = {
      Type: '',
      price: 0,
      nrOfBathrooms: 0,
      nrOfBedrooms: 0,
      status: '',
      squareFootage: 0
    };
  
    // Check if the service was called with the expected parameters
    expect(propertyService.getPaginatedProperties).toHaveBeenCalledWith(1, 2, expectedFilters);
  
    // Check if the component's properties are updated correctly
    expect(component.properties.length).toBe(1);
    expect(component.properties[0].title).toBe('Loft Apartment');
    expect(component.totalPages).toBe(1);
  
    // Test the navigation methods
    const navigateSpy = spyOn(component['router'], 'navigate');
    
    component.navigateToCreate();
    expect(navigateSpy).toHaveBeenCalledWith(['property-listings/create-property']);
  
    component.navigateToUpdate();
    expect(navigateSpy).toHaveBeenCalledWith(['property-listings/update-property']);
  
    component.navigateToDelete();
    expect(navigateSpy).toHaveBeenCalledWith(['property-listings/delete-property']);
  });
  
});
