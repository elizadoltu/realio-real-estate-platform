import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; 
import { PropertyService } from '../../../services/property.service';
import { ExploreComponent } from './explore.component';
import { Observable, of as observableOf, throwError } from 'rxjs';

@Injectable()
class MockRouter {
  navigate = jest.fn();
}

@Injectable()
class MockPropertyService {
  getPaginatedProperties = jest.fn();
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom: any;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value: any) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value: any) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value: any) { return value; }
}

describe('ExploreComponent', () => {
  let fixture: ComponentFixture<ExploreComponent>;
  let component: ExploreComponent;
  let mockRouter: MockRouter;
  let mockPropertyService: MockPropertyService;

  beforeEach(() => {
    mockRouter = TestBed.inject(MockRouter);
    mockPropertyService = TestBed.inject(MockPropertyService);

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ExploreComponent ],
      declarations: [TranslatePipe, PhoneNumberPipe, SafeHtmlPipe, MyCustomDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PropertyService, useValue: mockPropertyService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the filter open state', () => {
    component.isFilterOpen = false;
    component.toggleFilters();
    expect(component.isFilterOpen).toBe(true);

    component.toggleFilters();
    expect(component.isFilterOpen).toBe(false);
  });

  it('should apply filters and fetch properties', () => {
    const fetchPropertiesSpy = jest.spyOn(component, 'fetchProperties');
    component.applyFilters();
    expect(fetchPropertiesSpy).toHaveBeenCalled();
  });

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

  it('should fetch properties and handle the response correctly', () => {
    const mockResponse = { isSuccess: true, data: { data: [], totalCount: 0 } };
    mockPropertyService.getPaginatedProperties = jest.fn().mockReturnValue(observableOf(mockResponse));

    component.fetchProperties();
    expect(mockPropertyService.getPaginatedProperties).toHaveBeenCalled();
    expect(component.properties).toEqual([]);
    expect(component.totalPages).toBe(0);
  });

  it('should handle fetch properties error', () => {
    const mockError = 'Error fetching properties';
    mockPropertyService.getPaginatedProperties = jest.fn().mockReturnValue(throwError(mockError));

    component.fetchProperties();
    expect(mockPropertyService.getPaginatedProperties).toHaveBeenCalled();
    // Optionally, you can add assertions to check the error handling.
  });

  it('should fetch a random image', () => {
    const randomImage = component.getRandomImage();
    expect(component.testImages).toContain(randomImage);
  });

  it('should preload images successfully', async () => {
    const images = ['assets/testimage-1.jpg', 'assets/testimage-2.jpg'];
    const preloadSpy = jest.spyOn(component, 'preloadImages').mockResolvedValue([]);

    await component.ngOnInit();
    expect(preloadSpy).toHaveBeenCalledWith(images);
  });

  it('should handle ngOnInit and preload images error', async () => {
    const preloadSpy = jest.spyOn(component, 'preloadImages').mockRejectedValue('Error preloading images');
    await component.ngOnInit();
    expect(preloadSpy).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('should navigate to property detail', () => {
    const propertyId = '123';
    component.navigateToPropertyDetail(propertyId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/property/${propertyId}`]);
  });

  it('should handle undefined property ID in navigateToPropertyDetail()', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});  // Mock console.error
    component.navigateToPropertyDetail(undefined);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Property ID is undefined');
  });

  it('should clear filters and fetch properties', () => {
    const fetchPropertiesSpy = jest.spyOn(component, 'fetchProperties');
    component.clearFilters();
    expect(component.filters).toEqual({
      Type: '',
      price: 0,
      nrOfBathrooms: 0,
      nrOfBedrooms: 0,
      status: '',
      squareFootage: 0,
    });
    expect(fetchPropertiesSpy).toHaveBeenCalled();
  });
});
