import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnouncementPage } from './announcement';
@NgModule({
    declarations: [
        AnnouncementPage,
    ],
    imports: [
        IonicPageModule.forChild(AnnouncementPage)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnnouncementPageModule { }
