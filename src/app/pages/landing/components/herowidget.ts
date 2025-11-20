import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule],
    template: `
        <div
            id="hero"
            class="flex flex-col pt-36 px-6 lg:px-20 overflow-hidden"
            style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(253, 114, 56, 0.3) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
        >
            <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                <h1 class="text-6xl font-bold text-gray-900 leading-tight dark:!text-gray-700"><span class="font-light block">Welcome to</span>Imago Creations</h1>
                <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700 dark:text-gray-700">Discover unique and creative products tailored just for you. Explore our collection and find something special.</p>
                <button pButton pRipple [rounded]="true" type="button" label="Start Shopping" class="text-xl! mt-8 px-4!" (click)="router.navigate(['/'], { fragment: 'shop' })"></button>
            </div>
            <div class="flex justify-center md:justify-end">
                <img src="img/mockups.png" alt="Hero Image" class=" w-9/12 md:w-[560px]" />
            </div>
        </div>
    `
})
export class HeroWidget {
    router = inject(Router);
}
