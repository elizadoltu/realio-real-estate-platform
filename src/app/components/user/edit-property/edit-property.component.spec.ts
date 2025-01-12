// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { EditPropertyComponent } from './edit-property.component';
import { FormBuilder } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
class MockPropertyService {}

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

describe('EditPropertyComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, EditPropertyComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: PropertyService, useClass: MockPropertyService },
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
        Location
      ]
    }).overrideComponent(EditPropertyComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(EditPropertyComponent);
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
    component.loadPropertyDetailsWithImages = jest.fn();
    component.ngOnInit();
    // expect(component.loadPropertyDetailsWithImages).toHaveBeenCalled();
  });

  it('should run #loadPropertyDetailsWithImages()', async () => {
    component.propertyService = component.propertyService || {};
    component.propertyService.getPropertyById = jest.fn().mockReturnValue(observableOf({}));
    component.populateForm = jest.fn();
    component.extractAndDecodeImages = jest.fn();
    component.loadPropertyDetailsWithImages();
    // expect(component.propertyService.getPropertyById).toHaveBeenCalled();
    // expect(component.populateForm).toHaveBeenCalled();
    // expect(component.extractAndDecodeImages).toHaveBeenCalled();
  });

  it('should run #populateForm()', async () => {
    component.editPropertyForm = component.editPropertyForm || {};
    component.editPropertyForm.patchValue = jest.fn();
    component.populateForm({
      title: {},
      address: {},
      type: {},
      price: {},
      numberOfBedrooms: {},
      numberOfBathrooms: {},
      squareFootage: {},
      description: {}
    });
    // expect(component.editPropertyForm.patchValue).toHaveBeenCalled();
  });

  it('should run #extractAndDecodeImages()', async () => {

    component.extractAndDecodeImages({});

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

  it('should run #onSaveProperty()', async () => {
    component.editPropertyForm = component.editPropertyForm || {};
    
    // Mocking the form group and its controls
    const mockFormControl = {
      valid: true,  // You can mock valid as a boolean
      value: {
        imageURLs: ['base64Image1']
      }
    };
    
    component.editPropertyForm = mockFormControl as any;  // Casting to any to allow the form control mock
  
    component.property = component.property || {};
    component.property.userID = 'userID';
    
    component.propertyService = component.propertyService || {};
    component.propertyService.updateProperty = jest.fn().mockReturnValue(observableOf({}));
    
    component.onSaveProperty('propertyId');
    
    // Expecting the update property function to be called
    expect(component.propertyService.updateProperty).toHaveBeenCalled();
  });

  it('should run #onDeleteProperty()', async () => {
    component.propertyService = component.propertyService || {};
    component.propertyService.deleteProperty = jest.fn().mockReturnValue(observableOf({}));
    component.goBack = jest.fn();
    component.onDeleteProperty({});
    // expect(component.propertyService.deleteProperty).toHaveBeenCalled();
    // expect(component.goBack).toHaveBeenCalled();
  });

  it('should run #goBack()', async () => {
    component.location = component.location || {};
    component.location.back = jest.fn();
    component.goBack();
    // expect(component.location.back).toHaveBeenCalled();
  });

});