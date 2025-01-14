import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyListing } from '../models/property.model';
import { AuthService } from './auth.service';

export interface PropertyResponse {
  data: PropertyListing[];
  isSuccess: boolean;
  errorMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private readonly baseUrl = "https://abundant-reflection-production.up.railway.app/api";
  private readonly apiUrl = "https://abundant-reflection-production.up.railway.app/api/PropertyListings";
  private readonly predictionApiUrl = "https://abundant-reflection-production.up.railway.app/api/PropertyListingPricePrediction"
  constructor( private readonly http: HttpClient, private readonly authService: AuthService ) { }

  // public getProperties() : Observable<PropertyListing[]> {
  //   return this.http.get<PropertyListing[]>(this.apiUrl);
  // }
  public getPaginatedProperties(page: number, pageSize: number, filters?: any): Observable<any> {
    const params: any = { page, pageSize, ...filters };
    return this.http.get<any>(`${this.apiUrl}/paginated`, { params });
  }

  public createProperty(property: PropertyListing): Observable<any> {
    const endpoint = this.apiUrl; 
    const method = 'POST'; 
    return this.authService.makeAuthenticatedRequest(endpoint, method, property); 
  }

  public searchClientInquiries(searchTerm: string) : Observable<any> {
    const endpoint = 'https://abundant-reflection-production.up.railway.app/api/ClientInquiries';
    const url = `${endpoint}/search?searchQuery=${encodeURIComponent(searchTerm)}`;
    return this.http.get<any>(url);
  }
  

  public deleteProperty(id: string) : Observable<any> {
    const endpoint = `${this.apiUrl}/${id}`;
    const method = 'DELETE';
    return this.authService.makeAuthenticatedRequest(endpoint, method, id);
  }

  public updateProperty(id: string, property: PropertyListing, userID: string) : Observable<any> {
    const endpoint = `${this.apiUrl}/${id}`;
    const method = 'PUT';
    const listingDate = new Date().toISOString();
    const status = 'available'
    const updatedProperty = {
      ...property, 
      propertyId: id, 
      listingDate,
      status,
      userID, 
  };
  console.log(updatedProperty);
    return this.authService.makeAuthenticatedRequest(endpoint, method, updatedProperty);
  }
  public getPropertyById(id: string) : Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  public getPropertiesByUserId(userId: string): Observable<PropertyResponse> {
    const endpoint = `${this.apiUrl}/user/${userId}`;
    return this.http.get<PropertyResponse>(endpoint);
  }

  getTransactionsByBuyerId(buyerId: string, page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}/Transactions/buyer/${buyerId}?page=${page}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

  public generatePricePrediction(
    squareFootage: number,
    numberOfBedrooms: number
  ): Observable<any> {
    const endpoint = `${this.predictionApiUrl}/predict`;
    const body = { 
      label: 0, 
      features: [numberOfBedrooms, squareFootage] 
    };
  
    return this.authService.makeAuthenticatedRequest(endpoint, 'POST', body);
  }
}
