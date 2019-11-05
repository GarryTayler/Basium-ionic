import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';

@NgModule({
    declarations: [
      SignupPage,
    ],
    imports: [
        IonicPageModule.forChild(SignupPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SignupPageModule { }
