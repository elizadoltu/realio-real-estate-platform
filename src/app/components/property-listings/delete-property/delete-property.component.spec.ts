import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletePropertyComponent } from './delete-property.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { of, throwError } from 'rxjs';

describe('DeletePropertyComponent', () => {
  let component: DeletePropertyComponent;
  let fixture: ComponentFixture<DeletePropertyComponent>;
  let propertyService: PropertyService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DeletePropertyComponent],
      providers: [
        {
          provide: PropertyService,
          useValue: { deleteProperty: jasmine.createSpy('deleteProperty').and.returnValue(of({})) }, 
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }, 
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePropertyComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls', () => {
    expect(component.deleteForm.contains('propertyId')).toBeTrue();
    expect(component.deleteForm.contains('confirm')).toBeTrue();
  });

  it('should mark the form as invalid if propertyId is empty', () => {
    component.deleteForm.controls['propertyId'].setValue('');
    component.deleteForm.controls['confirm'].setValue(true);
    expect(component.deleteForm.invalid).toBeTrue();
  });

  it('should mark the form as invalid if confirm is false', () => {
    component.deleteForm.controls['propertyId'].setValue('123');
    component.deleteForm.controls['confirm'].setValue(false);
    expect(component.deleteForm.invalid).toBeTrue();
  });

  it('should call deleteProperty on valid form submission', () => {
    component.deleteForm.setValue({
      propertyId: '123',
      confirm: true,
    });

    component.onDelete();

    expect(propertyService.deleteProperty).toHaveBeenCalledWith('123');
    expect(router.navigate).toHaveBeenCalledWith(['/property-listings']);
  });

  it('should handle error when deleteProperty fails', () => {
    const errorResponse = { error: 'Error' };
    spyOn(propertyService, 'deleteProperty').and.returnValue(throwError(errorResponse));

    spyOn(console, 'error'); 

    component.deleteForm.setValue({
      propertyId: '123',
      confirm: true,
    });

    component.onDelete();

    expect(console.error).toHaveBeenCalledWith('Error deleting property:', errorResponse);
  });

  it('should log "Form is invalid" if form is invalid on delete attempt', () => {
    spyOn(console, 'error'); 

    component.deleteForm.setValue({
      propertyId: '',
      confirm: false,
    });

    component.onDelete();

    expect(console.error).toHaveBeenCalledWith('Form is invalid');
  });
});
