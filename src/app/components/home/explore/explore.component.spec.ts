import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreComponent } from './explore.component';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactComponent } from '../contact/contact.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;
  let propertyService: jasmine.SpyObj<PropertyService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const propertyServiceSpy = jasmine.createSpyObj('PropertyService', ['getPaginatedProperties']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ CommonModule, FormsModule, ExploreComponent, ContactComponent, HttpClientTestingModule ],
      providers: [
        { provide: PropertyService, useValue: propertyServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch properties on init', () => {
    const mockProperties = {
      isSuccess: true,
      data: {
        data: [{ propertyId: '1', name: 'Property 1' }],
        totalCount: 1
      }
    };
    // Mock the service call
    propertyService.getPaginatedProperties.and.returnValue(of(mockProperties));
  
    // Call ngOnInit to trigger the property fetch
    component.ngOnInit();
  
    // Check if the service was called
    expect(propertyService.getPaginatedProperties).toHaveBeenCalled();
  
    // Ensure properties are populated
    expect(component.properties.length).toBe(1);
    expect(component.properties[0].title).toBe('Property 1');
    expect(component.properties[0].propertyId).toBe('1');
  });
  

  it('should handle error while fetching properties', () => {
    propertyService.getPaginatedProperties.and.returnValue(of({ isSuccess: false, errorMessage: 'Error fetching properties' }));

    component.ngOnInit();

    expect(propertyService.getPaginatedProperties).toHaveBeenCalled();
    expect(component.properties.length).toBe(0);
  });

  it('should navigate to property detail page on navigateToPropertyDetail', () => {
    component.navigateToPropertyDetail('1');
    expect(router.navigate).toHaveBeenCalledWith(['/property/1']);
  });

  it('should toggle filters visibility on toggleFilters', () => {
    component.toggleFilters();
    expect(component.isFilterOpen).toBe(true);
    component.toggleFilters();
    expect(component.isFilterOpen).toBe(false);
  });

  it('should apply filters and fetch properties', () => {
    const mockProperties = {
      isSuccess: true,
      data: {
        data: [{ propertyId: '1', name: 'Property 1' }],
        totalCount: 1
      }
    };
    propertyService.getPaginatedProperties.and.returnValue(of(mockProperties));

    component.applyFilters();

    expect(propertyService.getPaginatedProperties).toHaveBeenCalled();
    expect(component.properties.length).toBe(1);
  });

  it('should navigate to search page', () => {
    component.navigateToSearch();
    expect(router.navigate).toHaveBeenCalledWith(['/search']);
  });

  it('should navigate to post property page', () => {
    component.navigateToPostProperty();
    expect(router.navigate).toHaveBeenCalledWith(['/post-property']);
  });

  it('should clear filters and fetch properties', () => {
    const mockProperties = {
      isSuccess: true,
      data: {
        data: [{ propertyId: '1', name: 'Property 1' }],
        totalCount: 1
      }
    };
    propertyService.getPaginatedProperties.and.returnValue(of(mockProperties));

    component.clearFilters();

    expect(propertyService.getPaginatedProperties).toHaveBeenCalled();
    expect(component.filters).toEqual({
      Type: '',
      price: 0,
      nrOfBathrooms: 0,
      nrOfBedrooms: 0,
      status: '',
      squareFootage: 0
    });
    expect(component.properties.length).toBe(1);
  });
});
