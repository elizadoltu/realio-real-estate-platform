import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PropertyService } from './property.service';
import { PropertyListing } from '../models/property.model';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5047/api/PropertyListings';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [PropertyService] 
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

  it('should fetch properties from the API', () => {
    const mockProperties: PropertyListing[] = [
      { id: '1',title: 'Large Family Home' , address: '123 Main St', type: 'House', price: 300000, squareFootage: 1500, numberOfBedrooms: 3, numberOfBathrooms: 2, description: 'A beautiful house', status: 'Available', listingDate: '2024-12-01', imageUrls: 'http://example.com/image.jpg' },
      { id: '2', title: 'Family Loft' , address: '456 Oak Ave', type: 'Apartment', price: 200000, squareFootage: 1200, numberOfBedrooms: 2, numberOfBathrooms: 1, description: 'A cozy apartment', status: 'Sold', listingDate: '2024-11-15', imageUrls: 'http://example.com/image2.jpg' }
    ];

    service.getProperties().subscribe(properties => {
      expect(properties.length).toBe(2);
      expect(properties).toEqual(mockProperties);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProperties);
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
      imageUrls: 'http://example.com/image3.jpg',
      userId: 'user123'
    };

    service.createProperty(newProperty).subscribe(response => {
      expect(response).toBeNull(); 
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProperty);
    req.flush(null); 
  });

  it('should delete a property', () => {
    const propertyId = '1';

    service.deleteProperty(propertyId).subscribe(response => {
      expect(response).toBeNull(); 
    });

    const req = httpMock.expectOne(`${apiUrl}/${propertyId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); 
  });
});
