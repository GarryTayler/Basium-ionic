import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Terms_conditionsPage } from './terms_conditions';

@NgModule({
    declarations: [
        Terms_conditionsPage,
    ],
    imports: [
        IonicPageModule.forChild(Terms_conditionsPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Terms_conditionsPageModule { }
