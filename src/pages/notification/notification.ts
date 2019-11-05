import { Component, Injector } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../base/base';
@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage extends BasePage {
  result_list = []; callback = null;
  success = false;
  constructor(injector: Injector) {
    super(injector);
    this.load();
    this.callback = this.navParams.get("callback");
  }
  load() {
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    let user_key = user['user_key'];
    this.presentLoading();
    let params = 'a05';
    let data = '{' +
      '"api_key" : "d69397d5-adb9-4ee1-b370-c73a79722bb7", ' +
      '"request_param" : { ' +
        '"user_key" : "' + user_key  + '", ' + 
        '"sort_gb" : "B" ' + 
      ' } } ';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
        this.presentToast(data.result_msg);
        return;
      }
      this.result_list = data.data_list;
      if(this.result_list.length > 0) {
        this.success = true;
        this.preferences.set('last_date', this.result_list[0].alert_reg_dt);
      }
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
  close() {
    if(this.callback == undefined || this.callback == null) {
        this.navCtrl.setRoot('HomePage');
    }
    else {
        this.callback({success:this.success}).then(()=>{
          this.navCtrl.pop();
        });
    }
  }
}
