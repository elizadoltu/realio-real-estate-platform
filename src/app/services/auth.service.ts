import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =
    'https://abundant-reflection-production.up.railway.app/api/Auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Login failed. Please try again.'));
        })
      );
  }

  register(data: { name: string; phoneNumber: string; email: string; password: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((error) => {
          console.error('Registration failed:', error);
          return throwError(() => new Error('Registration failed. Please try again.'));
        })
      );
  }  

  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  makeAuthenticatedRequest(
    endpoint: string,
    method: string = 'GET',
    body: any = null
  ): Observable<Object> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const options = { headers };

    switch (method) {
      case 'GET':
        return this.http.get(endpoint, options).pipe(
          catchError((error) => {
            console.error('Request failed:', error);
            return throwError(() => new Error('Request failed.'));
          })
        );
      case 'POST':
        return this.http.post(endpoint, body, options).pipe(
          catchError((error) => {
            console.error('Request failed:', error);
            return throwError(() => new Error('Request failed.'));
          })
        );
      case 'PUT':
        return this.http.put(endpoint, body, options).pipe(
          catchError((error) => {
            console.error('Request failed:', error);
            return throwError(() => new Error('Request failed.'));
          })
        );
      case 'DELETE':
        return this.http.delete(endpoint, options).pipe(
          catchError((error) => {
            console.error('Request failed:', error);
            return throwError(() => new Error('Request failed.'));
          })
        );
      default:
        return throwError(() => new Error('Unsupported HTTP method.'));
    }
  }
}
