import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchuseridPage } from './searchuserid';

@NgModule({
    declarations: [
        SearchuseridPage,
    ],
    imports: [
        IonicPageModule.forChild(SearchuseridPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SearchuseridPageModule { }
