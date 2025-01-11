import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditPropertyComponent } from './edit-property.component';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

class MockPropertyService {
  getPropertyById() {
    return of({ isSuccess: true, data: { title: 'Test Property' } });
  }
  deleteProperty() {
    return of({});
  }
  updateProperty() {
    return of({});
  }
}

class MockRouter {
  navigate() {}
}

class MockLocation {
  back = jest.fn();
  ngOnDestroy = jest.fn();

  getState() {
    return {};
  }

  isCurrentPathEqualTo() {
    return false;
  }

  path() {
    return '/';
  }
}

class MockActivatedRoute {
  snapshot = { paramMap: { get: () => '1' } };
}

describe('EditPropertyComponent', () => {
  let fixture: ComponentFixture<EditPropertyComponent>;
  let component: EditPropertyComponent;
  let mockPropertyService: MockPropertyService;
  let mockRouter: MockRouter;
  let mockLocation: MockLocation;  // Update type to the full mock

  beforeEach(() => {
    mockPropertyService = new MockPropertyService();
    mockRouter = new MockRouter();
    mockLocation = new MockLocation();  // Initialize the mock with the full mock class

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,EditPropertyComponent],
      providers: [
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Location, useValue: mockLocation }  // Use the full mock
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPropertyComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadPropertyDetails on ngOnInit', () => {
    jest.spyOn(component, 'loadPropertyDetails');
    component.ngOnInit();
    expect(component.loadPropertyDetails).toHaveBeenCalled();
  });

  it('should load property details', () => {
    jest.spyOn(mockPropertyService, 'getPropertyById').mockReturnValue(of({
      isSuccess: true,
      data: { title: 'Test Property' }
    }));

    component.loadPropertyDetails();
    expect(component.property.title).toBe('Test Property');
  });

  it('should handle error when loading property details', () => {
    jest.spyOn(mockPropertyService, 'getPropertyById').mockReturnValue(throwError('Error loading property'));
    component.loadPropertyDetails();
    expect(component.property).toBeUndefined();
  });

  it('should delete property', () => {
    jest.spyOn(mockPropertyService, 'deleteProperty').mockReturnValue(of({}));
    jest.spyOn(component, 'goBack');
    
    component.onDeleteProperty('1');
    
    expect(mockPropertyService.deleteProperty).toHaveBeenCalledWith('1');
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should not delete property when no ID is provided', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    component.onDeleteProperty(null);
    expect(consoleSpy).toHaveBeenCalledWith('Property ID is null!');
  });

  it('should save property when form is valid', () => {
    component.editPropertyForm.patchValue({
      title: 'New Title',
      address: 'New Address',
      type: 'Apartment',
      price: 100000,
      numberOfBedrooms: 2,
      numberOfBathrooms: 1,
      squareFootage: 1200,
      description: 'Nice apartment'
    });

    jest.spyOn(mockPropertyService, 'updateProperty').mockReturnValue(of({}));
    jest.spyOn(mockRouter, 'navigate');
    
    component.onSaveProperty('1');
    
    expect(mockPropertyService.updateProperty).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ title: 'New Title' }),
      component.property.userID
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/account']);
  });

  it('should not save property when form is invalid', () => {
    component.editPropertyForm.setErrors({ invalid: true });
    const consoleSpy = jest.spyOn(console, 'error');
    
    component.onSaveProperty('1');
    expect(consoleSpy).toHaveBeenCalledWith('Property ID is null!');
  });

  it('should go back to previous location', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
