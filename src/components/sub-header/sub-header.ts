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
  selector: 'sub-header',
  templateUrl: 'sub-header.html'
})
export class SubHeader {
  @Input() title: string;
  constructor(public navCtrl: NavController) {
  }
  back() {
    this.navCtrl.pop();
  }
}
