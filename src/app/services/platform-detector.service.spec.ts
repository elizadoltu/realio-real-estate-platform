import { TestBed } from '@angular/core/testing';
import { PlatformDetectorService } from './platform-detector.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('PlatformDetectorService', () => {
  let service: PlatformDetectorService;

 
  const configureTestBed = (platformId: string) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PlatformDetectorService,
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    service = TestBed.inject(PlatformDetectorService);
  };

  it('should be created', () => {
    configureTestBed('browser'); 
    expect(service).toBeTruthy();
  });

  describe('isBrowser', () => {
    it('should return true when platform is browser', () => {
      configureTestBed('browser');
      expect(service.isBrowser()).toBeTrue();
    });

    it('should return false when platform is server', () => {
      configureTestBed('server'); 
      expect(service.isBrowser()).toBeFalse();
    });
  });
});
