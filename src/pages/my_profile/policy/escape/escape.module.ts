import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EscapePage } from './escape';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
@NgModule({
    declarations: [
        EscapePage,
    ],
    imports: [
        IonicPageModule.forChild(EscapePage) ,
        SubHeaderModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EscapePageModule { }
