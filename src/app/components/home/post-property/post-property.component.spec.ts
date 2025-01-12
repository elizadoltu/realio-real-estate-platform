// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PostPropertyComponent } from './post-property.component';
import { FormBuilder } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Injectable()
class MockPropertyService {}

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

describe('PostPropertyComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PostPropertyComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PropertyService, useClass: MockPropertyService },
        { provide: Router, useClass: MockRouter },
        Location,
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).overrideComponent(PostPropertyComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PostPropertyComponent);
    component = fixture.debugElement.componentInstance;
    
    // Mock the propertyForm setup after component is created
    component.propertyForm = {
      invalid: false,  // Mocking the invalid property
      controls: {},
      get: jest.fn().mockReturnValue({ errors: {}, valid: true }),
      value: {
        imageUrls: {}
      }
    };
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.authService = component.authService || {};
    component.authService.getAuthToken = jest.fn();
    component.propertyForm = component.propertyForm || {};
    component.propertyForm.controls = {
      'userId': {
        setValue: function() {}
      }
    };
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.ngOnInit();
    // expect(component.authService.getAuthToken).toHaveBeenCalled();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #goBack()', async () => {
    component.location = component.location || {};
    component.location.back = jest.fn();
    component.goBack();
    // expect(component.location.back).toHaveBeenCalled();
  });

  it('should run #fetchPredictedPrice()', async () => {
    component.propertyForm = component.propertyForm || {};
    component.propertyForm.controls = {
      'squareFootage': {
        value: {}
      },
      'numberOfBedrooms': {
        value: {}
      }
    };
    component.propertyService = component.propertyService || {};
    component.propertyService.generatePricePrediction = jest.fn().mockReturnValue(observableOf({}));
    component.fetchPredictedPrice();
    // expect(component.propertyService.generatePricePrediction).toHaveBeenCalled();
  });

  it('should run #onFileSelected()', async () => {
    component.uploadedPhotos = component.uploadedPhotos || {};
    component.uploadedPhotos.push = jest.fn();
    component.base64Images = component.base64Images || {};
    component.base64Images.push = jest.fn();
    component.onFileSelected({
      target: {
        files: {}
      }
    });
    // expect(component.uploadedPhotos.push).toHaveBeenCalled();
    // expect(component.base64Images.push).toHaveBeenCalled();
  });

  it('should run #onDeletePhoto()', async () => {
    component.uploadedPhotos = component.uploadedPhotos || {};
    component.uploadedPhotos.indexOf = jest.fn();
    component.uploadedPhotos.splice = jest.fn();
    component.base64Images = component.base64Images || {};
    component.base64Images.splice = jest.fn();
    component.onDeletePhoto({});
    // expect(component.uploadedPhotos.indexOf).toHaveBeenCalled();
    // expect(component.uploadedPhotos.splice).toHaveBeenCalled();
    // expect(component.base64Images.splice).toHaveBeenCalled();
  });

  it('should run #onSubmit()', async () => {
    component.propertyForm = component.propertyForm || {};
    component.propertyForm.invalid = 'invalid';
    component.propertyForm.controls = 'controls';
    component.propertyForm.get = jest.fn().mockReturnValue({
      errors: {},
      valid: {}
    });
    component.propertyForm.value = {
      imageUrls: {}
    };
    component.propertyService = component.propertyService || {};
    component.propertyService.createProperty = jest.fn().mockReturnValue(observableOf({}));
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.onSubmit();
    // expect(component.propertyForm.get).toHaveBeenCalled();
    // expect(component.propertyService.createProperty).toHaveBeenCalled();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #capitalizeFirstLetter()', async () => {
    const result = component.capitalizeFirstLetter("test string");
    expect(result).toBe("Test String");
  });

});