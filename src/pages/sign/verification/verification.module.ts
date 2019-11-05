import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerificationPage } from './verification';

@NgModule({
    declarations: [
        VerificationPage,
    ],
    imports: [
        IonicPageModule.forChild(VerificationPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class VerificationPageModule { }
