import { Component, ViewContainerRef, ViewChild, Input, Output, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { ModalModule, ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';

import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CartService],
  exportAs: 'bs-modal'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private viewContainerRef: ViewContainerRef;
  @ViewChild('childModal') public childModal:ModalDirective;

  /*@Output() public onShow:EventEmitter<ModalDirective> = new EventEmitter();
  @Output() public onShown:EventEmitter<ModalDirective> = new EventEmitter();
  @Output() public onHide:EventEmitter<ModalDirective> = new EventEmitter();
  @Output() public onHidden:EventEmitter<ModalDirective> = new EventEmitter();*/

  productsInCart: Array<Object> = [];
  subTotal: number = 0;
  discount: number = 0;
  promotionCode: string = 'JF05';
  estimatedTotal: number = 0;

  isEditMode: boolean = false;
  cartItem: any;
  cartItemColor: Object = {};
  cartItemSize: Object = {};
  cartItemQty: number = 1;
  isCartItemError: boolean = false;

  qtyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(viewContainerRef: ViewContainerRef, private _cartService: CartService) {
    this.viewContainerRef = viewContainerRef;

    this.productsInCart = this._cartService.getCartItems();
    this.calculateEstimatedTotal();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
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
      "p_name": "trousers",
      "p_variation": "men",
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
    this.childModal.show();
  }

  openEditModal(cartItem) {
    this.isEditMode = true;
    this.cartItem = cartItem;
    Object.assign(this.cartItem, cartItem)
    this.childModal.show();
  }

  updateModalQty(qty) {
    this.cartItemQty = qty;
  }

  updateModalSize(size) {
    if (size == 'SIZE') {
      this.cartItem.p_selected_size = {};
    } else {
      var sizeOptions = this.cartItem.p_available_options.sizes;
      for (var i = 0; i < sizeOptions.length; i++) {
        if (sizeOptions[i].code == size) {
          this.cartItemSize = sizeOptions[i];
        }
      }
    }
  }

  updateModalColor(color) {
    var colorOptions = this.cartItem.p_available_options.colors;
    for (var i = 0; i < colorOptions.length; i++) {
      if (colorOptions[i].hexcode == color) {
        this.cartItemColor = colorOptions[i];
      }
    }
  }

  saveItem() {
    var _flg: boolean = true;
    if(this.cartItemSize == undefined)
      _flg = false;
    if(_flg){
      if(this.isEditMode){
        this._cartService.updateCartItem(this.cartItem, this.cartItemColor, this.cartItemSize, this.cartItemQty);
      } else {
        this.cartItem.p_selected_color = this.cartItemColor;
        this.cartItem.p_selected_size = this.cartItemSize;
        this.cartItem.p_quantity = this.cartItemQty;
        this._cartService.addCartItem(this.cartItem);
      }
      this.productsInCart = this._cartService.getCartItems();
      this.calculateEstimatedTotal();
      this.isCartItemError = false;
      this.hideChildModal();
    } else {
      this.isCartItemError = true;
    }
  }

  calculateEstimatedTotal() {
    this.subTotal = this._cartService.getSubTotal();
    if (this.productsInCart.length <= 3) {
      this.discount = this.subTotal * 0.05;
    }
    else if (this.productsInCart.length >= 4 && this.productsInCart.length <= 10) {
      this.discount = this.subTotal * 0.1;
    }
    else {
      this.discount = this.subTotal * 0.25;
    }
    this.estimatedTotal = this.subTotal - this.discount;
  }

  public showChildModal() {
    this.childModal.show();
  }

  public hideChildModal() {
    this.childModal.hide();
    this.isEditMode = false;
  }
}
