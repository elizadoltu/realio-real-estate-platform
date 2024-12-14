import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard'; 
import { PlatformDetectorService } from '../app/services/platform-detector.service'; 

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let platformDetectorServiceSpy: jasmine.SpyObj<PlatformDetectorService>;

  beforeEach(() => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const platformDetectorServiceMock = jasmine.createSpyObj('PlatformDetectorService', ['isBrowser']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerMock },
        { provide: PlatformDetectorService, useValue: platformDetectorServiceMock },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    platformDetectorServiceSpy = TestBed.inject(PlatformDetectorService) as jasmine.SpyObj<PlatformDetectorService>;
  });

  it('should allow activation if on browser and token exists', () => {
    platformDetectorServiceSpy.isBrowser.and.returnValue(true);
    spyOn(localStorage, 'getItem').and.returnValue('validToken');

    const result = authGuard.canActivate();

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login if on browser and no token exists', () => {
    platformDetectorServiceSpy.isBrowser.and.returnValue(true);
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = authGuard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not allow activation if not on a browser', () => {
    platformDetectorServiceSpy.isBrowser.and.returnValue(false);

    const result = authGuard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
