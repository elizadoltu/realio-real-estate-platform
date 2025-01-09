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
import { LoginComponent } from './app/components/user/login/login.component';
import { AuthService } from './app/services/auth.service';
import { LandingComponent } from './app/components/home/landing/landing.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EditPropertyComponent } from './app/components/user/edit-property/edit-property.component';

@NgModule({

    imports: [
        BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes),
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        LoginComponent,
        LandingComponent,
        EditPropertyComponent,
        
    ],
    providers: [
        provideHttpClient(),
        PropertyService,
        AuthService,
        provideHttpClientTesting()
    ],
    })
export class AppModule { }