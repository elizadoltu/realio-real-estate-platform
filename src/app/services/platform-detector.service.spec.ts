import { TestBed } from '@angular/core/testing';
import { PlatformDetectorService } from './platform-detector.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('PlatformDetectorService', () => {
  let service: PlatformDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlatformDetectorService,
        { provide: PLATFORM_ID, useValue: 'browser' } 
      ],
    });

    service = TestBed.inject(PlatformDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isBrowser', () => {
    it('should return true when platform is browser', () => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' }); 
      service = TestBed.inject(PlatformDetectorService);
      expect(service.isBrowser()).toBeTrue();
    });

    it('should return false when platform is server', () => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' }); 
      service = TestBed.inject(PlatformDetectorService);
      expect(service.isBrowser()).toBeFalse();
    });
  });
});
