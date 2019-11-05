import { Component, Input } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the FoodTabComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@IonicPage()
@Component({
  selector: 'main-footer',
  templateUrl: 'main-footer.html'
})
export class MainFooter {
  @Input() tab: string;
  constructor(public navCtrl: NavController) {
  }
  gotoHome() {
    this.navCtrl.setRoot('HomePage');
  }
  gotoHistory() {
    this.navCtrl.push('EntryPage');
  }
  gotoMain() {
    this.navCtrl.push('ConfirmPage');
  }
  gotoProfile() {
    this.navCtrl.push('My_profilePage');
  }
  gotoView() { 
    this.navCtrl.push('Cargo_checkPage');
  }
}
