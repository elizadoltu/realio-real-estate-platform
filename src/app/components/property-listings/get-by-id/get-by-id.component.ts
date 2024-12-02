import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../../services/property.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  selector: 'app-get-by-id',
  templateUrl: './get-by-id.component.html',
  styleUrls: ['./get-by-id.component.css']
})
export class GetByIdComponent implements OnInit {
  getByIdForm: FormGroup;
  property: any;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private route: ActivatedRoute
  ) {
    this.getByIdForm = this.fb.group({
      propertyId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Dacă primești un ID prin ruta URL
    this.route.paramMap.subscribe(params => {
      const propertyId = params.get('id');
      if (propertyId) {
        this.getByIdForm.controls['propertyId'].setValue(propertyId);
        this.onGetById();
      }
    });
  }

  onGetById(): void {
    if (this.getByIdForm.valid) {
      const propertyId = this.getByIdForm.value.propertyId;
      this.propertyService.getPropertyById(propertyId).subscribe(
        (response) => {
          if (response) {
            this.property = response;
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
  }
}
