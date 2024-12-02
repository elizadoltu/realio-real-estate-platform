import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { GetByIdComponent } from './get-by-id.component';
import { PropertyService } from '../../../services/property.service'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('GetByIdComponent', () => {
  let component: GetByIdComponent;
  let fixture: ComponentFixture<GetByIdComponent>;
  let mockPropertyService: any;

  beforeEach(async () => {
    // Cream o simulare pentru PropertyService
    mockPropertyService = {
      getPropertyById: jasmine.createSpy('getPropertyById').and.returnValue(of({ id: 1, name: 'Test Property', location: 'Test Location' }))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [GetByIdComponent],
      providers: [{ provide: PropertyService, useValue: mockPropertyService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch property details on valid form submission', () => {
    component.getByIdForm.controls['propertyId'].setValue('1');
    component.onGetById();
    expect(mockPropertyService.getPropertyById).toHaveBeenCalledWith('1');
    expect(component.property).toEqual({ id: 1, name: 'Test Property', location: 'Test Location' });
  });
});
