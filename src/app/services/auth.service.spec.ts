import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockToken = 'fakeToken123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage getItem to return a fake token for authentication tests
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);
  });

  afterEach(() => {
    httpMock.verify();
    
  });

  describe('login', () => {
    it('should successfully login and return response', () => {
      const mockLoginResponse = { token: mockToken };
      const loginData = { email: 'test@example.com', password: 'password123' };

      service.login(loginData).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockLoginResponse);
    });

    it('should handle login failure and throw an error', () => {
      const loginData = { email: 'test@example.com', password: 'wrongpassword' };
      const errorResponse = { message: 'Login failed' };

      service.login(loginData).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.message).toBe('Login failed. Please try again.');
        },
      });

      const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Auth/login');
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('register', () => {
    it('should successfully register and return response', () => {
      const mockRegisterResponse = { message: 'Registration successful' };
      const registerData = { name: 'John', phoneNumber: '1234567890', email: 'john@example.com', password: 'password123' };

      service.register(registerData).subscribe((response) => {
        expect(response).toEqual(mockRegisterResponse);
      });

      const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockRegisterResponse);
    });

    it('should handle registration failure and throw an error', () => {
      const registerData = { name: 'John', phoneNumber: '1234567890', email: 'john@example.com', password: 'password123' };
      const errorResponse = { message: 'Registration failed' };

      service.register(registerData).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.message).toBe('Registration failed. Please try again.');
        },
      });

      const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Auth/register');
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateUser', () => {
    it('should successfully update user data', () => {
      const mockUserUpdateResponse = { userId: '1', name: 'John Doe' };
      const userId = '1';
      const userData = { name: 'John Doe' };

      service.updateUser(userId, userData).subscribe((response) => {
        expect(response).toEqual(mockUserUpdateResponse);
      });

      const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Users/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(userData);
      req.flush(mockUserUpdateResponse);
    });

    it('should handle update failure and throw an error', () => {
      const userId = '1';
      const userData = { name: 'John Doe' };
      const errorResponse = { message: 'Update failed' };

      service.updateUser(userId, userData).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.message).toBe('Failed to update user.');
        },
      });

      const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Users/1');
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('makeAuthenticatedRequest', () => {
    it('should successfully make a GET request with auth token', () => {
      const mockResponse = { data: 'some data' };
      const endpoint = 'https://abundant-reflection-production.up.railway.app/api/Users/1';

      service.makeAuthenticatedRequest(endpoint, 'GET').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(endpoint);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockResponse);
    });

    it('should handle error for missing auth token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      expect(() => service.makeAuthenticatedRequest('https://example.com', 'GET')).toThrowError(
        'No authentication token found'
      );
    });
  });

  describe('getAuthToken', () => {
    it('should return the auth token from localStorage', () => {
      const token = service.getAuthToken();
      expect(token).toBe(mockToken);
    });

    it('should return null if there is no token in localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      const token = service.getAuthToken();
      expect(token).toBeNull();
    });
  });
});
