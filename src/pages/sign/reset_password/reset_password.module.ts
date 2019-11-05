import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Reset_passwordPage } from './reset_password';

@NgModule({
    declarations: [
        Reset_passwordPage,
    ],
    imports: [
        IonicPageModule.forChild(Reset_passwordPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Reset_passwordPageModule { }
