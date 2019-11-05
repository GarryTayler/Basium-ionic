import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Privacy_profilePage } from './privacy_profile';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
@NgModule({
    declarations: [
        Privacy_profilePage,
    ],
    imports: [
        IonicPageModule.forChild(Privacy_profilePage) , 
        SubHeaderModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Privacy_profilePageModule { }
