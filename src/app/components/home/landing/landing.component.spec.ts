// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { LandingComponent } from './landing.component';
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

describe('LandingComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, LandingComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).overrideComponent(LandingComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngAfterViewInit()', async () => {

    component.ngAfterViewInit();

  });

  it('should run #ngOnDestroy()', async () => {
    component.lenis = component.lenis || {};
    component.lenis.destroy = jest.fn();
    component.lenis.raf = jest.fn();
    component.ngOnDestroy();
    // expect(component.lenis.destroy).toHaveBeenCalled();
    // expect(component.lenis.raf).toHaveBeenCalled();
  });

  it('should run #navigateToAccount()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToAccount();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToHome()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToHome();
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

  it('should run #navigateToRegister()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToRegister();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToSearch()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToSearch();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToPostProperty()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToPostProperty();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

});