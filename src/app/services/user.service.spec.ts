import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { HttpHeaders } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUserDetails', () => {
    it('should throw an error if no auth token is found', () => {
      expect(() => service.getUserDetails()).toThrowError('No authentication token found');
    });

    it('should throw an error if the token is invalid', () => {
      localStorage.setItem('authToken', 'invalidToken'); 

      expect(() => service.getUserDetails()).toThrowError('Invalid token or missing user ID');
    });

    it('should throw an error if the user ID is missing in the token', () => {
      const invalidToken = btoa(JSON.stringify({})); 
      localStorage.setItem('authToken', invalidToken);

      expect(() => service.getUserDetails()).toThrowError('User ID not found in the token');
    });

    // it('should make a GET request to the API with the correct headers', () => {
    //   const token = btoa(JSON.stringify({ userId: 123 })); 
    //   localStorage.setItem('authToken', token);

    //   service.getUserDetails().subscribe((response) => {
    //     expect(response).toEqual({ id: 123, name: 'Test User' });
    //   });

    //   const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Users/123');
    //   expect(req.request.method).toBe('GET');
    //   expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    //   expect(req.request.headers.get('Content-Type')).toBe('application/json');

    //   req.flush({ id: 123, name: 'Test User' });
    // });
  });

  describe('logout', () => {
    it('should remove authToken and userDetails from localStorage', () => {
      localStorage.setItem('authToken', 'testToken');
      localStorage.setItem('userDetails', JSON.stringify({ name: 'Test User' }));

      service.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('userDetails')).toBeNull();
    });

    it('should alert the user when logging out', () => {
      spyOn(window, 'alert'); 

      service.logout();

      expect(window.alert).toHaveBeenCalledWith('You have been logged out');
    });
  });
});
