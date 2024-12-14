import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreComponent } from './explore.component';  // Import the standalone component
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPropertyService: jasmine.SpyObj<PropertyService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPropertyService = jasmine.createSpyObj('PropertyService', ['getPaginatedProperties']);

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, FormsModule, ExploreComponent], // Import ExploreComponent directly
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PropertyService, useValue: mockPropertyService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Image Preloading', () => {
    it('should preload images successfully', () => {
      const preloadImagesSpy = spyOn(component, 'preloadImages').and.callThrough();
      component.ngOnInit();
      expect(preloadImagesSpy).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    });

    it('should handle image preload failure gracefully', () => {
      spyOn(component, 'preloadImages').and.returnValue(Promise.reject('Error'));
      component.ngOnInit();
      expect(component.isLoading).toBeFalse();
      expect(component.randomImage).toBe('');
    });
  });

  describe('Property Fetching', () => {
    it('should fetch properties successfully', () => {
      const mockResponse = {
        isSuccess: true,
        data: {
          data: [
            { id: 1, name: 'Property 1', price: 100000 },
            { id: 2, name: 'Property 2', price: 150000 },
          ],
          totalCount: 2,
        },
      };

      mockPropertyService.getPaginatedProperties.and.returnValue(of(mockResponse));

      component.fetchProperties();

      expect(mockPropertyService.getPaginatedProperties).toHaveBeenCalled();
      expect(component.properties.length).toBe(2);
      expect(component.totalPages).toBe(1);
    });

    it('should handle error in fetching properties', () => {
      const mockError = { errorMessage: 'Error fetching properties' };

      mockPropertyService.getPaginatedProperties.and.returnValue(of(mockError));

      component.fetchProperties();

      expect(mockPropertyService.getPaginatedProperties).toHaveBeenCalled();
      expect(component.properties.length).toBe(0);
    });
  });

  describe('Navigation Methods', () => {
    it('should navigate to search page', () => {
      component.navigateToSearch();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/search']);
    });

    it('should navigate to post property page', () => {
      component.navigateToPostProperty();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/post-property']);
    });

    it('should navigate to explore page', () => {
      component.navigateToExplore();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore']);
    });

    it('should navigate to home page', () => {
      component.navigateToHome();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Pagination', () => {
    it('should go to the specified page', () => {
      const page = 2;
      component.goToPage(page);
      expect(component.currentPage).toBe(page);
      expect(mockPropertyService.getPaginatedProperties).toHaveBeenCalled();
    });
  });
});
