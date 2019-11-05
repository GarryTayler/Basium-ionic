import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Cargo_logPage } from './cargo_log';
@NgModule({
    declarations: [
        Cargo_logPage,
    ],
    imports: [
        IonicPageModule.forChild(Cargo_logPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Cargo_logPageModule { }
