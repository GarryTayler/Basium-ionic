import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubHeader1 } from './sub-header1';

@NgModule({
    declarations: [
        SubHeader1,
    ],
    imports: [
        IonicPageModule.forChild(SubHeader1)
    ],
    exports: [
        SubHeader1
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SubHeader1Module { }
