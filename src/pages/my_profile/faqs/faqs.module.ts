import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaqsPage } from './faqs';
@NgModule({
    declarations: [
        FaqsPage,
    ],
    imports: [
        IonicPageModule.forChild(FaqsPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FaqsPageModule { }
