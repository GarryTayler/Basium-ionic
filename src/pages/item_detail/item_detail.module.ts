import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Item_detailPage } from './item_detail';
@NgModule({
    declarations: [
        Item_detailPage,
    ],
    imports: [
        IonicPageModule.forChild(Item_detailPage)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Item_detailPageModule { }
