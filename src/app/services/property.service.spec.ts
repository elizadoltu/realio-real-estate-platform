// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { PropertyService } from './property.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockAuthService {}

describe('PropertyService', () => {
  let service;

  beforeEach(() => {
    service = new PropertyService({}, {});
  });

  it('should run #getPaginatedProperties()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPaginatedProperties({}, {}, {});
    // expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #createProperty()', async () => {
    service.authService = service.authService || {};
    service.authService.makeAuthenticatedRequest = jest.fn();
    service.createProperty({});
    // expect(service.authService.makeAuthenticatedRequest).toHaveBeenCalled();
  });

  it('should run #searchClientInquiries()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.searchClientInquiries({});
    // expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #deleteProperty()', async () => {
    service.authService = service.authService || {};
    service.authService.makeAuthenticatedRequest = jest.fn();
    service.deleteProperty({});
    // expect(service.authService.makeAuthenticatedRequest).toHaveBeenCalled();
  });

  it('should run #updateProperty()', async () => {
    service.authService = service.authService || {};
    service.authService.makeAuthenticatedRequest = jest.fn();
    service.updateProperty({}, {}, {});
    // expect(service.authService.makeAuthenticatedRequest).toHaveBeenCalled();
  });

  it('should run #getPropertyById()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPropertyById({});
    // expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getPropertiesByUserId()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getPropertiesByUserId({});
    // expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #generatePricePrediction()', async () => {
    service.authService = service.authService || {};
    service.authService.makeAuthenticatedRequest = jest.fn();
    service.generatePricePrediction({}, {});
    // expect(service.authService.makeAuthenticatedRequest).toHaveBeenCalled();
  });

});