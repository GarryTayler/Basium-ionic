import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PolicyPage } from './policy';
@NgModule({
    declarations: [
        PolicyPage,
    ],
    imports: [
        IonicPageModule.forChild(PolicyPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PolicyPageModule { }
