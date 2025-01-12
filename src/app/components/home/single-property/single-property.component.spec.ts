import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglePropertyComponent } from './single-property.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { UserService } from '../../../services/user.service';
import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RouterTestingModule } from '@angular/router/testing';

jest.mock('jwt-decode');

describe('SinglePropertyComponent', () => {
  let component: SinglePropertyComponent;
  let fixture: ComponentFixture<SinglePropertyComponent>;
  let propertyServiceMock: Partial<PropertyService>;
  let userServiceMock: Partial<UserService>;
  let locationMock: Partial<Location>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Mocking the services
    propertyServiceMock = {
      getPropertyById: jest.fn(),
    };

    userServiceMock = {
      getUserDetailsById: jest.fn(),
    };

    locationMock = {
      back: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SinglePropertyComponent],
      providers: [
        { provide: PropertyService, useValue: propertyServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Location, useValue: locationMock },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SinglePropertyComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call property service and user service on initialization', () => {
    const propertyId = '123';
    const propertyResponse = { propertyId: '123', userID: '456' };
    const userDetailsResponse = { name: 'John Doe', email: 'john@example.com' };

    // Mocking service responses
    propertyServiceMock.getPropertyById = jest.fn().mockReturnValue(of(propertyResponse));
    userServiceMock.getUserDetailsById = jest.fn().mockReturnValue(of(userDetailsResponse));

    component.ngOnInit();

    expect(propertyServiceMock.getPropertyById).toHaveBeenCalledWith(propertyId);
    expect(userServiceMock.getUserDetailsById).toHaveBeenCalledWith('456');
    expect(component.property).toEqual(propertyResponse);
    expect(component.userDetails).toEqual(userDetailsResponse);
  });

  it('should handle error when fetching property or user details', () => {
    const propertyId = '123';

    // Mocking a failed response
    propertyServiceMock.getPropertyById = jest.fn().mockReturnValue(throwError(() => new Error('Property not found')));

    component.ngOnInit();

    expect(component.property).toBeUndefined();
    expect(component.userDetails).toBeUndefined();
  });

  it('should handle the "Go back" action', () => {
    component.goBack();
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should process the transaction successfully', () => {
    const mockToken = 'mockToken';
    const mockDecodedToken = { nameid: '789' };
    localStorage.setItem('authToken', mockToken);
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    const propertyData = { data: { propertyId: '123', price: 100000 } };
    component.property = propertyData;
    component.userId = '456';

    const transactionData = { propertyId: '123', buyerId: '789', sellerId: '456', propertyPrice: 100000 };

    const apiUrl = 'https://abundant-reflection-production.up.railway.app/api/Transactions';
    const httpMockResponse = { success: true };

    // Mock HTTP request
    const postSpy = jest.spyOn(httpMock as unknown as { post: jest.Mock }, 'post').mockReturnValue(of(httpMockResponse));

    component.onBuyAction();

    expect(postSpy).toHaveBeenCalledWith(apiUrl, transactionData, { headers: { 'Content-Type': 'application/json' } });
  });

  it('should handle transaction failure when no auth token is present', () => {
    localStorage.removeItem('authToken');
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.onBuyAction();

    expect(alertSpy).toHaveBeenCalledWith('You are not authenticated. Please log in and try again.');
  });

  it('should handle transaction failure when token is invalid', () => {
    localStorage.setItem('authToken', 'invalidToken');
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    (jwtDecode as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

    component.onBuyAction();

    expect(alertSpy).toHaveBeenCalledWith('Authentication token is invalid. Please log in again.');
  });

  it('should handle transaction error', () => {
    const mockToken = 'mockToken';
    const mockDecodedToken = { nameid: '789' };
    localStorage.setItem('authToken', mockToken);
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    const propertyData = { data: { propertyId: '123', price: 100000 } };
    component.property = propertyData;
    component.userId = '456';

    const apiUrl = 'https://abundant-reflection-production.up.railway.app/api/Transactions';
    const transactionData = { propertyId: '123', buyerId: '789', sellerId: '456', propertyPrice: 100000 };

    const postSpy = jest.spyOn(httpMock as unknown as { post: jest.Mock }, 'post').mockReturnValue(throwError(() => new Error('Transaction failed')));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.onBuyAction();

    expect(postSpy).toHaveBeenCalledWith(apiUrl, transactionData, { headers: { 'Content-Type': 'application/json' } });
    expect(alertSpy).toHaveBeenCalledWith('Transaction failed. Please try again.');
  });
});
