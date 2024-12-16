import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { OnInit, OnDestroy, ElementRef } from '@angular/core';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ContactComponent } from "../contact/contact.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ContactComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css', './lenis.css']
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private router: Router, public authService: AuthService) {}
  private lenis: Lenis | undefined;
  ngOnInit() : void {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    gsap.from('.headline-text', {
      yPercent: 100,
      ease: 'power4.inOut',
      stagger: {
        amount: 0.5,
      },
      duration: 1.5,
      // onComplete: () => this.showElements(),
    });

    gsap.to(
      '.headline',
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        ease: 'power4.inOut',
        stagger: {
          amount: 0.5,
        },
        duration: 1.5,
        // onComplete: () => this.showElements(),
      },
    );

    // if (typeof window !== 'undefined') {
    //   this.lenis = new Lenis({
    //     autoRaf: true,
    //     duration: 1.0,
    //     easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    //     // smoothWheel: true,
    //     orientation: 'vertical',
    //     syncTouch: true,
    //   });
  
    //   this.lenis.on('scroll', () => {
    //     ScrollTrigger.update(); 
    //   });
  
    //   const raf = (time: number) => {
    //     this.lenis?.raf(time);
    //     requestAnimationFrame(raf);
    //   };
    //   requestAnimationFrame(raf);
    // }
  }
  // showElements(): void {
  //   gsap.to('.flex', {
  //     opacity: 1,
  //     y: 0,
  //     duration: 1,
  //     ease: 'power4.out',
  //   });

  //   gsap.to('.grid', {
  //     opacity: 1,
  //     y: 0,
  //     duration: 1.5,
  //     delay: 0.5, 
  //     ease: 'power4.out',
  //   });

  //   gsap.to('.bg-primary-white', {
  //     opacity: 1,
  //     y: 0,
  //     duration: 1.5,
  //     delay: 1, 
  //     ease: 'power4.out',
  //   });
  // }
  
  

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
