import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'https://abundant-reflection-production.up.railway.app/api/Auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  describe('login', () => {
    it('should send a POST request to the login endpoint and return the response', () => {
      const mockData = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { token: 'mockAuthToken' };

      authService.login(mockData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse); 
    });

    it('should handle login errors and throw an error', () => {
      const mockData = { email: 'test@example.com', password: 'wrongpassword' };

      authService.login(mockData).subscribe({
        error: (error) => {
          expect(error.message).toBe('Login failed. Please try again.');
        },
      });

      const req = httpMock.expectOne(`${mockApiUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' }); 
    });
  });

  describe('getAuthToken', () => {
    it('should return the token from localStorage if available', () => {
      spyOn(localStorage, 'getItem').and.returnValue('mockAuthToken');
      const token = authService.getAuthToken();
      expect(token).toBe('mockAuthToken');
    });

    it('should return null if no token is found', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      const token = authService.getAuthToken();
      expect(token).toBeNull();
    });
  });

  describe('makeAuthenticatedRequest', () => {
    it('should throw an error if no token is found', () => {
      spyOn(authService, 'getAuthToken').and.returnValue(null);

      expect(() => authService.makeAuthenticatedRequest('some-endpoint')).toThrowError(
        'No authentication token found'
      );
    });

    it('should make an authenticated GET request', () => {
      const mockResponse = { data: 'mockData' };
      spyOn(authService, 'getAuthToken').and.returnValue('mockAuthToken');

      authService.makeAuthenticatedRequest('some-endpoint').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('some-endpoint');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mockAuthToken');
      req.flush(mockResponse); 
    });

    it('should make an authenticated POST request with a body', () => {
      const mockBody = { key: 'value' };
      const mockResponse = { data: 'mockData' };
      spyOn(authService, 'getAuthToken').and.returnValue('mockAuthToken');

      authService.makeAuthenticatedRequest('some-endpoint', 'POST', mockBody).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('some-endpoint');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mockAuthToken');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse); 
    });

    it('should handle errors in authenticated requests', () => {
      spyOn(authService, 'getAuthToken').and.returnValue('mockAuthToken');

      authService.makeAuthenticatedRequest('some-endpoint').subscribe({
        error: (error) => {
          expect(error.message).toBe('Request failed.');
        },
      });

      const req = httpMock.expectOne('some-endpoint');
      req.flush({ message: 'Request error' }, { status: 500, statusText: 'Internal Server Error' }); 
    });

    it('should throw an error for unsupported HTTP methods', () => {
      spyOn(authService, 'getAuthToken').and.returnValue('mockAuthToken');

      authService.makeAuthenticatedRequest('some-endpoint', 'PUT').subscribe({
        error: (error) => {
          expect(error.message).toBe('Unsupported HTTP method.');
        },
      });
    });
  });
});
