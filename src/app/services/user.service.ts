import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private apiUrl = 'https://abundant-reflection-production.up.railway.app/api/Users';

    constructor(private http: HttpClient) {}

    getUserDetails(): Observable<any> {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token);  // Log the token for debugging
        if (!token) {
            throw new Error('No authentication token found');
        }
    
        try {
            const decodedToken: any = jwtDecode(token);
            console.log('Decoded token:', decodedToken); 
            const userId = decodedToken.nameid;  
    
            if (!userId) {
                throw new Error('User ID not found in the token');
            }
    
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            });
    
            return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers });
        } catch (error) {
            console.error('Error decoding token:', error);
            throw new Error('Invalid token or missing user ID');
        }
    }
    

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userDetails');
        alert('You have been logged out');
    }
}