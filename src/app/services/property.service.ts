import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyListing } from '../models/property.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl = environment.apiUrl;
  constructor( private http: HttpClient ) { }

  // public getProperties() : Observable<PropertyListing[]> {
  //   return this.http.get<PropertyListing[]>(this.apiUrl);
  // }
  public getPaginatedProperties(page: number, pageSize: number, filters?: any): Observable<any> {
    const params: any = { page, pageSize, ...filters };
    return this.http.get<any>(`${this.apiUrl}/paginated`, { params });
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
