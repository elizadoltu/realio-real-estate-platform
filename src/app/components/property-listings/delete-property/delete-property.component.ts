import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-delete-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
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
  
    this.deleteForm = this.formBuilder.group({
      propertyId: ['', [Validators.required]],  
      confirm: [false, Validators.requiredTrue]  
    });
  }

  ngOnInit(): void {}

  onDelete(): void {
    if (this.deleteForm.valid) {
      const { propertyId } = this.deleteForm.value;
      
      this.propertyService.deleteProperty(propertyId).subscribe(
        () => {
          console.log('Property deleted successfully!');
          this.router.navigate(['/property-listings']);  
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
