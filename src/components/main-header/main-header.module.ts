import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainHeader } from './main-header';

@NgModule({
    declarations: [
        MainHeader,
    ],
    imports: [
        IonicPageModule.forChild(MainHeader)
    ],
    exports: [
        MainHeader
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MainHeaderModule { }
