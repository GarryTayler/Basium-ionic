import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BestPage } from './best';
@NgModule({
    declarations: [
        BestPage,
    ],
    imports: [
        IonicPageModule.forChild(BestPage)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BestPageModule { }
