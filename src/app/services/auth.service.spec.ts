import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of as observableOf, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that there are no outstanding requests after each test
  });

  it('should run #login()', () => {
    const loginData = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { token: 'mockToken' };

    service.login(loginData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should run #register()', () => {
    const registerData = { name: 'John', phoneNumber: '1234567890', email: 'john@example.com', password: 'password123' };
    const mockResponse = { message: 'User registered successfully' };

    service.register(registerData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://abundant-reflection-production.up.railway.app/api/Auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should run #updateUser()', () => {
    const mockResponse = { message: 'User updated successfully' };
    const userData = { name: 'John', email: 'john@example.com' };
    const userId = '123';

    service.updateUser(userId, userData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`https://abundant-reflection-production.up.railway.app/api/Users/${userId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should run #getAuthToken()', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');
    const token = service.getAuthToken();
    expect(token).toBe('mockToken');
  });

  it('should run #makeAuthenticatedRequest() with GET method', () => {
    const mockResponse = { data: 'some data' };
    const endpoint = 'https://example.com/data';
    
    service.makeAuthenticatedRequest(endpoint, 'GET').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(endpoint);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error in #makeAuthenticatedRequest()', () => {
    const errorResponse = { status: 500, statusText: 'Server Error' };
    const endpoint = 'https://example.com/data';

    service.makeAuthenticatedRequest(endpoint, 'GET').subscribe(
      () => fail('expected an error, not data'),
      (error) => {
        expect(error).toBeDefined();
        expect(error.message).toBe('Request failed.');
      }
    );

    const req = httpMock.expectOne(endpoint);
    req.flush('Error', errorResponse);
  });
});
