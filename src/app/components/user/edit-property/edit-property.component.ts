import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
  properties: any[] = [];
  editPropertyForm: FormGroup;
property: any;

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
