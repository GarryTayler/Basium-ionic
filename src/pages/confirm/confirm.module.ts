import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmPage } from './confirm';

@NgModule({
    declarations: [
      ConfirmPage,
    ],
    imports: [
        IonicPageModule.forChild(ConfirmPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ConfirmPageModule { }
