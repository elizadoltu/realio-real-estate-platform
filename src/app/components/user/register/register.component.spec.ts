import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NavigationStart, RouterEvent } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      register: jasmine.createSpy('register').and.returnValue(of(true))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
      events: of(new NavigationStart(0, '/register'))
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error message if all fields are not filled', () => {
    component.fullName = '';
    component.email = '';
    component.phoneNumber = '';
    component.password = '';
    component.onSubmit();
    expect(component.errorMessage).toBe('All fields are required.');
  });

  it('should display an error message for an invalid phone number', () => {
    component.fullName = 'John Doe';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.phoneNumber = '12345'; // Invalid phone number
    component.onSubmit();
    expect(component.errorMessage).toBe('Phone number must contain 10 to 15 digits.');
  });

  it('should display an error message for an invalid email', () => {
    component.fullName = 'John Doe';
    component.email = 'invalid-email';
    component.phoneNumber = '1234567890';
    component.password = 'password123';
    component.onSubmit();
    expect(component.errorMessage).toBe('Invalid email address.');
  });

  it('should display an error message for an invalid password', () => {
    component.fullName = 'John Doe';
    component.email = 'test@example.com';
    component.phoneNumber = '1234567890';
    component.password = 'short'; // Invalid password
    component.onSubmit();
    expect(component.errorMessage).toBe('Password must be at least 8 characters long.');
  });

  it('should successfully submit the form and navigate to login on successful registration', fakeAsync(() => {
    component.fullName = 'John Doe';
    component.phoneNumber = '1234567890';
    component.email = 'john.doe@example.com';
    component.password = 'password123';

    component.onSubmit();
    tick(); // Simulate async passage of time

    expect(authServiceMock.register).toHaveBeenCalledWith({
      fullName: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should call window.scrollTo with correct coordinates', () => {
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
  
  it('should not call register if validation fails', () => {
    component.fullName = '';
    component.email = 'invalid-email';
    component.phoneNumber = '123'; 
    component.password = '';
    component.onSubmit();
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });
});
