import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MockCartService } from '../../services/mock-cart.service';
import { ItemCarrito } from '../../clases/item-carrito';
import { Carrito } from '../../clases/carrito';
import { CarritoService } from '../../services/carrito.service';
import { map } from 'rxjs/operators';
import { DetalleCarrito } from '../../clases/detalle-carrito';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  carrito: Carrito;
  totalProductos: number;
  //  items: Array<ItemCarrito>;
  //  totalPrice:number ;
  //  totalQuantity:number;
  // carrito:MockCarrito;

  constructor(private carritoService: CarritoService, private _cartService:MockCartService) {
    this.carrito = new Carrito();
    this.totalProductos = 0;
    // this.carrito=new MockCarrito();
    // this.items=[]
   }

  ngOnInit(): void {
    this.getCarrito();

    // this.items=JSON.parse(localStorage.getItem("Mi Carrito"));
    // console.log(this.items)

    // this._cartService.currentDataCart$.subscribe(x=>{
    //   if(x)
    //   {
    //     this.items = x;
    //     this.totalQuantity = x.length;
    //      this.totalPrice = x.reduce((sum, current) => sum + (current.producto.precio * current.cantidad), 0);
        
    //   }
    // })
 
  }

  getCarrito(): void {
    this.carritoService.getCarrito().subscribe((response: any) => {
      this.carrito = response.carrito;
      this.totalProductos = this.carrito.items.length;
    });
  }

  eliminarItem(id: number): void {
    let productoId = id.toString();

    this.carrito.items = this.carrito.items.filter((item: ItemCarrito) => id !== item.producto.id);

    this.carritoService.eliminarItem(productoId).subscribe(response => {
      this.carrito = response.carritoActualizado;
    });
  }

  decrementarCantidad(item: DetalleCarrito): void {
    let productoId = item.producto.id;
    
    this.carrito.items = this.carrito.items.map((item: DetalleCarrito) => {
      if (productoId == item.producto.id) {
        --item.cantidad;
      };
      return item;
    });
    if (item.cantidad == 0) {
      return this.eliminarItem(productoId);
    }
    console.log(item.cantidad);

    this.carritoService.actualizarCantidad(item.cantidad.toString(), productoId.toString()).subscribe(response => {
      this.carrito = response.carritoActualizado;
    });
  }

  incrementarCantidad(item: DetalleCarrito): void {
    
  }


  ///inicio carrito de compras eliminar , sumar 
  public remove(item:ItemCarrito){
    this._cartService.removeElementCart(item);
  }
  public  removeOne(item:ItemCarrito){
    this._cartService.removeOneElementCart(item)
  }
  public addOne(item:ItemCarrito){
    this._cartService.addOneElementCart(item)
  }

//// fin carrito de compras eliminar sumar 


 closeIcon(){
  let icono=document.getElementById("close");
  icono.style.color="red"
 }
}
