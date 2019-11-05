import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from './notification';
@NgModule({
    declarations: [
        NotificationPage,
    ],
    imports: [
        IonicPageModule.forChild(NotificationPage)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationPageModule { }
