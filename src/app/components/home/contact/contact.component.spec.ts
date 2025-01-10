import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ContactComponent } from './contact.component';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

// Mock the AuthService
class MockAuthService {
  getAuthToken() {
    return 'dummy-token'; // return a dummy value
  }
}

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ContactComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService }, // use the mocked service
        { provide: Router, useValue: mockRouter } // use the mock Router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to post-property page when navigateToPostProperty is called', () => {
    component.navigateToPostProperty();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/post-property']);
  });

  it('should navigate to search page when navigateToSearch is called', () => {
    component.navigateToSearch();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search']);
  });

  it('should navigate to explore page when navigateToExplore is called', () => {
    component.navigateToExplore();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore']);
  });

  it('should navigate to register page when navigateToRegister is called', () => {
    component.navigateToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to account page when navigateToAccount is called', () => {
    component.navigateToAccount();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/account']);
  });

  it('should navigate to login page when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to home page when navigateToHome is called', () => {
    component.navigateToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
