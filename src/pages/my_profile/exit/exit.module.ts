import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExitPage } from './exit';
@NgModule({
    declarations: [
        ExitPage,
    ],
    imports: [
        IonicPageModule.forChild(ExitPage)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExitPageModule { }
