import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryPage } from './entry';
import { MainFooterModule } from '../../components/main-footer/main-footer.module';
import { MainHeaderModule } from '../../components/main-header/main-header.module';
@NgModule({
    declarations: [
        EntryPage,
    ],
    imports: [
        IonicPageModule.forChild(EntryPage),
        MainFooterModule,
        MainHeaderModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule { }
