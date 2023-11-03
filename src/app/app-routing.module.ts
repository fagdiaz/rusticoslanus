import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { SigninComponent } from './components/signin/signin.component';
import { ProductsComponent } from './components/products/products.component';
import { SignupComponent } from './components/signup/signup.component';
import { UsersComponent } from './components/users/users.component';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';
import { TokenGuard } from './guard/token.guard';
import { AddproductComponent } from './components/products/addproduct/addproduct.component';
import { AuthGuard } from './guard/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderComponent } from './components/order/order.component';


const routes: Routes = [  
  {path:'home',component:HomeComponent},  
  {path:'signup',component:SignupComponent, children:[{path:'hola',component:HomeComponent}]}, 
  {path:'' ,component:HomeComponent}, 
  {path:'signin' ,component:SigninComponent}, 
  {path:'users' ,component:UsersComponent}, 
  //{path:'users', component: UsersComponent,canActivate:[TokenGuard]},
  {path:'signup' ,component:SignupComponent}, 
  {path:'products', component:ProductsComponent},
  {path:'about', component:AboutComponent},
  {path:'account', component:AccountComponent},
  {path:'addproduct', component:AddproductComponent, canActivate: [AuthGuard]},
  {path:'cart',component:CartComponent},
  {path:'checkout',component:CheckoutComponent},
  {path:'order',component:OrderComponent},
  {path:'**',component:ErrorComponent}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }