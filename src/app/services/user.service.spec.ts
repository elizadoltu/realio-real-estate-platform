// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('UserService', () => {
  let service;

  beforeEach(() => {
    service = new UserService({});
  });

  it('should run #getUserDetailsById()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getUserDetailsById({});
    // expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #getUserDetails()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getUserDetails();
    // expect(service.http.get).toHaveBeenCalled();
  });

  it('should run #logout()', async () => {

    service.logout();

  });

});