import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private meta = inject(Meta);
    private title = inject(Title);

    constructor() {}

    updateTitle(title: string) {
        this.title.setTitle(title);
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ name: 'twitter:title', content: title });
    }

    updateDescription(description: string) {
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ name: 'twitter:description', content: description });
    }

    updateKeywords(keywords: string) {
        this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    updateImage(imageUrl: string) {
        this.meta.updateTag({ property: 'og:image', content: imageUrl });
        this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }

    updateUrl(url: string) {
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ name: 'twitter:url', content: url });
        this.updateCanonicalUrl(url);
    }

    updateType(type: string = 'website') {
        this.meta.updateTag({ property: 'og:type', content: type });
    }

    private updateCanonicalUrl(url: string) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }
}
