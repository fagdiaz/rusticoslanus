import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/product/product.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';
import { PrendaPipe } from './pipes/prenda.pipe';
import { FiltroProductPipe } from './pipes/filtro-product.pipe';
import { ResaltarDirective } from './resaltar.directive';
import { AddproductComponent } from './components/products/addproduct/addproduct.component';
import { CartComponent } from './components/cart/cart.component';

export function tokenGetter() {
  const token = localStorage.getItem('UsuarioLogueado');
  return token ? token : '';
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ErrorComponent,
    ProductsComponent,
    ProductComponent,
    UsersComponent,
    UserComponent,
    SigninComponent,
    SignupComponent,
    AboutComponent,
    AccountComponent,
    PrendaPipe,
    FiltroProductPipe,
    ResaltarDirective,
    AddproductComponent,
    CartComponent,
    
   
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule, HttpClientModule,
    
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4200"],
        disallowedRoutes: [],
      }})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
