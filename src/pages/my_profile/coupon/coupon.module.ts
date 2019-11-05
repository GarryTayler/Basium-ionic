import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CouponPage } from './coupon';
@NgModule({
    declarations: [
        CouponPage,
    ],
    imports: [
        IonicPageModule.forChild(CouponPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CouponPageModule { }
