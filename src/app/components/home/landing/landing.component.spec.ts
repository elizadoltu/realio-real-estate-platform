import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import Lenis from 'lenis';
import gsap from 'gsap';
import { of } from 'rxjs';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']); 

    await TestBed.configureTestingModule({
      imports: [CommonModule, LandingComponent], 
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }, 
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gsap animations after view init', () => {
    spyOn(gsap, 'from');
    spyOn(gsap, 'to');

    component.ngAfterViewInit();
    expect(gsap.from).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalled();
  });

  it('should initialize Lenis on ngAfterViewInit', () => {
    spyOn(window, 'requestAnimationFrame');
    spyOn(Lenis.prototype, 'on');
    spyOn(Lenis.prototype, 'raf');

    component.ngAfterViewInit();

    expect(Lenis.prototype.on).toHaveBeenCalled();
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should clean up Lenis on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component['lenis']?.destroy).toHaveBeenCalled();
    expect(gsap.ticker.remove).toHaveBeenCalled();
  });

  it('should navigate to the account page', () => {
    component.navigateToAccount();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/account']);
  });

  it('should navigate to the home page', () => {
    component.navigateToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to the explore page', () => {
    component.navigateToExplore();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore']);
  });

  it('should navigate to the login page', () => {
    component.navigateToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to the register page', () => {
    component.navigateToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to the search page', () => {
    component.navigateToSearch();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search']);
  });

  it('should navigate to the post-property page', () => {
    component.navigateToPostProperty();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/post-property']);
  });
});
