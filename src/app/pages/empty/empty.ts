import { Component } from '@angular/core';

@Component({
    selector: 'app-empty',
    standalone: true,
    template: ` <div class="card">
        <div class="font-semibold text-xl mb-4">Empty Page</div>
        <p>Building...</p>
    </div>`
})
export class Empty {}
