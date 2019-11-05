import { Component, Input, Injector } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Preferences } from '../../providers/preferences';
import { RemoteService } from '../../providers/remote-service/remote-service';
/**
 * Generated class for the FoodTabComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@IonicPage()
@Component({
  selector: 'sub-header1',
  templateUrl: 'sub-header1.html'
})
export class SubHeader1 {
  @Input() title: string;
  @Input() payment: string;
  constructor(public navCtrl: NavController) {
  }
  goback() {
    if(this.payment == 'payment') 
      this.navCtrl.push('EntryPage');
    else
      this.navCtrl.pop();
  }
}
