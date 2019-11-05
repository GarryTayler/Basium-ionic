import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubHeader } from './sub-header';

@NgModule({
    declarations: [
        SubHeader,
    ],
    imports: [
        IonicPageModule.forChild(SubHeader)
    ],
    exports: [
        SubHeader
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SubHeaderModule { }
