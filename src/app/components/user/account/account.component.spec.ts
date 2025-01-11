// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { AccountComponent } from './account.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';

@Injectable()
class MockAuthService {}

@Injectable()
class MockUserService {}

@Injectable()
class MockPropertyService {}

@Injectable()
class MockRouter {
  navigate() {};
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('AccountComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AccountComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService },
        { provide: PropertyService, useClass: MockPropertyService },
        { provide: Router, useClass: MockRouter }
      ]
    }).overrideComponent(AccountComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getRandomImage()', async () => {

    component.getRandomImage();

  });

  it('should run #mapRandomImagesToProperties()', async () => {
    component.properties = component.properties || {};
    component.properties = ['properties'];
    component.getRandomImage = jest.fn();
    component.mapRandomImagesToProperties();
    // expect(component.getRandomImage).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.userService = component.userService || {};
    component.userService.getUserDetails = jest.fn().mockReturnValue(observableOf({}));
    component.ngOnInit();
    // expect(component.userService.getUserDetails).toHaveBeenCalled();
  });

  it('should run #onSave()', async () => {
    component.userDetails = component.userDetails || {};
    component.userDetails.userId = 'userId';
    component.userDetails.name = 'name';
    component.userDetails.email = 'email';
    component.userDetails.phoneNumber = 'phoneNumber';
    component.authService = component.authService || {};
    component.authService.updateUser = jest.fn().mockReturnValue(observableOf({}));
    component.onSave();
    // expect(component.authService.updateUser).toHaveBeenCalled();
  });

  it('should run #onLogout()', async () => {
    component.userService = component.userService || {};
    component.userService.logout = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.onLogout();
    // expect(component.userService.logout).toHaveBeenCalled();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #showProperties()', async () => {
    component.loadProperties = jest.fn();
    component.showProperties();
    // expect(component.loadProperties).toHaveBeenCalled();
  });

  it('should run #loadProperties()', async () => {
    component.userDetails = component.userDetails || {};
    component.userDetails.userId = 'userId';
    component.propertyService = component.propertyService || {};
    component.propertyService.getPropertiesByUserId = jest.fn().mockReturnValue(observableOf({
      isSuccess: {},
      data: {},
      errorMessage: {}
    }));
    component.mapRandomImagesToProperties = jest.fn();
    component.loadProperties();
    // expect(component.propertyService.getPropertiesByUserId).toHaveBeenCalled();
    // expect(component.mapRandomImagesToProperties).toHaveBeenCalled();
  });

  it('should run #onEditProperty()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.onEditProperty({});
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #sanitizeInput()', async () => {

    component.sanitizeInput('value');

  });

  it('should run #isEmailValid()', async () => {

    component.isEmailValid({});

  });

  it('should run #isPhoneNumberValid()', async () => {

    component.isPhoneNumberValid({});

  });

});