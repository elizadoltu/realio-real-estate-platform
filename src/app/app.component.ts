import { Component , ElementRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import Lenis from 'lenis';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'real-estate-management-frontend';
  private readonly lenis: Lenis | undefined;

  constructor(private readonly router: Router, private readonly elementRef: ElementRef) {}

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
  
  
  
  
  

  // ngOnDestroy(): void {
  //   this.lenis?.destroy();
  //   gsap.ticker.remove((time) => this.lenis?.raf(time * 1000));
  // }
}
