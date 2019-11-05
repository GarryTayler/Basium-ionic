import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SigninPage } from './signin';

@NgModule({
    declarations: [
      SigninPage,
    ],
    imports: [
        IonicPageModule.forChild(SigninPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SigninPageModule { }
