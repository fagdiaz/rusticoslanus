import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { SigninComponent } from './components/signin/signin.component';
import { ProductsComponent } from './components/products/products.component';
import { SignupComponent } from './components/signup/signup.component';
import { UsersPageComponent } from './components/users/users-page.component';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';
import { TokenGuard } from './guard/token.guard';
import { AddproductComponent } from './components/products/addproduct/addproduct.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderComponent } from './components/order/order.component';
import { OrdersAdminComponent } from './components/orders-admin/orders-admin.component';
import { ChatFullComponent } from './components/chat-full/chat-full.component';
import { ChangePasswordComponent } from './components/admin/change-password/change-password.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'signup',
    component: SignupComponent,
    children: [{ path: 'hola', component: HomeComponent }],
  },
  { path: 'signin', component: SigninComponent },
  { path: 'users', component: UsersPageComponent, canActivate: [AdminGuard] },
  { path: 'products', component: ProductsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'account', component: AccountComponent },
  { path: 'addproduct', component: AddproductComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order', component: OrderComponent },
  { path: 'chat', component: ChatFullComponent },
  { path: 'admin/pedidos', component: OrdersAdminComponent },
  { path: 'admin/change-password', component: ChangePasswordComponent, canActivate: [TokenGuard] },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
