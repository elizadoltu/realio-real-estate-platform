import { Routes } from '@angular/router';
// import { CreatePropertyComponent } from './app/components/property-listings/create-property/create-property.component';
// import { DeletePropertyComponent } from './app/components/property-listings/delete-property/delete-property.component';
// import { UpdatePropertyComponent } from './app/components/property-listings/update-property/update-property.component';
// import { AllPropertiesComponent } from './app/components/property-listings/all-properties/all-properties.component';
// import { GetByIdComponent } from './app/components/property-listings/get-by-id/get-by-id.component';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/components/user/login/login.component';
import { RegisterComponent } from './app/components/user/register/register.component';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', component: AppComponent },
    // { path: 'property-listings/create-property', component: CreatePropertyComponent },
    // { path: 'property-listings/delete-property', component: DeletePropertyComponent },
    // { path: 'property-listings/update-property', component: UpdatePropertyComponent },
    // { path: 'property-listings', component: AllPropertiesComponent },
    // { path: 'property-listings/get-by-id', component: GetByIdComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
]