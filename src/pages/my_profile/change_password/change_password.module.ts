import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Change_passwordPage } from './change_password';
@NgModule({
    declarations: [
        Change_passwordPage ,
    ],
    imports: [
        IonicPageModule.forChild(Change_passwordPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Change_passwordPageModule { }
