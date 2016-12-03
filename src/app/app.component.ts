import { Component } from '@angular/core';

import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CartService]
})
export class AppComponent {
  productsInCart: Array<Object> = [];
  subTotal: number = 0;
  discount: number = 0;
  estimatedTotal: number = 0;

  isEditMode: boolean = false;
  cartItem: any;

  qtyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private _cartService: CartService) {
    this.productsInCart = this._cartService.getCartItems();
    this.calculateEstimatedTotal();
  }

  addCartItem() {
    this.isEditMode = false;

    var newCartItem = {
      "p_id": (this.productsInCart.length + 1) + '',
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

  removeCartItem(cartItem) {
    this._cartService.removeCartItem(cartItem);
    this.productsInCart = this._cartService.getCartItems();
    this.calculateEstimatedTotal();
  }

  updateQty(cartItem, qty) {
    var qty_value: number = qty.value;
    if (qty.value < 0) {
      qty_value = 0;
      qty.value = 0;
    }
    if (qty.value > 10) {
      qty_value = 10;
      qty.value = 10;
    }
    this._cartService.updateQty(cartItem, qty_value);
    this.productsInCart = this._cartService.getCartItems();
    this.calculateEstimatedTotal();
  }

  openAddModal() {
    this.isEditMode = false;
    this.cartItem = {
      "p_id": (this.productsInCart.length + 1) + '',
      "p_img": "P1.jpg",
      "p_name": "New Prodcut",
      "p_variation": "women green",
      "p_style": "ms13kt1234",
      "p_selected_color": {
        "name": "green",
        "hexcode": "#A3D2A1"
      },
      "p_selected_size": {},
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
    console.log('add', this.cartItem);
  }

  openEditModal(cartItem) {
    this.isEditMode = true;
    this.cartItem = cartItem;
    console.log('edit', this.cartItem);
  }

  closeModal() {
    this.isEditMode = false;
  }

  updateModalQty(qty){
    this.cartItem.p_quantity = qty;
  }

  updateModalSize(size){
    /*if(size == 's')
      this.cartItem.p_selected_size = {"name": "small","code": "s"};
    else if(size == 'm')
      this.cartItem.p_selected_size = {"name": "medium","code": "m"};
    else if(size == 'l')
      this.cartItem.p_selected_size = {"name": "large","code": "l"};
    else
      this.cartItem.p_selected_size = {"name": "extra large","code": "xl"};*/
    var sizeOptions = this.cartItem.p_available_options.sizes;
    for(var i=0; i<sizeOptions.length; i++){
        if(sizeOptions[i].code == size){
            this.cartItem.p_selected_size = sizeOptions[i];
        }
    }
  }

  updateModalColor(color){
    /*if(color == 'green')
      this.cartItem.p_selected_size = { "name": "green", "hexcode": "#A3D2A1"};
    else if(color == 'yellow')
      this.cartItem.p_selected_size = { "name": "green", "hexcode": "#F9F8E6"};
    else if(color == 'red')
      this.cartItem.p_selected_size = { "name": "green", "hexcode": "#ED99A8"};
    else if(color == 'pink')
      this.cartItem.p_selected_size = { "name": "green", "hexcode": "#F1DDEF"};
    else if(color == 'blue')
      this.cartItem.p_selected_size = { "name": "green", "hexcode": "#1169BD"};
    else
      this.cartItem.p_selected_size = {"name": "extra large","code": "xl"};*/
    var colorOptions = this.cartItem.p_available_options.colors;
    for(var i=0; i<colorOptions.length; i++){
        if(colorOptions[i].hexcode == color){
            this.cartItem.p_selected_color = colorOptions[i];
        }
    }
  }

  saveItem(){
    if(this.isEditMode){
      this._cartService.updateCartItem(this.cartItem);
    } else {
      this._cartService.addCartItem(this.cartItem);
    }
    this.productsInCart = this._cartService.getCartItems();
    this.calculateEstimatedTotal();
  }

  calculateEstimatedTotal() {
    this.subTotal = this._cartService.getSubTotal();
    if (this.productsInCart.length <= 3){
      this.discount = this.subTotal * 0.05;
    }
    else if (this.productsInCart.length >= 4 && this.productsInCart.length <= 10){
      this.discount = this.subTotal * 0.1;
    }
    else {
      this.discount = this.subTotal * 0.25;
    }
    this.estimatedTotal = this.subTotal - this.discount;
  }
}
