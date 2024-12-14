import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private loginUrl = 'https://abundant-reflection-production.up.railway.app/api/Auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    return this.http.post<any>(this.loginUrl, body, { headers }).pipe(
      tap(response => {
        console.log('API response:', response);
      })
    );
  }
    

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
  

  makeAuthenticatedRequest(endpoint: string, method: string = 'GET', body: any = null): Observable<Object> {
    const token = this.getAuthToken();

    if (!token) {
      console.error('No token available');
      return throwError(() => new Error('No authentication token found'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
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
      return throwError(() => new Error('Unsupported HTTP method.'));
    }
  }
}
