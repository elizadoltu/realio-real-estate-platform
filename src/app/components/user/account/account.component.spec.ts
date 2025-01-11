import { TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let authServiceMock: any;
  let userServiceMock: any;
  let propertyServiceMock: any;
  let routerMock: any;

  // Mock window.alert
  beforeAll(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  beforeEach(async () => {
    authServiceMock = {
      updateUser: jest.fn(),
    };

    userServiceMock = {
      getUserDetails: jest.fn(),
      logout: jest.fn(),
    };

    propertyServiceMock = {
      getPropertiesByUserId: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AccountComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: PropertyService, useValue: propertyServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user details on initialization if token exists', () => {
    const mockUserDetails = { userId: '123', name: 'John Doe', email: 'john@example.com', phoneNumber: '1234567890' };
    jest.spyOn(localStorage, 'getItem').mockReturnValue('mockToken');
    userServiceMock.getUserDetails.mockReturnValue(of(mockUserDetails));

    component.ngOnInit();

    expect(userServiceMock.getUserDetails).toHaveBeenCalled();
    expect(component.userDetails).toEqual(mockUserDetails);
  });

  it('should handle error when fetching user details fails', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue('mockToken');
    userServiceMock.getUserDetails.mockReturnValue(throwError('Error fetching user details'));

    component.ngOnInit();

    expect(userServiceMock.getUserDetails).toHaveBeenCalled();
    expect(component.userDetails).toEqual({ userId: '', name: '', email: '', phoneNumber: '' });
  });

  it('should update user details when onSave is called', () => {
    const updatedData = { userId: '123', name: 'John Doe', email: 'john@example.com', phoneNumber: '1234567890' };
    component.userDetails = { ...updatedData };
    authServiceMock.updateUser.mockReturnValue(of({ message: 'Success' }));

    component.onSave();

    expect(authServiceMock.updateUser).toHaveBeenCalledWith('123', updatedData);
  });

  it('should log out the user and navigate to home on logout', () => {
    component.onLogout();

    expect(userServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should fetch and map properties with random images', () => {
    component.userDetails.userId = '123';
    const mockProperties = [
      { id: '1', name: 'Property 1' },
      { id: '2', name: 'Property 2' },
    ];

    propertyServiceMock.getPropertiesByUserId.mockReturnValue(
      of({ isSuccess: true, data: mockProperties })
    );

    component.loadProperties();

    expect(propertyServiceMock.getPropertiesByUserId).toHaveBeenCalledWith('123');
    expect(component.properties.length).toBe(2);
    expect(component.properties[0]).toHaveProperty('randomImage');
  });

  it('should navigate to edit property page on edit', () => {
    component.onEditProperty('123');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/edit-property/123']);
  });

  it('should validate email correctly', () => {
    expect(component.isEmailValid('valid@example.com')).toBe(true);
    expect(component.isEmailValid('invalid-email')).toBe(false);
  });

  it('should validate phone number correctly', () => {
    expect(component.isPhoneNumberValid('1234567890')).toBe(true);
    expect(component.isPhoneNumberValid('12345')).toBe(false);
  });
});
