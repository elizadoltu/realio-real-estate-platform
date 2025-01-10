import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';  // Correct import
import { of, throwError } from 'rxjs';

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
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUserDetails', () => {
    // it('should return user details if token is valid', () => {
    //   const mockUserDetails = { userId: '1', name: 'John Doe', email: 'john@example.com' };
    //   const mockToken = 'validToken';
    //   spyOn(localStorage, 'getItem').and.returnValue(mockToken);
    //   spyOn(jwtDecode, 'jwtDecode').and.returnValue({ nameid: '1' });  // Mocked correctly

    //   service.getUserDetails().subscribe((data) => {
    //     expect(data).toEqual(mockUserDetails);
    //   });

    //   const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Users/1');
    //   expect(req.request.method).toBe('GET');
    //   req.flush(mockUserDetails);
    // });

    it('should throw an error if token is not found', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      expect(() => service.getUserDetails()).toThrowError('No authentication token found');
    });

    // it('should throw an error if token is invalid or missing user ID', () => {
    //   const invalidToken = 'invalidToken';
    //   spyOn(localStorage, 'getItem').and.returnValue(invalidToken);
    //   spyOn(jwtDecode, 'jwtDecode').and.throwError('Invalid token');

    //   expect(() => service.getUserDetails()).toThrowError('Invalid token or missing user ID');
    // });

    // it('should include the authorization header when making the request', () => {
    //   const mockUserDetails = { userId: '1', name: 'John Doe', email: 'john@example.com' };
    //   const mockToken = 'validToken';
    //   spyOn(localStorage, 'getItem').and.returnValue(mockToken);
    //   spyOn(jwtDecode, 'jwtDecode').and.returnValue({ nameid: '1' });

    //   service.getUserDetails().subscribe((data) => {
    //     expect(data).toEqual(mockUserDetails);
    //   });

    //   const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Users/1');
    //   expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    //   req.flush(mockUserDetails);
    // });
  });

  describe('getUserDetailsById', () => {
    it('should return user details by id', () => {
      const mockUserDetails = { userId: '1', name: 'John Doe', email: 'john@example.com' };

      service.getUserDetailsById('1').subscribe((data) => {
        expect(data).toEqual(mockUserDetails);
      });

      const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUserDetails);
    });
  });

  describe('logout', () => {
    it('should remove authToken and other localStorage items', () => {
      spyOn(localStorage, 'removeItem');

      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('email');
      expect(localStorage.removeItem).toHaveBeenCalledWith('password');
      expect(localStorage.removeItem).toHaveBeenCalledWith('userDetails');
    });
  });
});
