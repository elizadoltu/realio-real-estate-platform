import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
  properties: any[] = [];
  editPropertyForm: FormGroup;
property: any;
editingProperty: any;

  constructor(private fb: FormBuilder, private propertyService: PropertyService) {
    this.editPropertyForm = this.fb.group({
      title: [''],
      address: [''],
      type: [''],
      price: [''],
      squareFootage: ['']
    });
  }

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getPaginatedProperties(1, 10).subscribe((data: any) => {
      this.properties = data.data; // Adjust based on your API's response structure
    });
  }

  onSaveProperty(propertyId: string): void {
    if (this.editPropertyForm.valid) {
      const updatedProperty = this.editPropertyForm.value;
      this.propertyService.updateProperty(propertyId, updatedProperty).subscribe(() => {
        console.log('Property updated successfully');
        this.loadProperties();
      });
    }
  }
}
