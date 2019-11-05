import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Cargo_checkPage } from './cargo_check';
import { MainFooterModule } from '../../components/main-footer/main-footer.module';
import { MainHeaderModule } from '../../components/main-header/main-header.module';
@NgModule({
    declarations: [
        Cargo_checkPage,
    ],
    imports: [
        IonicPageModule.forChild(Cargo_checkPage),
        MainFooterModule,
        MainHeaderModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Cargo_checkPageModule { }
