import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePropertyComponent } from './update-property.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { of, throwError } from 'rxjs';

describe('UpdatePropertyComponent', () => {
  let component: UpdatePropertyComponent;
  let fixture: ComponentFixture<UpdatePropertyComponent>;
  let propertyService: PropertyService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UpdatePropertyComponent],
      providers: [
        {
          provide: PropertyService,
          useValue: { updateProperty: jasmine.createSpy('updateProperty').and.returnValue(of({})) },  
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },  
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePropertyComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    (propertyService.updateProperty as jasmine.Spy).calls.reset();
    (router.navigate as jasmine.Spy).calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with correct controls', () => {
    expect(component.updateForm.contains('propertyId')).toBeTrue();
    expect(component.updateForm.contains('title')).toBeTrue();
  });

  it('should mark the form as invalid if not all fields are filled out', () => {
    component.updateForm.controls['title'].setValue('');
    expect(component.updateForm.valid).toBeFalse();
  });

  it('should call updateProperty on valid form submission', () => {
    component.updateForm.setValue({
      propertyId: '123',
      title: 'Test Property',
      address: 'Test Address',
      type: 'House',
      price: 100000,
      squareFootage: 1500,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      description: 'Test Description',
      status: 'Available',
      listingDate: '2024-01-01',
      userID: 'user123',
      imageUrls: 'image1.jpg',
    });

    component.onUpdate();

    expect(propertyService.updateProperty).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/property-listings']);
  });

  it('should handle errors when the update fails', () => {
    (propertyService.updateProperty as jasmine.Spy).and.returnValue(throwError({ error: 'Error' }));
    
    spyOn(console, 'error'); 
  
    component.updateForm.setValue({
      propertyId: '123',
      title: 'Test Property',
      address: 'Test Address',
      type: 'House',
      price: 100000,
      squareFootage: 1500,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      description: 'Test Description',
      status: 'Available',
      listingDate: '2024-01-01',
      userID: 'user123',
      imageUrls: 'image1.jpg',
    });
  
    component.onUpdate();
  
    expect(console.error).toHaveBeenCalledWith('Error updating property:', { error: 'Error' });
  });
  
});
