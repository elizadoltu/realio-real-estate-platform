import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllPropertiesComponent } from './all-properties.component';
import { PropertyService } from '../../../services/property.service';
import { of } from 'rxjs'; 
import { CommonModule } from '@angular/common'; 
import { RouterTestingModule } from '@angular/router/testing'; 

describe('AllPropertiesComponent', () => {
  let component: AllPropertiesComponent;
  let fixture: ComponentFixture<AllPropertiesComponent>;
  let propertyServiceSpy: jasmine.SpyObj<PropertyService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PropertyService', ['getProperties']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule], 
      declarations: [], 
      providers: [
        { provide: PropertyService, useValue: spy }
      ]
    })
    .compileComponents();

    propertyServiceSpy = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;

    propertyServiceSpy.getProperties.and.returnValue(of([{
      address: '123 Main St',
      type: 'House',
      price: 300000,
      squareFootage: 1500,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      description: 'A beautiful house',
      status: 'Available',
      listingDate: '2024-12-01',
      imageUrls: 'http://example.com/image.jpg',
      userId: 'user123'
    }]));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get properties on initialization', () => {
    expect(propertyServiceSpy.getProperties).toHaveBeenCalledTimes(1);

    expect(component.properties).toEqual([{
      address: '123 Main St',
      type: 'House',
      price: 300000,
      squareFootage: 1500,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      description: 'A beautiful house',
      status: 'Available',
      listingDate: '2024-12-01',
      imageUrls: 'http://example.com/image.jpg',
      userId: 'user123'
    }]);
  });
});
