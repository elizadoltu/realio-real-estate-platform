import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'real-estate-management-frontend';
  private lenis: Lenis | undefined;

  constructor(private router: Router, private elementRef: ElementRef) {}

  // ngOnInit() : void {
  //   gsap.registerPlugin(ScrollTrigger);
  // }

  // ngAfterViewInit(): void {
  //   if (typeof window !== 'undefined') {
  //     this.lenis = new Lenis({
  //       duration: 1.2,
  //       easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //       smoothWheel: true,
  //       orientation: 'vertical',
  //     });
  
  //     this.lenis.on('scroll', () => {
  //       ScrollTrigger.update(); 
  //     });
  
  //     const raf = (time: number) => {
  //       this.lenis?.raf(time);
  //       requestAnimationFrame(raf);
  //     };
  //     requestAnimationFrame(raf);
  //   }
  // }
  

  // ngOnDestroy(): void {
  //   this.lenis?.destroy();
  //   gsap.ticker.remove((time) => this.lenis?.raf(time * 1000));
  // }
}
