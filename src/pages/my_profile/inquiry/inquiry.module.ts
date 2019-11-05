import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InquiryPage } from './inquiry';
@NgModule({
    declarations: [
        InquiryPage,
    ],
    imports: [
        IonicPageModule.forChild(InquiryPage)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InquiryPageModule { }
