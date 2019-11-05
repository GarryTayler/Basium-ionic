import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Setting_notifyPage } from './setting_notify';
@NgModule({
    declarations: [
        Setting_notifyPage,
    ],
    imports: [
        IonicPageModule.forChild(Setting_notifyPage)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Setting_notifyPageModule { }
