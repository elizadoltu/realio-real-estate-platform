import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyListing } from '../models/property.model';
import { environment } from '../../environments/environment';
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

  private apiUrl = "https://abundant-reflection-production.up.railway.app/api/PropertyListings";
  private predictionApiUrl = "https://abundant-reflection-production.up.railway.app/api/PropertyListingPricePrediction"
  constructor( private http: HttpClient, private authService: AuthService ) { }

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
  

  public deleteProperty(id: string) : Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  public updateProperty(id: string, property: PropertyListing) : Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, property);
  }
  public getPropertyById(id: string) : Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  public getPropertiesByUserId(userId: string): Observable<PropertyResponse> {
    const endpoint = `${this.apiUrl}/user/${userId}`;
    return this.http.get<PropertyResponse>(endpoint);
  }

  public generatePricePrediction(
    squareFootage: number,
    numberOfBedrooms: number
  ): Observable<any> {
    const endpoint = `${this.predictionApiUrl}/predict`;
    const body = { squareFootage, numberOfBedrooms };
  
    return this.authService.makeAuthenticatedRequest(endpoint, 'POST', body);
  }
}
