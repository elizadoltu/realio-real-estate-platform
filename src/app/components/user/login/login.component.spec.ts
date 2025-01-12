// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { LoginComponent } from './login.component';
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

describe('LoginComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, LoginComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).overrideComponent(LoginComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
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

  it('should run #onSubmit()', async () => {
    component.authService = component.authService || {};
    component.authService.login = jest.fn().mockReturnValue(observableOf({
      token: {}
    }));
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.onSubmit({
      email: {},
      password: {}
    });
    // expect(component.authService.login).toHaveBeenCalled();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateHome()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateHome();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToRegister()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToRegister();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToExplore()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToExplore();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToLogin()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToLogin();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToSearch()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToSearch();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

});