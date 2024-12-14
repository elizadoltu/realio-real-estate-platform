import { Injectable } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID, Inject } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class PlatformDetectorService {
    constructor(@Inject(PLATFORM_ID) private platformId: string) {}

    isBrowser() {
        return isPlatformBrowser(this.platformId);
    }
}