import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, LoginComponent],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should store token and navigate to home on successful login', () => {
      const mockResponse = { token: 'mock-token' };
      spyOn(authService, 'login').and.returnValue(of(mockResponse));
      spyOn(localStorage, 'setItem');

      const formData = { email: 'test@example.com', password: 'password123' };

      component.onSubmit(formData);

      expect(authService.login).toHaveBeenCalledWith(formData);
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('email', formData.email);
      expect(localStorage.setItem).toHaveBeenCalledWith('password', formData.password);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should log error if login fails', () => {
      spyOn(authService, 'login').and.returnValue(throwError(() => new Error('Login failed')));
      spyOn(console, 'error');

      const formData = { email: 'test@example.com', password: 'password123' };

      component.onSubmit(formData);

      expect(authService.login).toHaveBeenCalledWith(formData);
      expect(console.error).toHaveBeenCalledWith('Login failed', jasmine.any(Error));
    });

    it('should not call login if email or password is missing', () => {
      spyOn(authService, 'login');

      const formData = { email: '', password: '' };

      component.onSubmit(formData);

      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('Navigation methods', () => {
    it('should navigate to home when navigateHome is called', () => {
      component.navigateHome();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should navigate to register when navigateToRegister is called', () => {
      component.navigateToRegister();
      expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('should navigate to explore when navigateToExplore is called', () => {
      component.navigateToExplore();
      expect(router.navigate).toHaveBeenCalledWith(['/explore']);
    });

    it('should navigate to login when navigateToLogin is called', () => {
      component.navigateToLogin();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to search when navigateToSearch is called', () => {
      component.navigateToSearch();
      expect(router.navigate).toHaveBeenCalledWith(['/search']);
    });
  });

  describe('scrollToAboutSection', () => {
    it('should scroll to the specified section', () => {
      const mockElement = document.createElement('div');
      mockElement.scrollIntoView = jasmine.createSpy('scrollIntoView');
      spyOn(document, 'getElementById').and.returnValue(mockElement);

      component.scrollToAboutSection('about-section');

      expect(document.getElementById).toHaveBeenCalledWith('about-section');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    it('should do nothing if the section is not found', () => {
      spyOn(document, 'getElementById').and.returnValue(null);

      component.scrollToAboutSection('about-section');

      expect(document.getElementById).toHaveBeenCalledWith('about-section');
    });
  });
});
