import { NgModule } from '@angular/core';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {FormsModule,ReactiveFormsModule,} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';


@NgModule({
    imports: [
        MatButtonModule, 
        MatMenuModule, MatIconModule,MatGridListModule
    ],
    exports: [
        MatButtonModule, 
        MatMenuModule, MatIconModule,MatCardModule,
        [MatFormFieldModule, MatInputModule, MatSelectModule],
        MatNativeDateModule, MatDatepickerModule,
        FormsModule, MatFormFieldModule, MatInputModule,
        ReactiveFormsModule,MatGridListModule
    ]
})
export class MaterialModule { }