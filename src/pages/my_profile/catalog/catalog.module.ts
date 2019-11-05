import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CatalogPage } from './catalog';

@NgModule({
    declarations: [
        CatalogPage,
    ],
    imports: [
        IonicPageModule.forChild(CatalogPage)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CatalogPageModule { }


