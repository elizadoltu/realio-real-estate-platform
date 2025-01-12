import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID, Inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class PlatformDetectorService {
    constructor(@Inject(PLATFORM_ID) private readonly platformId: string) {}

    isBrowser() {
        return isPlatformBrowser(this.platformId);
    }
}