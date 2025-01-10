import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let propertyServiceMock: jasmine.SpyObj<PropertyService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['updateUser']);
    userServiceMock = jasmine.createSpyObj('UserService', ['getUserDetails', 'logout']); // Add 'logout' here
    propertyServiceMock = jasmine.createSpyObj('PropertyService', ['getPropertiesByUserId']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
  
    TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, AccountComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: PropertyService, useValue: propertyServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch user details if auth token exists', () => {
      const mockUserDetails = { userId: '1', name: 'John Doe', email: 'john@example.com', phoneNumber: '1234567890' };
      localStorage.setItem('authToken', 'mockToken');
      userServiceMock.getUserDetails.and.returnValue(of(mockUserDetails));

      component.ngOnInit();

      expect(component.userDetails).toEqual(mockUserDetails);
      expect(userServiceMock.getUserDetails).toHaveBeenCalled();
    });

    it('should alert when no auth token exists', () => {
      spyOn(window, 'alert');
      localStorage.removeItem('authToken');

      component.ngOnInit();

      expect(window.alert).toHaveBeenCalledWith('No authentication token found');
    });
  });

  describe('onSave', () => {
    it('should call authService.updateUser with the updated user data', () => {
      const updatedData = { userId: '1', name: 'John Doe', email: 'john@example.com', phoneNumber: '1234567890' };
      component.userDetails = updatedData;
      authServiceMock.updateUser.and.returnValue(of({}));

      component.onSave();

      expect(authServiceMock.updateUser).toHaveBeenCalledWith(updatedData.userId, updatedData);
    });

    it('should show an alert on successful update', () => {
      spyOn(window, 'alert');
      authServiceMock.updateUser.and.returnValue(of({}));

      component.onSave();

      expect(window.alert).toHaveBeenCalledWith('Profile updated successfully!');
    });

    it('should show an alert on failed update', () => {
      spyOn(window, 'alert');
      authServiceMock.updateUser.and.returnValue(throwError('Error'));

      component.onSave();

      expect(window.alert).toHaveBeenCalledWith('Failed to update profile. Please ensure all fields are correct.');
    });
  });

  describe('onLogout', () => {
    it('should call userService.logout and navigate to home', () => {
      component.onLogout();

      expect(userServiceMock.logout).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('loadProperties', () => {
    // it('should load properties and map random images', () => {
    //   const mockProperties = [
    //     { id: '1', name: 'Property 1' },
    //     { id: '2', name: 'Property 2' },
    //   ];
    //   component.userDetails.userId = '1';
    //   propertyServiceMock.getPropertiesByUserId.and.returnValue(of({ isSuccess: true, data: mockProperties }));

    //   component.loadProperties();

    //   expect(component.properties).toEqual(mockProperties);
    //   expect(component.properties[0].randomImage).toBeDefined(); // Check random image mapping
    // });

    it('should show an alert if properties fail to load', () => {
      spyOn(window, 'alert');
      propertyServiceMock.getPropertiesByUserId.and.returnValue(throwError('Error'));

      component.loadProperties();

      expect(window.alert).toHaveBeenCalledWith('An error occurred while fetching properties.');
    });
  });

  describe('isEmailValid', () => {
    it('should return true for a valid email', () => {
      expect(component.isEmailValid('test@example.com')).toBeTrue();
    });

    it('should return false for an invalid email', () => {
      expect(component.isEmailValid('invalid-email')).toBeFalse();
    });
  });

  describe('isPhoneNumberValid', () => {
    it('should return true for a valid phone number', () => {
      expect(component.isPhoneNumberValid('1234567890')).toBeTrue();
    });

    it('should return false for an invalid phone number', () => {
      expect(component.isPhoneNumberValid('invalid-phone')).toBeFalse();
    });
  });

  describe('sanitizeInput', () => {
    it('should trim leading and trailing spaces', () => {
      expect(component.sanitizeInput('  hello  ')).toBe('hello');
    });
  });
});
