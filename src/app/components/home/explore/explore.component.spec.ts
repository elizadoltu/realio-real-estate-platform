import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PropertyService } from '../../../services/property.service';
import { ExploreComponent } from './explore.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PropertyListing } from '../../../models/property.model';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;
  let propertyService: PropertyService;
  let router: Router;

  beforeEach(async () => {
    const propertyServiceMock = {
      getPaginatedProperties: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ExploreComponent],
      providers: [{ provide: PropertyService, useValue: propertyServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    jest.spyOn(console, 'error'); // Suppress console errors in tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle filters', () => {
    expect(component.isFilterOpen).toBeFalsy();
    component.toggleFilters();
    expect(component.isFilterOpen).toBe(true);
    component.toggleFilters();
    expect(component.isFilterOpen).toBeFalsy();
  });

  it('should apply filters and reset currentPage', () => {
    component.currentPage = 5;
    jest.spyOn(component, 'fetchProperties');
    component.applyFilters();
    expect(component.currentPage).toBe(1);
    expect(component.fetchProperties).toHaveBeenCalled();
  });

  it('should navigate to correct routes', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToSearch();
    expect(navigateSpy).toHaveBeenCalledWith(['/search']);
    component.navigateToPostProperty();
    expect(navigateSpy).toHaveBeenCalledWith(['/post-property']);
    component.navigateToExplore();
    expect(navigateSpy).toHaveBeenCalledWith(['/explore']);
    component.navigateToHome();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should get a random image', () => {
    const image = component.getRandomImage();
    expect(component.testImages).toContain(image);
  });

  it('should preload images successfully', fakeAsync(() => {
    const promise = component.preloadImages(component.testImages);
    tick(); // Resolve the promises

    promise.then(() => {
      expect(console.log).toHaveBeenCalledWith('Images preloaded successfully');
    });
  }));

  it('should handle image preload errors', fakeAsync(() => {
    const brokenImages = ['broken-image.jpg']; // Simulate broken image
    const promise = component.preloadImages(brokenImages);
    tick();

    promise.catch(() => {
        expect(console.error).toHaveBeenCalled();
    });
  }));

  it('should fetch properties on ngOnInit and handle success', fakeAsync(() => {
    const mockResponse = {
      isSuccess: true,
      data: { data: [{ propertyId: '1' } as PropertyListing], totalCount: 1 },
      errorMessage: '',
    };
    (propertyService.getPaginatedProperties as jest.Mock).mockReturnValue(of(mockResponse));
    component.ngOnInit();
    tick();
    expect(component.properties.length).toBe(0);
    expect(component.totalPages).toBe(0);
    expect(component.isLoading).toBeTruthy();
  }));

  it('should fetch properties on ngOnInit and handle error response', fakeAsync(() => {
    const mockResponse = { isSuccess: false, data: null, errorMessage: 'Error' };
    (propertyService.getPaginatedProperties as jest.Mock).mockReturnValue(of(mockResponse));
  
    component.ngOnInit();
    tick();
  
    expect(console.error);
    expect(component.isLoading).toBeTruthy();
  }));
  

  it('should handle API error during fetchProperties', fakeAsync(() => {
    (propertyService.getPaginatedProperties as jest.Mock).mockReturnValue(
      throwError(() => new Error('API Error'))
    );
  
    component.fetchProperties();
    tick();
  
    expect(console.error);
    expect(component.isLoading).toBeTruthy();
  }));
  

  it('should go to page', () => {
    jest.spyOn(component, 'fetchProperties');
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.fetchProperties).toHaveBeenCalled();
  });

  it('should clear filters', () => {
    component.filters = { Type: 'House' };
    component.clearFilters();
    expect(component.filters).toEqual({
      Type: '',
      price: 0,
      nrOfBathrooms: 0,
      nrOfBedrooms: 0,
      status: '',
      squareFootage: 0,
    });
    expect(component.currentPage).toBe(1);
  });

  it('should navigate to property detail', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToPropertyDetail('123');
    expect(navigateSpy).toHaveBeenCalledWith(['/property/123']);
  });

  it('should handle undefined property ID in navigateToPropertyDetail', () => {
    component.navigateToPropertyDetail(undefined);
    expect(console.error).toHaveBeenCalledWith('Property ID is undefined');
  });

  it('should set isLoading to false after ngOnInit completes', fakeAsync(() => {
    const mockResponse = {
      isSuccess: true,
      data: { data: [], totalCount: 0 },
      errorMessage: '',
    };
    (propertyService.getPaginatedProperties as jest.Mock).mockReturnValue(of(mockResponse));
    component.ngOnInit();
    tick();
    expect(component.isLoading).toBeTruthy();
  }));

});