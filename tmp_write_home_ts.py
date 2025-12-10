from pathlib import Path

content = """import { Component, OnDestroy, OnInit } from '@angular/core';

interface ProductoDestacado {
  id: string;
  nombre: string;
  descripcion: string;
  precioDesde?: number;
  imagen: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.v2.html',
  styleUrls: ['./home.component.v2.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlideIndex = 0;
  autoPlayIntervalId: any = null;
  autoPlayDelayMs = 5000;

  productosDestacados: ProductoDestacado[] = [
    {
      id: 'veggie-01',
      nombre: 'Veggie Grill',
      descripcion: 'Focaccia, vegetales grillados, queso fundido y pesto rustico.',
      precioDesde: 5200,
      imagen: 'assets/productos/sandwiches/veggie-01.jpg'
    },
    {
      id: 'pulled-01',
      nombre: 'Pulled BBQ Cheddar',
      descripcion: 'Braseado desmenuzado, cheddar y salsa barbacoa casera.',
      precioDesde: 5400,
      imagen: 'assets/productos/sandwiches/pulled-01.jpg'
    },
    {
      id: 'pulled-02',
      nombre: 'Pulled Provo & Tomates Secos',
      descripcion: 'Carne braseada, provoleta y tomates secos.',
      precioDesde: 5600,
      imagen: 'assets/productos/sandwiches/pulled-02.jpg'
    },
    {
      id: 'pulled-03',
      nombre: 'Pulled Rucula & Secos',
      descripcion: 'Braseado, rucula fresca y tomates secos.',
      precioDesde: 5600,
      imagen: 'assets/productos/sandwiches/pulled-03.jpg'
    },
    {
      id: 'pulled-04',
      nombre: 'Pulled Criollo',
      descripcion: 'Braseado con morrones y cebolla a la criolla.',
      precioDesde: 5600,
      imagen: 'assets/productos/sandwiches/pulled-04.jpg'
    },
    {
      id: 'bbq',
      nombre: 'BBQ Ahumado',
      descripcion: 'Braseado jugoso con bano de barbacoa ahumada y cebolla grill.',
      precioDesde: 5500,
      imagen: 'assets/productos/sandwiches/bbq.jpg'
    },
    {
      id: 'triple',
      nombre: 'Trio Rusticos',
      descripcion: 'Nuestros tres clasicos servidos en tabla con papas rusticas.',
      precioDesde: 14900,
      imagen: 'assets/productos/combos/triple.jpg'
    }
  ];

  ngOnInit(): void {
    this.iniciarAutoPlay();
  }

  ngOnDestroy(): void {
    this.limpiarAutoPlay();
  }

  irAlSiguiente(): void {
    if (!this.productosDestacados.length) {
      return;
    }
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.productosDestacados.length;
  }

  irAlAnterior(): void {
    if (!this.productosDestacados.length) {
      return;
    }
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.productosDestacados.length) % this.productosDestacados.length;
  }

  irASlide(index: number): void {
    if (!this.productosDestacados.length) {
      return;
    }
    if (index < 0 || index >= this.productosDestacados.length) {
      return;
    }
    this.currentSlideIndex = index;
  }

  iniciarAutoPlay(): void {
    this.limpiarAutoPlay();
    if (!this.productosDestacados.length) {
      return;
    }
    this.autoPlayIntervalId = setInterval(() => {
      this.irAlSiguiente();
    }, this.autoPlayDelayMs);
  }

  limpiarAutoPlay(): void {
    if (this.autoPlayIntervalId) {
      clearInterval(this.autoPlayIntervalId);
      this.autoPlayIntervalId = null;
    }
  }
}
"""

Path("src/app/components/home/home.component.ts").write_text(content, encoding="utf-8")
