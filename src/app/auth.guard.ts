import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PlatformDetectorService } from '../app/services/platform-detector.service'; 

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private platformDetectorService: PlatformDetectorService) {}

  canActivate(): boolean {
    if (this.platformDetectorService.isBrowser()) {
      const token = localStorage.getItem('authToken');
      if (token) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
   
      return false; 
    }
  }
}
