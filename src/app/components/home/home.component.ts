import { Component, OnInit, OnDestroy } from '@angular/core';

interface ProductoDestacado {
  id: string;
  nombre: string;
  descripcion: string;
  precioDesde?: number;
  imagen: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  productosDestacados: ProductoDestacado[] = [
    {
      id: 'lomito',
      nombre: 'Lomito clásico',
      descripcion: 'Lomito braseado con pan artesanal y vegetales frescos.',
      precioDesde: 4500,
      imagen: 'assets/sandwiches/pulled-03.jpg'
    },
    {
      id: 'pulled-bbq',
      nombre: 'Pulled pork BBQ',
      descripcion: 'Cerdo desmechado a baja temperatura con salsa barbacoa.',
      precioDesde: 4800,
      imagen: 'assets/sandwiches/pulled-01.jpg'
    },
    {
      id: 'veggie',
      nombre: 'Veggie grill',
      descripcion: 'Verduras grilladas, queso y aderezos caseros.',
      precioDesde: 4200,
      imagen: 'assets/sandwiches/veggie-01.jpg'
    },
    {
      id: 'triple',
      nombre: 'Triple rústico',
      descripcion: 'Tres capas de sabor con pan de masa madre.',
      precioDesde: 5000,
      imagen: 'assets/combos/triple.jpg'
    }
  ];

  currentSlideIndex = 0;
  private intervalId: any;

  ngOnInit(): void {
    if (this.productosDestacados.length > 1) {
      this.intervalId = setInterval(() => {
        this.irAlSiguiente();
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  irAlSiguiente(): void {
    if (!this.productosDestacados.length) {
      return;
    }
    this.currentSlideIndex =
      (this.currentSlideIndex + 1) % this.productosDestacados.length;
  }

  irAlAnterior(): void {
    if (!this.productosDestacados.length) {
      return;
    }
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.productosDestacados.length) %
      this.productosDestacados.length;
  }

  irASlide(index: number): void {
    if (index < 0 || index >= this.productosDestacados.length) {
      return;
    }
    this.currentSlideIndex = index;
  }
}
