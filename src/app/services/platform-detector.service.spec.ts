// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { PlatformDetectorService } from './platform-detector.service';
import { PLATFORM_ID } from '@angular/core';

describe('PlatformDetectorService', () => {
  let service;

  beforeEach(() => {
    service = new PlatformDetectorService({});
  });

  it('should run #isBrowser()', async () => {

    service.isBrowser();

  });

});