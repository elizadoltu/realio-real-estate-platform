import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountComponent } from './account.component';
import { UserService } from '../../../services/user.service';
import { of, throwError } from 'rxjs';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AccountComponent],
      providers: [UserService],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  afterEach(() => {
    localStorage.clear(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    // it('should fetch user details if the token exists', () => {
    //   const mockToken = btoa(JSON.stringify({ userId: 123 }));
    //   const mockUserDetails = { id: 123, name: 'Test User' };

    //   localStorage.setItem('authToken', mockToken);

    //   spyOn(userService, 'getUserDetails').and.returnValue(of(mockUserDetails)); 

    //   component.ngOnInit();

    //   expect(userService.getUserDetails).toHaveBeenCalled();
    //   expect(component.userDetails).toEqual(mockUserDetails);
    //   expect(localStorage.getItem('userDetails')).toBe(JSON.stringify(mockUserDetails));
    // });

    it('should show an error if fetching user details fails', () => {
      const mockToken = btoa(JSON.stringify({ userId: 123 }));

      localStorage.setItem('authToken', mockToken);

      spyOn(userService, 'getUserDetails').and.returnValue(throwError(() => new Error('Error fetching data')));
      spyOn(window, 'alert'); 

      component.ngOnInit();

      expect(userService.getUserDetails).toHaveBeenCalled();
      expect(component.userDetails).toBeNull();
      expect(window.alert).toHaveBeenCalledWith('Error fetching user details');
    });

    it('should alert and log an error if no auth token is found', () => {
      spyOn(console, 'error'); 
      spyOn(window, 'alert'); 

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('No auth token found');
      expect(window.alert).toHaveBeenCalledWith('No authentication token found');
    });
  });

  describe('logout', () => {
    it('should clear all localStorage items and alert the user', () => {
      localStorage.setItem('authToken', 'testToken');
      localStorage.setItem('email', 'test@example.com');
      localStorage.setItem('password', 'testPassword');
      localStorage.setItem('userDetails', JSON.stringify({ name: 'Test User' }));

      spyOn(window, 'alert'); 

      component.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('email')).toBeNull();
      expect(localStorage.getItem('password')).toBeNull();
      expect(localStorage.getItem('userDetails')).toBeNull();
      expect(window.alert).toHaveBeenCalledWith('You have been logged out');
    });
  });
});
