import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Card_paymentPage } from './card_payment';
@NgModule({
    declarations: [
        Card_paymentPage,
    ],
    imports: [
        IonicPageModule.forChild(Card_paymentPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Card_paymentPageModule { }
