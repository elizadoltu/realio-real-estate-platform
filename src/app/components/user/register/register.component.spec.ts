import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationStart } from '@angular/router';

// Mock AuthService
class MockAuthService {
  register = jasmine.createSpy('register').and.returnValue(of({}));
}

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
  events = of(new NavigationStart(0, ''));
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockAuthService = new MockAuthService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize input correctly', () => {
    const sanitizedValue = component.sanitizeInput('  test value  ');
    expect(sanitizedValue).toBe('test value');
  });

  it('should validate email format', () => {
    expect(component.isEmailValid('test@example.com')).toBeTrue();
    expect(component.isEmailValid('invalid-email')).toBeFalse();
  });

  it('should validate phone number format', () => {
    expect(component.isPhoneNumberValid('1234567890')).toBeTrue();
    expect(component.isPhoneNumberValid('12345')).toBeFalse();
  });

  it('should validate password length', () => {
    expect(component.isPasswordValid('password123')).toBeTrue();
    expect(component.isPasswordValid('short')).toBeFalse();
  });

  it('should show error message if form is incomplete', () => {
    component.fullName = '';
    component.phoneNumber = '';
    component.email = '';
    component.password = '';
    component.onSubmit();
    expect(component.errorMessage).toBe('All fields are required.');
  });

  it('should show error message for invalid email', () => {
    component.fullName = 'John Doe';
    component.phoneNumber = '1234567890';
    component.email = 'invalid-email';
    component.password = 'password123';
    component.onSubmit();
    expect(component.errorMessage).toBe('Invalid email address.');
  });

  it('should show error message for invalid phone number', () => {
    component.fullName = 'John Doe';
    component.phoneNumber = '12345';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSubmit();
    expect(component.errorMessage).toBe('Phone number must contain 10 to 15 digits.');
  });

  it('should show error message for short password', () => {
    component.fullName = 'John Doe';
    component.phoneNumber = '1234567890';
    component.email = 'test@example.com';
    component.password = 'short';
    component.onSubmit();
    expect(component.errorMessage).toBe('Password must be at least 8 characters long.');
  });

  it('should call register service and navigate on successful registration', () => {
    component.fullName = 'John Doe';
    component.phoneNumber = '1234567890';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSubmit();
    expect(mockAuthService.register).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error message on registration failure', () => {
    mockAuthService.register = jasmine.createSpy('register').and.returnValue(throwError('Registration failed'));
    component.fullName = 'John Doe';
    component.phoneNumber = '1234567890';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.onSubmit();
    expect(component.errorMessage).toBe('Registration failed. Please try again.');
  });

  it('should navigate to home on navigateHome', () => {
    component.navigateHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to login on navigateToLogin', () => {
    component.navigateToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to explore on navigateToExplore', () => {
    component.navigateToExplore();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore']);
  });

  it('should navigate to search on navigateToSearch', () => {
    component.navigateToSearch();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search']);
  });

});
