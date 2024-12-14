import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  userDetails: any = null;
  ngOnInit() {
      const storedUserDetails = localStorage.getItem('userDetails');
      if (storedUserDetails) {
          this.userDetails = JSON.parse(storedUserDetails);
      }
  }

  logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userDetails');
      alert('You have been logged out');
  }
}
