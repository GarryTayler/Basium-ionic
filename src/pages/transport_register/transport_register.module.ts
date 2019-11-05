import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Transport_registerPage } from './transport_register';

@NgModule({
    declarations: [
        Transport_registerPage,
    ],
    imports: [
        IonicPageModule.forChild(Transport_registerPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Transport_registerPageModule { }
