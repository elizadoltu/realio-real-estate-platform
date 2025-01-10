import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { PropertyListing } from '../../../models/property.model';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let propertyService: PropertyService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SearchComponent], // Import HttpClientTestingModule for HTTP requests
      providers: [
        PropertyService, // Provide PropertyService to be injected into the component
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }, // Mock Router navigate method
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService);
    router = TestBed.inject(Router);
    fixture.detectChanges(); // Trigger change detection to initialize the component
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle filters', () => {
    const initialFilterState = component.isFilterOpen;
    component.toggleFilters();
    expect(component.isFilterOpen).toBe(!initialFilterState);
  });

  it('should call applyFilters and fetch properties', () => {
    spyOn(component, 'fetchProperties');
    component.applyFilters();
    expect(component.fetchProperties).toHaveBeenCalled();
  });

  it('should call clearSearch and reset properties', () => {
    spyOn(component, 'fetchProperties');
    component.clearSearch();
    expect(component.searchTerm).toBe('');
    expect(component.fetchProperties).toHaveBeenCalled();
  });

  it('should perform search with valid search term', () => {
    const response = {
      isSuccess: true,
      data: [
        { propertyId: '1', title: 'Test Property', address: 'Test Address' },
      ],
    };
    spyOn(propertyService, 'searchClientInquiries').and.returnValue(of(response));
    spyOn(component, 'getRandomImage').and.returnValue('assets/testimage-1.jpg');
    
    component.searchTerm = 'Test';
    component.performSearch();
    
    expect(propertyService.searchClientInquiries).toHaveBeenCalledWith('Test');
    expect(component.properties.length).toBeGreaterThan(0);
    expect(component.properties[0].imageURLs).toBe('assets/testimage-1.jpg');
  });

  it('should handle error in search if API fails', () => {
    spyOn(propertyService, 'searchClientInquiries').and.returnValue(of({ isSuccess: false, errorMessage: 'Error fetching data' }));
    
    component.searchTerm = 'Invalid Search';
    component.performSearch();
    
    expect(component.properties.length).toBe(0);
  });

  it('should call fetchProperties on page change', () => {
    spyOn(component, 'fetchProperties');  // Spy on fetchProperties
  
    // Simulate page change
    component.goToPage(2); 
  
    // Check that fetchProperties was called
    expect(component.fetchProperties).toHaveBeenCalled();
  });
  

  it('should navigate to property detail on view mode change', () => {
    const propertyId = '1';
    component.navigateToPropertyDetail(propertyId);
    expect(router.navigate).toHaveBeenCalledWith([`/property/${propertyId}`]);
  });

  it('should handle clear filters and fetch properties', () => {
    spyOn(component, 'fetchProperties');
    component.clearFilters();
    expect(component.fetchProperties).toHaveBeenCalled();
    expect(component.filters).toEqual({
      Type: '',
      price: 0,
      nrOfBathrooms: 0,
      nrOfBedrooms: 0,
      status: '',
      squareFootage: 0,
      query: '',
    });
    expect(component.searchTerm).toBe('');
    expect(component.currentPage).toBe(1);
  });

});
