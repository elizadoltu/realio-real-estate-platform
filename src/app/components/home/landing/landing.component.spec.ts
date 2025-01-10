import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';
import { of } from 'rxjs';

class MockAuthService {
  getAuthToken() {
    return 'dummy-token'; // return a dummy value
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let router: MockRouter;
  let authService: MockAuthService;

  beforeEach(async () => {
    router = new MockRouter();
    authService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [CommonModule, ContactComponent, LandingComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService }
      ]
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

  it('should navigate to the correct route when navigateToAccount is called', () => {
    component.navigateToAccount();
    expect(router.navigate).toHaveBeenCalledWith(['/account']);
  });

  it('should navigate to the correct route when navigateToHome is called', () => {
    component.navigateToHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to the correct route when navigateToExplore is called', () => {
    component.navigateToExplore();
    expect(router.navigate).toHaveBeenCalledWith(['/explore']);
  });

  it('should navigate to the correct route when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to the correct route when navigateToRegister is called', () => {
    component.navigateToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to the correct route when navigateToSearch is called', () => {
    component.navigateToSearch();
    expect(router.navigate).toHaveBeenCalledWith(['/search']);
  });

  it('should navigate to the correct route when navigateToPostProperty is called', () => {
    component.navigateToPostProperty();
    expect(router.navigate).toHaveBeenCalledWith(['/post-property']);
  });

  // Test if gsap and Lenis are properly called when component initializes
  // it('should call gsap from method on ngAfterViewInit', () => {
  //   spyOn(gsap, 'from');
  //   spyOn(gsap, 'to');
  //   component.ngAfterViewInit();
  //   expect(gsap.from).toHaveBeenCalled();
  //   expect(gsap.to).toHaveBeenCalled();
  // });


});
