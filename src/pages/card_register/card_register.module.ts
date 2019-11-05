import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Card_registerPage } from './card_register';

@NgModule({
    declarations: [
      Card_registerPage,
    ],
    imports: [
        IonicPageModule.forChild(Card_registerPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Card_registerPageModule { }
