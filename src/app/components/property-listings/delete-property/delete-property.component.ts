import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-delete-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // Add CommonModule here
  templateUrl: './delete-property.component.html',
  styleUrls: ['./delete-property.component.css']
})
export class DeletePropertyComponent implements OnInit {
  deleteForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private propertyService: PropertyService,
    private router: Router
  ) {
    // Initialize the form with a 'propertyId' text field and the 'confirm' checkbox
    this.deleteForm = this.formBuilder.group({
      propertyId: ['', [Validators.required]],  // Property ID field (text input)
      confirm: [false, Validators.requiredTrue]  // Confirmation checkbox
    });
  }

  ngOnInit(): void {}

  onDelete(): void {
    if (this.deleteForm.valid) {
      const { propertyId } = this.deleteForm.value;
      
      // Proceed to delete property if the form is valid and the user confirms
      this.propertyService.deleteProperty(propertyId).subscribe(
        () => {
          console.log('Property deleted successfully!');
          this.router.navigate(['/property-listings']);  // Redirect to property listings page
        },
        (error) => {
          console.error('Error deleting property:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
