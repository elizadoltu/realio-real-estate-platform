import { Routes } from '@angular/router';
// import { CreatePropertyComponent } from './app/components/property-listings/create-property/create-property.component';
// import { DeletePropertyComponent } from './app/components/property-listings/delete-property/delete-property.component';
// import { UpdatePropertyComponent } from './app/components/property-listings/update-property/update-property.component';
import { AllPropertiesComponent } from './app/components/property-listings/all-properties/all-properties.component';
// import { GetByIdComponent } from './app/components/property-listings/get-by-id/get-by-id.component';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/components/user/login/login.component';
import { RegisterComponent } from './app/components/user/register/register.component';
import { LandingComponent } from './app/components/home/landing/landing.component';
import { SearchComponent } from './app/components/home/search/search.component';
import { ExploreComponent } from './app/components/home/explore/explore.component';
import { AccountComponent } from './app/components/user/account/account.component';
import { PostPropertyComponent } from './app/components/home/post-property/post-property.component';
import { AuthGuard } from './app/auth.guard';
import { SinglePropertyComponent } from './app/components/home/single-property/single-property.component';
import { EditPropertyComponent } from './app/components/user/edit-property/edit-property.component';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', component: LandingComponent },
    // { path: 'property-listings/create-property', component: CreatePropertyComponent },
    // { path: 'property-listings/delete-property', component: DeletePropertyComponent },
    // { path: 'property-listings/update-property', component: UpdatePropertyComponent },
    { path: 'property-listings', component: AllPropertiesComponent },
    // { path: 'property-listings/get-by-id', component: GetByIdComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'property/:id', component: SinglePropertyComponent },
    { path: 'search', component: SearchComponent },
    { path: 'explore', component: ExploreComponent },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'post-property', component: PostPropertyComponent, canActivate: [AuthGuard] },
    { path: 'edit-property/:id', component: EditPropertyComponent },
]