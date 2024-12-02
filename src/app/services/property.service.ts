import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyListing } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl = 'http://localhost:5047/api/PropertyListings';
  constructor( private http: HttpClient ) { }

  public getProperties() : Observable<PropertyListing[]> {
    return this.http.get<PropertyListing[]>(this.apiUrl);
  }

  public createProperty(property: PropertyListing) : Observable<any> {
    return this.http.post<PropertyListing>(this.apiUrl, property);
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
}
