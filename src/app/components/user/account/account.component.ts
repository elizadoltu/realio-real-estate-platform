import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { jwtDecode } from 'jwt-decode'; 
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userDetails: any = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userId;

      this.userService.getUserDetails().subscribe(
        (data) => {
          this.userDetails = data;  
          localStorage.setItem('userDetails', JSON.stringify(data));
        },
        (error) => {
          console.error('Error fetching user details:', error);
          alert('Error fetching user details');
        }
      );
    } else {
      console.error('No auth token found');
      alert('No authentication token found');
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('userDetails');
    alert('You have been logged out');
  }
}