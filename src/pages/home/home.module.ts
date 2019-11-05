import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { MainHeaderModule } from '../../components/main-header/main-header.module';
import { MainFooterModule } from '../../components/main-footer/main-footer.module';
@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        MainFooterModule,
        MainHeaderModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule { }