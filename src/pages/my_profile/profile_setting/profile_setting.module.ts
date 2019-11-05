import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Profile_settingPage } from './profile_setting';
@NgModule({
    declarations: [
        Profile_settingPage,
    ],
    imports: [
        IonicPageModule.forChild(Profile_settingPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Profile_settingPageModule { }
