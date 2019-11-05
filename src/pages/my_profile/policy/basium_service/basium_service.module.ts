import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Basium_servicePage } from './basium_service';
@NgModule({
    declarations: [
        Basium_servicePage,
    ],
    imports: [
        IonicPageModule.forChild(Basium_servicePage)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Basium_servicePageModule { }
