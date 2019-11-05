import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '../base/base';
import { ResourceLoader } from '@angular/compiler';
@IonicPage()
@Component({
  selector: 'page-cargo_log',
  templateUrl: 'cargo_log.html'
})
export class Cargo_logPage extends BasePage {
  tabSelect = "progress"; b_l = ""; year = "";
  ems = ""; prev_tab = ""; user_key = "";
  result = {};
  constructor(injector: Injector) {
    super(injector);
    
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = user['user_key'];

    this.prev_tab = this.navParams.get("tab");
    if(this.prev_tab == 'ems') 
      this.ems = this.navParams.get("ems");
    else  {
      this.b_l = this.navParams.get("b_l");
      this.year = this.navParams.get("year");
    }
    let params = 'a18' , data = "";
    if(this.prev_tab == 'ems')  {
        data = '{ ' + 
        '"api_key" : "4168ab34-2728-48e3-8cb3-8415a3a877f1", ' + 
        '"request_param" : { ' + 
          '"year" : "", ' + 
          '"bl" : "", ' + 
          '"user_key":"' + this.user_key + '", ' +
          '"ems_no" : "' + this.ems + '", ' + 
          '"alert_gb" : "A" ' +
        ' } } ';	
    }
    else {
        data = '{ ' + 
        '"api_key" : "4168ab34-2728-48e3-8cb3-8415a3a877f1", ' + 
        '"request_param" : { ' + 
        '"year" : "' + this.year + '", ' + 
        '"bl" : "' + this.b_l + '", ' + 
        '"user_key":"' + this.user_key + '", ' +
        '"ems_no" : "", ' + 
        '"alert_gb" : "A" ' +
        ' } } ';   
    }
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
            this.presentToast(data.result_msg);  
            return;
        }
        this.result = data;
    }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    }); 

  }
  tab_choose(tabName) {
    this.tabSelect = tabName;  
  }
  back() {
    this.navCtrl.pop();
  }
}
