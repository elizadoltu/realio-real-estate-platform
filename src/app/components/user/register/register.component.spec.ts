import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create a mock router object
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule, CommonModule],
      providers: [
        { provide: Router, useValue: mockRouter } 
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit and log the values when form is submitted', () => {
    spyOn(console, 'log'); 

    // Set some form data
    component.fullName = 'John Doe';
    component.phoneNumber = '1234567890';
    component.email = 'john.doe@example.com';
    component.password = 'password123';

    component.onSubmit();

    expect(console.log).toHaveBeenCalledWith('Full Name:', 'John Doe');
    expect(console.log).toHaveBeenCalledWith('Phone Number:', '1234567890');
    expect(console.log).toHaveBeenCalledWith('Email:', 'john.doe@example.com');
    expect(console.log).toHaveBeenCalledWith('Password:', 'password123');
  });

  it('should navigate to home when navigateHome is called', () => {
    component.navigateHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to login when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to explore when navigateToExplore is called', () => {
    component.navigateToExplore();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/explore']);
  });

  it('should navigate to search when navigateToSearch is called', () => {
    component.navigateToSearch();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search']);
  });

  // it('should scroll to the correct section when scrollToAboutSection is called', () => {
  //   const sectionId = 'aboutSection';
  //   const scrollIntoViewSpy = spyOn(document, 'getElementById').and.returnValue({ scrollIntoView: jasmine.createSpy() });

  //   component.scrollToAboutSection(sectionId);

  //   expect(scrollIntoViewSpy).toHaveBeenCalledWith(sectionId);
  //   expect(scrollIntoViewSpy().scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  // });
});
