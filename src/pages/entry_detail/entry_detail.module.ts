import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Entry_detailPage } from './entry_detail';
import { SubHeader1Module } from '../../components/sub-header1/sub-header1.module';
@NgModule({
    declarations: [
        Entry_detailPage,
    ],
    imports: [
        IonicPageModule.forChild(Entry_detailPage),
        SubHeader1Module
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Entry_detailPageModule { }
