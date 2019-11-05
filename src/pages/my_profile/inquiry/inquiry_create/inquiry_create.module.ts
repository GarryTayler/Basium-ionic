import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Inquiry_createPage } from './inquiry_create';

@NgModule({
    declarations: [
      Inquiry_createPage,
    ],
    imports: [
        IonicPageModule.forChild(Inquiry_createPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Inquiry_createPageModule { }
