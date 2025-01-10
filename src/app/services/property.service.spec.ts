import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PropertyService } from './property.service';
import { PropertyListing } from '../models/property.model';
import { AuthService } from './auth.service'; // Import AuthService
import { of } from 'rxjs';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  const apiUrl = 'https://abundant-reflection-production.up.railway.app/api/PropertyListings';

  beforeEach(() => {
    // Mock AuthService to return a fake token and add makeAuthenticatedRequest
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAuthToken', 'makeAuthenticatedRequest']);
    authServiceMock.getAuthToken.and.returnValue('fake-auth-token'); // Provide a fake token
    authServiceMock.makeAuthenticatedRequest.and.returnValue(of({})); // Mock the function call to return an empty object

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PropertyService,
        { provide: AuthService, useValue: authServiceMock }, // Use the mocked AuthService
      ],
    });
    service = TestBed.inject(PropertyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a property', () => {
    const newProperty: PropertyListing = {
      title: 'Large Family Home',
      address: '789 Pine Blvd',
      type: 'House',
      price: 350000,
      squareFootage: 1800,
      numberOfBedrooms: 4,
      numberOfBathrooms: 3,
      description: 'A large family home',
      status: 'Available',
      listingDate: '2024-12-05',
      imageURLs: 'http://example.com/image3.jpg',
      userID: 'user123',
    };

    service.createProperty(newProperty).subscribe(response => {
      expect(response).toEqual({}); // Expecting an empty object
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProperty);
    req.flush({});
  });

  it('should delete a property', () => {
    const propertyId = '1';

    service.deleteProperty(propertyId).subscribe(response => {
      expect(response).toEqual({}); // Expecting an empty object
    });

    const req = httpMock.expectOne(`${apiUrl}/${propertyId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
