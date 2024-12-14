import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://abundant-reflection-production.up.railway.app/api/Auth';

  constructor(private http: HttpClient) {}

  // Login method that returns the token
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }

  // Method to get the stored auth token from localStorage
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Make authenticated request by including token in headers
  makeAuthenticatedRequest(endpoint: string, method: string = 'GET', body: any = null): Observable<Object> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Add the token in the Authorization header
      'Content-Type': 'application/json',
    });

    const options = { headers };

    if (method === 'GET') {
      return this.http.get(endpoint, options).pipe(
        catchError((error) => {
          console.error('Request failed:', error);
          return throwError(() => new Error('Request failed.'));
        })
      );
    } else if (method === 'POST') {
      return this.http.post(endpoint, body, options).pipe(
        catchError((error) => {
          console.error('Request failed:', error);
          return throwError(() => new Error('Request failed.'));
        })
      );
    } else {
      // Return an observable with an error message if the method is unsupported
      return throwError(() => new Error('Unsupported HTTP method.'));
    }
  }
}
