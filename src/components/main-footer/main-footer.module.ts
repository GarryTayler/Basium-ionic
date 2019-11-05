import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainFooter } from './main-footer';

@NgModule({
    declarations: [
        MainFooter,
    ],
    imports: [
        IonicPageModule.forChild(MainFooter)
    ],
    exports: [
        MainFooter
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MainFooterModule { }
