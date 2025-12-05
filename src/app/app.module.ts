import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
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
import { OrderComponent } from './components/order/order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ChatFilterPipe } from './pipes/chat-filter.pipe';
import { MyMessageDirective } from './directives/my-message.directive';
import { OrdersAdminComponent } from './components/orders-admin/orders-admin.component';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';


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
    OrderComponent,
    CheckoutComponent,
    ChatComponent,
    ChatFilterPipe,
    MyMessageDirective,
    OrdersAdminComponent,
    ChatWidgetComponent,

  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4200"],
        disallowedRoutes: [],
      },
    })
  ],
  exports: [
    ChatComponent,
    ChatWidgetComponent
  ],
  providers: [DatePipe], // Agrega DatePipe en los proveedores
  bootstrap: [AppComponent]
})
export class AppModule { }
