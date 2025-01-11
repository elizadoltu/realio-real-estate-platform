// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { PlatformDetectorService } from '../app/services/platform-detector.service';

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockPlatformDetectorService {}

describe('AuthGuard', () => {
  let service;

  beforeEach(() => {
    service = new AuthGuard({}, {});
  });

  it('should run #canActivate()', async () => {
    service.platformDetectorService = service.platformDetectorService || {};
    service.platformDetectorService.isBrowser = jest.fn();
    service.router = service.router || {};
    service.router.navigate = jest.fn();
    service.canActivate();
    // expect(service.platformDetectorService.isBrowser).toHaveBeenCalled();
    // expect(service.router.navigate).toHaveBeenCalled();
  });

});