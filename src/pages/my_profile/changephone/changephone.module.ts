import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangephonePage } from './changephone';

@NgModule({
    declarations: [
        ChangephonePage,
    ],
    imports: [
        IonicPageModule.forChild(ChangephonePage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ChangephonePageModule { }
