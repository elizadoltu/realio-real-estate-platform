import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PropertyService } from './app/services/property.service';
import { GetByIdComponent } from './app/components/property-listings/get-by-id/get-by-id.component';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes),
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
    ],
    providers: [
        provideHttpClient(),
        PropertyService
    ],
    })
export class AppModule { }