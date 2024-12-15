import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { OnInit, OnDestroy, ElementRef } from '@angular/core';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private router: Router, public authService: AuthService) {}
  private lenis: Lenis | undefined;
  ngOnInit() : void {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.lenis = new Lenis({
        duration: 1.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // smoothWheel: true,
        orientation: 'vertical',
        syncTouch: true,
      });
  
      this.lenis.on('scroll', () => {
        ScrollTrigger.update(); 
      });
  
      const raf = (time: number) => {
        this.lenis?.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }
  

  ngOnDestroy(): void {
    this.lenis?.destroy();
    gsap.ticker.remove((time) => this.lenis?.raf(time * 1000));
  }

  navigateToAccount() {
    this.router.navigate(['/account']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToExplore() {
    this.router.navigate(['/explore']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToSearch() {
    this.router.navigate(['/search']);
  }

  navigateToPostProperty() {
    this.router.navigate(['/post-property']);
  }
}
