import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Mock Services
class MockAuthService {
  updateUser = jest.fn().mockReturnValue(of({})); // Mock success response
  logout = jest.fn().mockReturnValue(of({}));
  getAuthToken = jest.fn().mockReturnValue('mockAuthToken'); // Mocked auth token
}

class MockUserService {
  getUserDetails = jest.fn().mockReturnValue(of({
    userId: '1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '1234567890',
  }));
  deleteUser = jest.fn().mockReturnValue(of({}));
  logout = jest.fn().mockReturnValue(of({}));
}

class MockPropertyService {
  getPropertiesByUserId = jest.fn().mockReturnValue(of([{
    propertyId: '101',
    imageUrls: JSON.stringify(['image1', 'image2']),
  }]));
}

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let authService: AuthService;
  let userService: UserService;
  let propertyService: PropertyService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, AccountComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService },
        { provide: PropertyService, useClass: MockPropertyService },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    propertyService = TestBed.inject(PropertyService);
    router = TestBed.inject(Router);

    // fixture.detectChanges();
  });

  it('should create the AccountComponent', () => {
    expect(component).toBeTruthy();
  });

  // it('should load user details on init', () => {
  //   component.ngOnInit();
  //   expect(component.userDetails.name).toBe('');
  //   expect(component.userDetails.email).toBe('');
  // });

  // it('should handle error when loading user details', () => {
  //   (userService.getUserDetails as jest.Mock).mockReturnValueOnce(throwError(() => new Error('Error fetching user details')));
  //   const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  //   component.ngOnInit();
  //   expect(alertSpy).toHaveBeenCalledWith('No authentication token found');
  // });

  // it('should load properties with images', () => {
  //   component.loadPropertiesWithImages();
  //   expect(component.properties.length).toBe(0);
  // });

  it('should handle error when loading properties with images', () => {
    // Simulate an error related to missing authentication token or user ID
    (propertyService.getPropertiesByUserId as jest.Mock).mockReturnValueOnce(throwError(() => new Error('No authentication token found')));
    
    // Create a spy on window.alert to check if it's called with the expected message
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  
    // Call the method that loads properties with images
    component.loadPropertiesWithImages();
  
    // Check if the alert was called with the expected error message
    expect(alertSpy).toHaveBeenCalledWith("User ID is missing!");
  
    // Reset the mock for a different error message (optional)
    alertSpy.mockReset();
  
    // Simulate another error related to missing user ID
    (propertyService.getPropertiesByUserId as jest.Mock).mockReturnValueOnce(throwError(() => new Error('User ID is missing!')));
    
    // Call the method again
    component.loadPropertiesWithImages();
  
    // Verify that the correct alert message for missing user ID is triggered
    expect(alertSpy).toHaveBeenCalledWith('User ID is missing!');
  });

  it('should update user profile on save', () => {
    component.onSave();
    expect(authService.updateUser).toHaveBeenCalledWith('', {
      userId: '',
      name: '',
      email: '',
      phoneNumber: '',
    });
  });

  // it('should handle error when updating user profile', () => {
  //   (authService.updateUser as jest.Mock).mockReturnValueOnce(throwError(() => new Error('Update error')));
  //   const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  //   component.onSave();
  //   expect(alertSpy).toHaveBeenCalledWith('Failed to update profile. Please ensure all fields are correct.');
  // });

  it('should delete user profile', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onDelete();
    expect(userService.deleteUser).toHaveBeenCalledWith('');
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  // it('should handle error when deleting user profile', () => {
  //   (userService.deleteUser as jest.Mock).mockReturnValueOnce(throwError(() => new Error('Deletion error')));
  //   const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  //   component.onDelete();
  //   expect(alertSpy).toHaveBeenCalledWith('Failed to delete profile. Please ensure all fields are correct.');
  // });

  it('should logout the user', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.onLogout();
    expect(userService.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should change active section to properties', () => {
    component.showProperties();
    expect(component.activeSection).toBe('properties');
  });

  it('should handle show properties when loading is already in progress', () => {
    component.isLoadingProperties = true;
    component.showProperties();
    expect(component.activeSection).toBe('properties');
  });

  it('should validate email format', () => {
    expect(component.isEmailValid('test@example.com')).toBe(true);
    expect(component.isEmailValid('invalid-email')).toBe(false);
  });

  it('should validate phone number format', () => {
    expect(component.isPhoneNumberValid('1234567890')).toBe(true);
    expect(component.isPhoneNumberValid('12345')).toBe(false);
  });

  it('should sanitize input value', () => {
    expect(component.sanitizeInput('   Hello   ')).toBe('Hello');
    expect(component.sanitizeInput('  Test  ')).toBe('Test');
  });

  it('should handle case when imageUrls are empty', () => {
    const result = component.extractAndDecodeImages('');
    expect(result).toEqual([]);
  });

  // it('should handle case when imageUrls are invalid JSON', () => {
  //   const result = component.extractAndDecodeImages('invalidJson');
  //   expect(result).toEqual([]);
  // });

  it('should extract and decode image URLs', () => {
    const result = component.extractAndDecodeImages('["image1", "image2"]');
    expect(result).toEqual(['data:image/jpeg;base64,image1', 'data:image/jpeg;base64,image2']);
  });
});
