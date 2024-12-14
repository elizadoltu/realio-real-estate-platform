import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LandingComponent } from './landing.component';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, LandingComponent, AuthService, HttpClientModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        AuthService, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
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

  describe('Navigation methods', () => {
    it('should navigate to account when navigateToAccount is called', () => {
      component.navigateToAccount();
      expect(router.navigate).toHaveBeenCalledWith(['/account']);
    });

    it('should navigate to home when navigateToHome is called', () => {
      component.navigateToHome();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should navigate to explore when navigateToExplore is called', () => {
      component.navigateToExplore();
      expect(router.navigate).toHaveBeenCalledWith(['/explore']);
    });

    it('should navigate to login when navigateToLogin is called', () => {
      component.navigateToLogin();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to register when navigateToRegister is called', () => {
      component.navigateToRegister();
      expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('should navigate to search when navigateToSearch is called', () => {
      component.navigateToSearch();
      expect(router.navigate).toHaveBeenCalledWith(['/search']);
    });

    it('should navigate to post-property when navigateToPostProperty is called', () => {
      component.navigateToPostProperty();
      expect(router.navigate).toHaveBeenCalledWith(['/post-property']);
    });
  });
});
