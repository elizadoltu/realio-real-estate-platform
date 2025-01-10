import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPropertyComponent } from './edit-property.component';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

class MockPropertyService {
  getPropertyById = jasmine.createSpy('getPropertyById').and.returnValue(of({ isSuccess: true, data: { title: 'Test Property' } }));
  deleteProperty = jasmine.createSpy('deleteProperty').and.returnValue(of(null));
  updateProperty = jasmine.createSpy('updateProperty').and.returnValue(of(null));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockLocation {
  back = jasmine.createSpy('back');
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: jasmine.createSpy('get').and.returnValue('123')
    }
  };
}

describe('EditPropertyComponent', () => {
  let component: EditPropertyComponent;
  let fixture: ComponentFixture<EditPropertyComponent>;
  let propertyService: MockPropertyService;
  let router: MockRouter;
  let location: MockLocation;
  let activatedRoute: MockActivatedRoute;

  beforeEach(async () => {
    propertyService = new MockPropertyService();
    router = new MockRouter();
    location = new MockLocation();
    activatedRoute = new MockActivatedRoute();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, EditPropertyComponent],
      providers: [
        { provide: PropertyService, useValue: propertyService },
        { provide: Router, useValue: router },
        { provide: Location, useValue: location },
        { provide: ActivatedRoute, useValue: activatedRoute },
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load property details on init', () => {
    component.ngOnInit();
    expect(propertyService.getPropertyById).toHaveBeenCalledWith('123');
    expect(component.editPropertyForm.value.title).toBe('Test Property');
  });

  it('should handle error when loading property details', () => {
    // Mocking the property service to return an error
    propertyService.getPropertyById.and.returnValue(throwError('Error loading property'));
    
    // Call ngOnInit() where the service call happens
    component.ngOnInit();
    
    // Verify that the form's title is cleared in case of error
    fixture.detectChanges(); // Trigger change detection to update the form
    expect(component.editPropertyForm.value.title).toBe(''); // Expect the title to be an empty string
  });
  

  // it('should delete property when onDeleteProperty is called', () => {
  //   component.onDeleteProperty('123');
  //   expect(propertyService.deleteProperty).toHaveBeenCalledWith('123');
  //   expect(location.back).toHaveBeenCalled();
  // });

  it('should show an error when deleting property fails', () => {
    // Create a spy on console.error
    spyOn(console, 'error');
    
    propertyService.deleteProperty.and.returnValue(throwError('Error deleting property'));
    component.onDeleteProperty('123');
    
    // Check that console.error was called with the expected error
    expect(console.error).toHaveBeenCalledWith('Error deleting property:', 'Error deleting property');
  });

  it('should save property when onSaveProperty is called', () => {
    component.editPropertyForm.setValue({
      title: 'Updated Property',
      address: '',
      type: '',
      price: '',
      numberOfBedrooms: '',
      numberOfBathrooms: '',
      squareFootage: '',
      description: '',
    });
    component.onSaveProperty('123');
    expect(propertyService.updateProperty).toHaveBeenCalledWith('123', component.editPropertyForm.value, undefined);
    expect(router.navigate).toHaveBeenCalledWith(['/account']);
  });

  it('should show an error when saving property fails', () => {
    // Create a spy on console.error
    spyOn(console, 'error');
    
    propertyService.updateProperty.and.returnValue(throwError('Error updating property'));
    component.onSaveProperty('123');
    
    // Check that console.error was called with the expected error
    expect(console.error).toHaveBeenCalledWith('Error updating property:', 'Error updating property');
  });

  it('should go back to the previous location when goBack is called', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});
