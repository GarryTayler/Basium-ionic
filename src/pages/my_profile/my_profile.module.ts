import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { My_profilePage } from './my_profile';
import { MainFooterModule } from '../../components/main-footer/main-footer.module';
import { MainHeaderModule } from '../../components/main-header/main-header.module';

@NgModule({
    declarations: [
        My_profilePage,
    ],
    imports: [
        IonicPageModule.forChild(My_profilePage),
        MainFooterModule,
        MainHeaderModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class My_profilePageModule { }
