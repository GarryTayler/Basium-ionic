import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeuseridPage } from './changeuserid';

@NgModule({
    declarations: [
        ChangeuseridPage,
    ],
    imports: [
        IonicPageModule.forChild(ChangeuseridPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ChangeuseridPageModule { }
