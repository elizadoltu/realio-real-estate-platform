import { Routes } from '@angular/router';
import { CreatePropertyComponent } from './app/components/property-listings/create-property/create-property.component';
import { DeletePropertyComponent } from './app/components/property-listings/delete-property/delete-property.component';
import { AllPropertiesComponent } from './app/components/property-listings/all-properties/all-properties.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/property-listings', pathMatch: 'full' },
    { path: 'property-listings/create-property', component: CreatePropertyComponent },
    { path: 'property-listings/delete-property', component: DeletePropertyComponent },
    { path: 'property-listings', component: AllPropertiesComponent }
]