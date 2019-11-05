import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Profile_settingPage_1 } from './profile_setting_1';
@NgModule({
    declarations: [
        Profile_settingPage_1,
    ],
    imports: [
        IonicPageModule.forChild(Profile_settingPage_1),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Profile_settingPage_1Module { }
