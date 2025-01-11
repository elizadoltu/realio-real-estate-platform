// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockAuthService {}

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

describe('RegisterComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, RegisterComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).overrideComponent(RegisterComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.router = component.router || {};
    component.router.events = observableOf({});
    window.scrollTo = jest.fn();
    component.ngOnInit();
    // expect(window.scrollTo).toHaveBeenCalled();
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

  it('should run #isPasswordValid()', async () => {

    component.isPasswordValid({
      length: {}
    });

  });

  it('should run #onSubmit()', async () => {
    component.sanitizeInput = jest.fn();
    component.isEmailValid = jest.fn();
    component.isPhoneNumberValid = jest.fn();
    component.isPasswordValid = jest.fn();
    component.authService = component.authService || {};
    component.authService.register = jest.fn().mockReturnValue(observableOf({}));
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.onSubmit();
    // expect(component.sanitizeInput).toHaveBeenCalled();
    // expect(component.isEmailValid).toHaveBeenCalled();
    // expect(component.isPhoneNumberValid).toHaveBeenCalled();
    // expect(component.isPasswordValid).toHaveBeenCalled();
    // expect(component.authService.register).toHaveBeenCalled();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateHome()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateHome();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToLogin()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToLogin();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToExplore()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToExplore();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToSearch()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToSearch();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #scrollToAboutSection()', async () => {

    component.scrollToAboutSection({});

  });

});