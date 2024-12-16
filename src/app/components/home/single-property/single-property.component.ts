import { Component, OnInit } from '@angular/core';
import { PropertyListing } from '../../../models/property.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule, Location, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ContactComponent } from "../contact/contact.component";

@Component({
  selector: 'app-single-property',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ContactComponent],
  templateUrl: './single-property.component.html',
  styleUrl: './single-property.component.css',
  providers: [DatePipe]
})
export class SinglePropertyComponent implements OnInit {
  property: any;
  userID: string = '';
  userDetails: any;
  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private userService: UserService,
    private location: Location,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');  
    if (propertyId) {
      this.fetchPropertyDetails(propertyId);
      this.fetchUserDetails();
    }
  }

  goBack(): void {
    this.location.back();
  }

  fetchPropertyDetails(id: string): void {
    this.propertyService.getPropertyById(id).subscribe(
      (response) => {
        if (response) {
          console.log(response);
          this.property = response;
          this.userID = this.property.userID;
        } else {
          this.property = null;
        }
      },
      (error) => {
        console.error('Error fetching property', error);
        this.property = null;
      }
    );
  }

  fetchUserDetails(): void {
    if (this.userID){
      this.userService.getUserDetailsById(this.userID).subscribe(
        (response) => {
          this.userDetails = response;
          console.log('User details:', response);
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      )
    }
  }
}
