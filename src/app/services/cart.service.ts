import { Injectable } from '@angular/core';
import { Init } from '../init-cartItems';

@Injectable()
export class CartService extends Init{
    constructor(){
        super();
        //console.log('CartService Initialized...');
        this.load();
    }

    getCartItems(){
        var cartItems = JSON.parse(localStorage.getItem('cart'));
        return cartItems;
    }

    addCartItem(newCartItem){
        var cartItems = JSON.parse(localStorage.getItem('cart'));
        cartItems.push(newCartItem);
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    updateCartItem(cartItem, newColor, newSize, newQty){
        var cartItems = JSON.parse(localStorage.getItem('cart'));
        for(var i=0; i<cartItems.length; i++){
            if(cartItems[i].p_id == cartItem.p_id){
                cartItems[i].p_selected_color = newColor;
                cartItems[i].p_selected_size = newSize;
                cartItems[i].p_quantity = newQty;
            }
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    updateQty(cartItem, qty){
        var cartItems = JSON.parse(localStorage.getItem('cart'));
        for(var i=0; i<cartItems.length; i++){
            if(cartItems[i].p_id == cartItem.p_id){
                cartItems[i].p_quantity = qty;
            }
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    removeCartItem(cartItem){
        var cartItems = JSON.parse(localStorage.getItem('cart'));
        for(var i=0; i<cartItems.length; i++){
            if(cartItems[i].p_id == cartItem.p_id){
                cartItems.splice(i,1);
            }
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    getSubTotal(){
        var cartItems = JSON.parse(localStorage.getItem('cart'));
        var subtotal: number = 0;
        for(var i=0; i<cartItems.length; i++){
            subtotal+=cartItems[i].p_price*cartItems[i].p_quantity;
        }
        return subtotal;
    }
}