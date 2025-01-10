import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglePropertyComponent } from './single-property.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { UserService } from '../../../services/user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

describe('SinglePropertyComponent', () => {
  let component: SinglePropertyComponent;
  let fixture: ComponentFixture<SinglePropertyComponent>;
  let propertyService: jasmine.SpyObj<PropertyService>;
  let userService: jasmine.SpyObj<UserService>;
  let httpTestingController: HttpTestingController;
  let location: Location;

  beforeEach(async () => {
    const propertyServiceSpy = jasmine.createSpyObj('PropertyService', ['getPropertyById']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserDetailsById']);
    const activatedRouteMock = {
      snapshot: { paramMap: { get: () => '1' } }
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, RouterModule, SinglePropertyComponent],
      providers: [
        { provide: PropertyService, useValue: propertyServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        Location
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePropertyComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    httpTestingController = TestBed.inject(HttpTestingController);
    location = TestBed.inject(Location);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch property and user details on initialization', () => {
    const mockProperty = { data: { userID: '123', propertyId: '1', price: 500000 } };
    const mockUserDetails = { name: 'John Doe', email: 'john@example.com' };

    propertyService.getPropertyById.and.returnValue(of(mockProperty));
    userService.getUserDetailsById.and.returnValue(of(mockUserDetails));

    component.ngOnInit();

    expect(propertyService.getPropertyById).toHaveBeenCalled();
    expect(userService.getUserDetailsById).toHaveBeenCalledWith('123');
    expect(component.property).toEqual(mockProperty);
    expect(component.userDetails).toEqual(mockUserDetails);
  });

  it('should show an alert if no auth token is found', () => {
    spyOn(window, 'alert');
    localStorage.removeItem('authToken');
    component.onBuyAction();
    expect(window.alert).toHaveBeenCalledWith('You are not authenticated. Please log in and try again.');
  });

  it('should show an alert if token is invalid', () => {
    spyOn(window, 'alert');
    localStorage.setItem('authToken', 'invalid-token');
    component.onBuyAction();
    expect(window.alert).toHaveBeenCalledWith('Authentication token is invalid. Please log in again.');
  });

  it('should handle error when fetching property data', () => {
    propertyService.getPropertyById.and.returnValue(throwError(() => new Error('Property not found')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching data:', jasmine.any(Error));
  });

  it('should handle error when fetching user details', () => {
    const mockProperty = { data: { userID: '123', propertyId: '1', price: 500000 } };

    propertyService.getPropertyById.and.returnValue(of(mockProperty));
    userService.getUserDetailsById.and.returnValue(throwError(() => new Error('User not found')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching data:', jasmine.any(Error));
  });

  it('should handle successful transaction', () => {
    const mockProperty = { data: { userID: '123', propertyId: '1', price: 500000 } };
    const mockResponse = { success: true };
    const mockToken = 'valid-jwt-token';

    propertyService.getPropertyById.and.returnValue(of(mockProperty));
    spyOn(window, 'alert');
    localStorage.setItem('authToken', mockToken);

    component.onBuyAction();

    const req = httpTestingController.expectOne('https://abundant-reflection-production.up.railway.app/api/Transactions');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(window.alert).toHaveBeenCalledWith('Transaction successful');
  });

  it('should show an alert if transaction fails', () => {
    const mockProperty = { data: { userID: '123', propertyId: '1', price: 500000 } };
    const mockToken = 'valid-jwt-token';

    propertyService.getPropertyById.and.returnValue(of(mockProperty));
    spyOn(window, 'alert');
    localStorage.setItem('authToken', mockToken);

    component.onBuyAction();

    const req = httpTestingController.expectOne('https://abundant-reflection-production.up.railway.app/api/Transactions');
    req.flush('Transaction failed', { status: 500, statusText: 'Server Error' });

    expect(window.alert).toHaveBeenCalledWith('Transaction failed. Please try again.');
  });

  it('should go back to previous page on goBack()', () => {
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});