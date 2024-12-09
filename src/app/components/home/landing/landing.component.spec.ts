import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create a mock router object
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        { provide: Router, useValue: mockRouter } 
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call scrollToAboutSection with valid sectionId', () => {
  //   const sectionId = 'aboutSection';
  //   const scrollIntoViewSpy = spyOn(document, 'getElementById').and.returnValue({ scrollIntoView: jasmine.createSpy() });
    
  //   component.scrollToAboutSection(sectionId);

  //   expect(scrollIntoViewSpy).toHaveBeenCalledWith(sectionId);
  //   expect(scrollIntoViewSpy().scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  // });

  it('should navigate to explore', () => {
    component.navigateToExplore();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore']);
  });

  it('should navigate to login', () => {
    component.navigateToLogin();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to register', () => {
    component.navigateToRegister();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to search', () => {
    component.navigateToSearch();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search']);
  });
});
