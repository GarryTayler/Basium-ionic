import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Searchid_1Page } from './searchid_1';

@NgModule({
    declarations: [
        Searchid_1Page,
    ],
    imports: [
        IonicPageModule.forChild(Searchid_1Page),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Searchid_1PageModule { }
