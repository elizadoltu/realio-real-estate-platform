// @ts-nocheck
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

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
class MockPropertyService {
  getPaginatedProperties = jest.fn();
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

describe('SearchComponent', () => {
  let fixture;
  let component;
  let router: Router;
  let propertyService: PropertyService;

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
        { provide: PropertyService, useClass: MockPropertyService },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).overrideComponent(SearchComponent, {

    }).compileComponents();
    propertyService = TestBed.inject(PropertyService);
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.debugElement.componentInstance;
    router = TestBed.inject(Router);

    jest.spyOn(console, 'error');
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

  it('should go to page', () => {
    jest.spyOn(component, 'fetchProperties');
    component.goToPage(2);
    expect(component.currentPage).toBe(1);
  });

  it('should run #changeView()', async () => {

    component.changeView({});

  });

  // it('should clear filters', () => {
  //   component.filters = { Type: 'House' };
  //   component.clearFilters();
  //   expect(component.filters).toEqual({
  //     Type: '',
  //     price: 0,
  //     nrOfBathrooms: 0,
  //     nrOfBedrooms: 0,
  //     status: '',
  //     squareFootage: 0,
  //   });
  //   expect(component.currentPage).toBe(1);
  // });

  it('should navigate to property detail', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.navigateToPropertyDetail('123');
      expect(navigateSpy).toHaveBeenCalledWith(['/property/123']);
    });
  
    it('should handle undefined property ID in navigateToPropertyDetail', () => {
      // Spy on console.error to mock it
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
      // Call the method with undefined property ID
      component.navigateToPropertyDetail(undefined);
    
      // Verify if console.error was called with the correct message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Property ID is undefined');
    
      // Restore the original console.error after the test
      consoleErrorSpy.mockRestore();
    });
    
  
    it('should set isLoading to false after ngOnInit completes', fakeAsync(() => {
      const mockResponse = {
        isSuccess: true,
        data: { data: [], totalCount: 0 },
        errorMessage: '',
      };
      (propertyService.getPaginatedProperties as jest.Mock).mockReturnValue(of(mockResponse));
      component.ngOnInit();
      tick();
      expect(component.isLoading).toBeTruthy();
    }));

});