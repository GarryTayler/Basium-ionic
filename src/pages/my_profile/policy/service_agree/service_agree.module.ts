import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Service_agreePage } from './service_agree';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
@NgModule({
    declarations: [
        Service_agreePage,
    ],
    imports: [
        IonicPageModule.forChild(Service_agreePage), 
        SubHeaderModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Service_agreePageModule { }
