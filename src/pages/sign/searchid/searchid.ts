import { Component, Injector } from '@angular/core';
import { IonicPage, Keyboard } from 'ionic-angular';
import { BasePage } from '../../base/base';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchid',
  templateUrl: 'searchid.html',
})
export class SearchidPage extends BasePage {
  userid = ''; reg_dt = '';
  constructor(injector: Injector , public keyboard: Keyboard) {
    super(injector);
    this.userid = this.navParams.get("userid");
    this.reg_dt = this.navParams.get("reg_dt");
    if(!this.userid)
      this.userid = '';
    if(!this.reg_dt) 
      this.reg_dt = '';
  }
  signin() {
    this.navCtrl.setRoot('SigninPage');
  }
  search_password() { 
    this.navCtrl.push('Searchid_1Page');
  }
  goback() {
    this.navCtrl.pop();
  }
}
