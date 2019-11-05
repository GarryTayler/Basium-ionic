import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '../../base/base';
@IonicPage()
@Component({
  selector: 'page-policy',
  templateUrl: 'policy.html'
})
export class PolicyPage extends BasePage {
  constructor(injector: Injector) {
    super(injector);
  }
  back() {
    this.navCtrl.pop();
  }
  gotoService() {
    this.navCtrl.push("Service_agreePage");
  } 
  gotoPrivate() {
    this.navCtrl.push("Privacy_profilePage");
  } 
  gotoEscape() {
    this.navCtrl.push("EscapePage");
  } 
}
