import { Component } from '@angular/core';

import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ CartService ]
})
export class AppComponent {
  productsInCart: Array<Object> = [];
  subTotal: number = 0;
  discount: number = 0;
  estimatedTotal: number = 0;

  isEditMode: boolean = false;
  editCartItem: Object;

  constructor(private _cartService: CartService){
    this.productsInCart = this._cartService.getCartItems();
    this.calculateEstimatedTotal();
  }

  addCartItem(){
    this.isEditMode = false;

    var newCartItem = {
                    "p_id": (this.productsInCart.length+1)+'',
                    "p_img": "P1.jpg",
                    "p_name": "New Prodcut",
                    "p_variation": "women green",
                    "p_style": "ms13kt1234",
                    "p_selected_color": {
                        "name": "green",
                        "hexcode": "#A3D2A1"
                    },
                    "p_selected_size": {
                        "name": "medium",
                        "code": "m"
                    },
                    "p_available_options": {
                        "colors": [
                            {
                                "name": "green",
                                "hexcode": "#A3D2A1"
                            },
                            {
                                "name": "yellow",
                                "hexcode": "#F9F8E6"
                            },
                            {
                                "name": "red",
                                "hexcode": "#ED99A8"
                            }
                        ],
                        "sizes": [
                            {
                                "name": "small",
                                "code": "s"
                            },
                            {
                                "name": "medium",
                                "code": "m"
                            },
                            {
                                "name": "large",
                                "code": "l"
                            },
                            {
                                "name": "extra large",
                                "code": "xl"
                            }
                        ]
                    },
                    "p_quantity": 1,
                    "p_originalprice": 19.0,
                    "p_price": 19.0,
                    "c_currency": "$"
                };

    this.productsInCart.push(newCartItem);
    this._cartService.addCartItem(newCartItem);
    this.productsInCart = this._cartService.getCartItems();
    this.calculateEstimatedTotal();
  }

  removeCartItem(cartItem){
    this._cartService.removeCartItem(cartItem);
    this.productsInCart = this._cartService.getCartItems();
    this.calculateEstimatedTotal();
  }

  updateQty(cartItem, qty){
    var qty_value: number = qty.value;
    if(qty.value < 0){
      qty_value = 0;
      qty.value = 0;
    }
    if(qty.value > 10){
      qty_value = 10;
      qty.value = 10;
    }
    this._cartService.updateQty(cartItem, qty_value);
    this.productsInCart = this._cartService.getCartItems();
    this.calculateEstimatedTotal();
  }

  calculateEstimatedTotal(){
    this.subTotal = this._cartService.getSubTotal();
    if(this.productsInCart.length < 3)
      this.discount = this.subTotal*0.05;
    else if(this.productsInCart.length > 4 || this.productsInCart.length <= 10)
      this.discount = this.subTotal*0.1;
    else
      this.discount = this.subTotal*0.25;
      console.log('items',this.productsInCart.length, this.discount);
    this.estimatedTotal = this.subTotal-this.discount;
  }
}
