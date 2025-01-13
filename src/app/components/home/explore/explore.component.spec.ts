import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreComponent } from './explore.component';
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactComponent } from '../contact/contact.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;
  let propertyService: PropertyService;
  let router: Router;

  beforeEach(async () => {
    const propertyServiceMock = {
      getPaginatedProperties: jest.fn().mockReturnValue(of({})),
    };

    const routerMock = {
      navigate: jest.fn(),
      events: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [ CommonModule, FormsModule, ExploreComponent, ContactComponent,HttpClientTestingModule ],
      providers: [
        { provide: PropertyService, useValue: propertyServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch properties with images on init', () => {
    const mockProperties = {
      isSuccess: true,
      data: {
        data: [
          { id: 1, name: 'Property 1', imageURLs: '["image1.jpg"]' },
          { id: 2, name: 'Property 2', imageURLs: '["image2.jpg"]' }
        ],
        totalCount: 2
      }
    };

    (propertyService.getPaginatedProperties as jest.Mock).mockReturnValue(of(mockProperties));
    component.fetchPropertiesWithImages();
    fixture.detectChanges();

    expect(propertyService.getPaginatedProperties).toHaveBeenCalledWith(
      component.currentPage,
      component.pageSize,
      component.filters
    );
    expect(component.properties.length).toBe(2);
    expect(component.totalPages).toBe(1);
  });

  it('should handle error when fetching properties', () => {
    const errorResponse = { isSuccess: false, errorMessage: 'Error fetching properties' };

    (propertyService.getPaginatedProperties as jest.Mock).mockReturnValue(of(errorResponse));
    component.fetchPropertiesWithImages();
    fixture.detectChanges();

    expect(component.properties.length).toBe(0);  // No properties should be fetched
  });

  it('should apply filters and fetch properties again', () => {
    const mockProperties = {
      isSuccess: true,
      data: { data: [], totalCount: 0 }
    };

    (propertyService.getPaginatedProperties as jest.Mock).mockReturnValue(of(mockProperties));
    component.applyFilters();
    fixture.detectChanges();

    expect(component.currentPage).toBe(1);
    expect(propertyService.getPaginatedProperties).toHaveBeenCalledWith(
      component.currentPage,
      component.pageSize,
      component.filters
    );
  });

  it('should navigate to the correct path when a property is clicked', () => {
    const propertyId = '1';
    component.navigateToPropertyDetail(propertyId);
    expect(router.navigate).toHaveBeenCalledWith([`/property/${propertyId}`]);
  });

  it('should handle undefined property ID when navigating to details', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    component.navigateToPropertyDetail(undefined);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Property ID is undefined');
  });

  it('should clear filters and fetch properties again', () => {
    const mockProperties = {
      isSuccess: true,
      data: { data: [], totalCount: 0 }
    };

    (propertyService.getPaginatedProperties as jest.Mock).mockReturnValue(of(mockProperties));
    component.clearFilters();
    fixture.detectChanges();

    expect(component.filters).toEqual({
      Type: '',
      price: 0,
      nrOfBathrooms: 0,
      nrOfBedrooms: 0,
      status: '',
      squareFootage: 0
    });
    expect(component.currentPage).toBe(1);
    expect(propertyService.getPaginatedProperties).toHaveBeenCalledWith(
      component.currentPage,
      component.pageSize,
      component.filters
    );
  });

  it('should toggle the filter visibility', () => {
    expect(component.isFilterOpen).toBeFalsy();
    component.toggleFilters();
    expect(component.isFilterOpen).toBeTruthy();
  });

  it('should extract the first image from the image URLs string', () => {
    const imageUrls = '["image1.jpg", "image2.jpg"]';
    const firstImage = component.extractFirstImage(imageUrls);
    expect(firstImage).toBe('data:image/jpeg;base64,image1.jpg');
  });

  it('should return an empty string when image URLs are empty', () => {
    const emptyImageUrls = '';
    const firstImage = component.extractFirstImage(emptyImageUrls);
    expect(firstImage).toBe('');
  });

  it('should handle invalid image URL format gracefully', () => {
    const invalidImageUrls = 'invalid format';
    const firstImage = component.extractFirstImage(invalidImageUrls);
    expect(firstImage).toBe('');
  });

  it('should handle the navigation start event and scroll to top', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo');
    component.ngOnInit();
  });

  // it('should clean up subscriptions on destroy', () => {
  //   const lenisDestroySpy = jest.spyOn(component.lenis as any, 'destroy');
  //   component.ngOnDestroy();
  //   expect(lenisDestroySpy).toHaveBeenCalled();
  // });
});
