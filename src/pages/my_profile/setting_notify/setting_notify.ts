import { Component, Injector } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../../base/base';
declare var jquery: any;
declare var $: any;
@IonicPage()
@Component({
  selector: 'page-setting_notify',
  templateUrl: 'setting_notify.html'
})
export class Setting_notifyPage extends BasePage {
  notify_received_flag : string = 'off';
  user_key : string = "";
  loaded: boolean = false;
  constructor(injector: Injector) {
    super(injector);
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    
    this.user_key = user['user_key'];
    /*if(!this.preferences.get('notify_flag'))
      this.notify_received_flag = 'on';
    else
      this.notify_received_flag = this.preferences.get('notify_flag');*/

    this.load();
  }

  load() {
    this.presentLoading();
    let params = 'a46';
    let data = '{  ' +
      '"api_key" : "4f9f6c3d-e604-4f5d-8e1c-009993f727c4", ' + 
      '"request_param" : { ' + 
        '"user_key":"' + this.user_key + '" ' + 
      '}  } ';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
        this.presentToast(data.result_msg);
        return;
      }

      if(data.param.push_ok == "Y")
        this.notify_received_flag  = 'on';
      else
        this.notify_received_flag  = 'off';

      if(this.notify_received_flag == 'on') {
        $('#business_checkbox').prop('checked' , true);
        $('#no_label').hide();
        $('#yes_label').show();  
      }

    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }

  back() {
    this.navCtrl.pop();
  }

  ionViewDidEnter(){ 
    this.loaded = true;
    let __this = this;
    if(this.notify_received_flag == 'on') {
      $('#business_checkbox').prop('checked' , true);
      $('#no_label').hide();
      $('#yes_label').show();
    }

    $('#business_checkbox').on('change' , function(e) {
        if(__this.notify_received_flag == 'off') {
            $('#no_label').hide();
            $('#yes_label').show();
        }
        else {
            $('#no_label').show();
            $('#yes_label').hide();
        }
        if(__this.notify_received_flag  == 'on')
          __this.notify_received_flag = 'off';
        else
          __this.notify_received_flag = 'on';
        __this.presentLoading();
        let params = 'a45';
        let data = '{ ' +
          '"api_key" : "7892c4a5-ab9d-4212-b643-1e7225f3c6eb", ' + 
          '"request_param" : { ' + 
            '"user_key":"' + __this.user_key + '",  ' + 
            '"push_ok":"' + (__this.notify_received_flag == 'on'?'Y':'N') + '" ' + 
          ' } } ';
        __this.server.post(encodeURI(params) , data).subscribe(data => {
          __this.dismiss();
          if(data.result_cd != "S") {
            __this.presentToast(data.result_msg);
            return;
          }
        }, err => {
          __this.dismiss();
          __this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
        })
    });
  }
}
