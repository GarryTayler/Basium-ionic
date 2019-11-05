import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchidPage } from './searchid';

@NgModule({
    declarations: [
        SearchidPage,
    ],
    imports: [
        IonicPageModule.forChild(SearchidPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SearchidPageModule { }
