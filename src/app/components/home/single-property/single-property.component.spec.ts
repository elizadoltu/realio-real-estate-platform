// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SinglePropertyComponent } from './single-property.component';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { UserService } from '../../../services/user.service';
import { Location, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockPropertyService {}

@Injectable()
class MockUserService {}

@Injectable()
class MockHttpClient {
  post() {};
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

describe('SinglePropertyComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, SinglePropertyComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        },
        { provide: PropertyService, useClass: MockPropertyService },
        { provide: UserService, useClass: MockUserService },
        Location,
        DatePipe,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    }).overrideComponent(SinglePropertyComponent, {

      set: { providers: [{ provide: DatePipe, useClass: MockDatePipe }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(SinglePropertyComponent);
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
    component.route = component.route || {};
    component.route.snapshot = {
      paramMap: {
        get: function() {}
      }
    };
    component.propertyService = component.propertyService || {};
    component.propertyService.getPropertyById = jest.fn().mockReturnValue(observableOf({}));
    component.userService = component.userService || {};
    component.userService.getUserDetailsById = jest.fn();
    component.ngOnInit();
    // expect(component.propertyService.getPropertyById).toHaveBeenCalled();
    // expect(component.userService.getUserDetailsById).toHaveBeenCalled();
  });

  it('should run #goBack()', async () => {
    component.location = component.location || {};
    component.location.back = jest.fn();
    component.goBack();
    // expect(component.location.back).toHaveBeenCalled();
  });

  it('should run #onBuyAction()', async () => {
    component.property = component.property || {};
    component.property.data = 'data';
    component.http = component.http || {};
    component.http.post = jest.fn().mockReturnValue(observableOf('post'));
    component.onBuyAction();
    // expect(component.http.post).toHaveBeenCalled();
  });

});