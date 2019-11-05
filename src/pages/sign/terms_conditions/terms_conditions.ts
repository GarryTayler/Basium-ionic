import { Component, Injector } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../../base/base';

/**
 * Generated class for the Terms_conditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-temrs_conditions',
  templateUrl: 'terms_conditions.html',
})
export class Terms_conditionsPage extends BasePage {
  checkbox_1 = false; checkbox_2 = false; checkbox_3 = false; checkbox_4 = false; checkbox_5 = false; 
  result_list = [];
  constructor(injector: Injector) {
    super(injector);
    this.load();
  }
  load() {
    this.presentLoading();
    let params = 'a33';
    let data = '{' +
      '"api_key" : "e7fbbbcb-29ce-4fce-a09a-03a7d8314537"' +
    '}';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S")  {
        this.presentToast(data.result_msg);
        return;
      }
      this.result_list = data.data_list;
      console.log(this.result_list);
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
  signup() {
    if(this.checkbox_2 && this.checkbox_3 && this.checkbox_4)
      this.navCtrl.push('SignupPage' , {email_alert_agree : this.checkbox_5});
    else
      this.presentToast('전부 동의해야 합니다.');
  }
  back() {
    this.navCtrl.pop();
  }
  click_all() {
    if(this.checkbox_1) {
      this.checkbox_2 = this.checkbox_3 = this.checkbox_4 = this.checkbox_5 = true;
    }
    else {
      this.checkbox_2 = this.checkbox_3 = this.checkbox_4 = this.checkbox_5 = false;
    }
  }
  click_checkbox() {
    if(!this.checkbox_2 || !this.checkbox_3 || !this.checkbox_4 || !this.checkbox_5)  
      this.checkbox_1 = false;
    if(this.checkbox_2 && this.checkbox_3 && this.checkbox_4 && this.checkbox_5)
      this.checkbox_1 = true;
  }
}
