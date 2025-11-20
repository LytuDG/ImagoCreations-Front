import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    public products = signal<any[]>([])

    public addToCart(product:any){
        this.products.set([...this.products(), product])
        return
    }
}
