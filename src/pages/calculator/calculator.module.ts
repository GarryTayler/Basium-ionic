import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalculatorPage } from './calculator';

@NgModule({
    declarations: [
        CalculatorPage,
    ],
    imports: [
        IonicPageModule.forChild(CalculatorPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CalculatorPageModule { }