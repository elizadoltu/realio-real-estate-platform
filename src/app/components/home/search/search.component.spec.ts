// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SearchComponent } from './search.component';
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockRouter {
  navigate() {};
}

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

describe('SearchComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, SearchComponent, HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: PropertyService, useClass: MockPropertyService }
      ]
    }).overrideComponent(SearchComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #toggleFilters()', async () => {

    component.toggleFilters();

  });

  it('should run #applyFilters()', async () => {
    component.fetchProperties = jest.fn();
    component.applyFilters();
    // expect(component.fetchProperties).toHaveBeenCalled();
  });

  it('should run #clearSearch()', async () => {
    component.fetchProperties = jest.fn();
    component.clearSearch();
    // expect(component.fetchProperties).toHaveBeenCalled();
  });

  it('should run #undefined()', async () => {
    // Error: ERROR this JS code is invalid, "response.data.map((property)"
    //     at Util.getFuncReturn (/var/task/lib/util.js:325:13)
    //     at /var/task/lib/util.js:413:30
    //     at Array.forEach (<anonymous>)
    //     at Util.getFuncParamObj (/var/task/lib/util.js:396:26)
    //     at Util.getFuncArguments (/var/task/lib/util.js:347:30)
    //     at Util.getFuncReturn (/var/task/lib/util.js:332:34)
    //     at FuncTestGen.setMockData (/var/task/lib/func-test-gen.js:159:31)
    //     at FuncTestGen.setMockData (/var/task/lib/func-test-gen.js:90:12)
    //     at /var/task/lib/func-test-gen.js:80:14
    //     at Array.forEach (<anonymous>)
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

  it('should run #navigateToExplore()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToExplore();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #navigateToHome()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToHome();
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #getRandomImage()', async () => {

    component.getRandomImage();

  });

  it('should run #preloadImages()', async () => {

    component.preloadImages([{}]);

  });

  it('should run #ngOnInit()', async () => {
    component.preloadImages = jest.fn().mockReturnValue({
      then: function() {
        return {
          catch: function() {
            return {
              finally: function() {}
            };
          }
        };
      }
    });
    component.getRandomImage = jest.fn();
    component.fetchProperties = jest.fn();
    component.ngOnInit();
    // expect(component.preloadImages).toHaveBeenCalled();
    // expect(component.getRandomImage).toHaveBeenCalled();
    // expect(component.fetchProperties).toHaveBeenCalled();
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

  it('should run #undefined()', async () => {
    // Error: ERROR this JS code is invalid, "response.data.data.map((property)"
    //     at Util.getFuncReturn (/var/task/lib/util.js:325:13)
    //     at /var/task/lib/util.js:413:30
    //     at Array.forEach (<anonymous>)
    //     at Util.getFuncParamObj (/var/task/lib/util.js:396:26)
    //     at Util.getFuncArguments (/var/task/lib/util.js:347:30)
    //     at Util.getFuncReturn (/var/task/lib/util.js:332:34)
    //     at FuncTestGen.setMockData (/var/task/lib/func-test-gen.js:159:31)
    //     at FuncTestGen.setMockData (/var/task/lib/func-test-gen.js:90:12)
    //     at /var/task/lib/index.js:188:17
    //     at Array.forEach (<anonymous>)
  });

  it('should run #goToPage()', async () => {
    component.fetchProperties = jest.fn();
    component.goToPage({});
    // expect(component.fetchProperties).toHaveBeenCalled();
  });

  it('should run #changeView()', async () => {

    component.changeView({});

  });

  it('should run #clearFilters()', async () => {
    component.fetchProperties = jest.fn();
    component.clearFilters();
    // expect(component.fetchProperties).toHaveBeenCalled();
  });

  it('should run #navigateToPropertyDetail()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.navigateToPropertyDetail({});
    // expect(component.router.navigate).toHaveBeenCalled();
  });

});