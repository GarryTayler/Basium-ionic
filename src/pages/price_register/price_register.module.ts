import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Price_registerPage } from './price_register';

@NgModule({
    declarations: [
        Price_registerPage,
    ],
    imports: [
        IonicPageModule.forChild(Price_registerPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Price_registerPageModule { }
