import { Component, Injector } from '@angular/core';
import { IonicPage, Keyboard, AlertController } from 'ionic-angular';
import { BasePage } from '../base/base';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cargo_check',
  templateUrl: 'cargo_check.html',
})
export class Cargo_checkPage extends BasePage {
  tabSelect = "ems"; businessYn = false;
  ems = ""; b_l = ""; year = ""; user_key = "";
  constructor(injector: Injector , public keyboard: Keyboard , public alertCtrl: AlertController) {
    super(injector);
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = user['user_key'];
  } 
  createNotice(type) {

    let params = 'a18';
    let data = '';
    if(type == 'ems') {
      if(this.ems == '') {
        this.presentToast('EMS를 입력하세요.');
        return;  
      }
      data = '{ ' + 
      '"api_key" : "4168ab34-2728-48e3-8cb3-8415a3a877f1", ' + 
      '"request_param" : { ' + 
        '"year" : "", ' + 
        '"bl" : "", ' + 
        '"user_key":"' + this.user_key + '", ' + 
        '"ems_no" : "' + this.ems + '", ' + 
        '"alert_gb" : "B" ' + 
      '} }';
    }
    if(type == 'b_l') {
        if(this.year == '') {
          this.presentToast("년도를 입력하세요.");  
          return;
        }
        if(this.b_l == '') {
          this.presentToast("B/L을 입력하세요.");  
          return;
        }
        data = '{ ' + 
        '"api_key" : "4168ab34-2728-48e3-8cb3-8415a3a877f1", ' + 
        '"request_param" : { ' + 
          '"year" : "' + this.year + '", ' + 
          '"bl" : "' + this.b_l + '", ' + 
          '"user_key":"' + this.user_key + '", ' + 
          '"ems_no" : "", ' + 
          '"alert_gb" : "B" ' + 
        '} }';
    }

    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
      }
      this.presentAlert(type , this.ems , this.b_l , this.year);
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
    
  }
  presentAlert(type , ems , b_l , year) {
    let message = '' , number = '';
    if(type == 'ems') {
      message = 'EMS';
      number = ems;
    }
    else {
      message = 'B/L';
      number = b_l;
    }
    message += '번호 : ' + number + '<br/>알림 예약이 정상적으로 등록되었습니다. <br/>메인화면에서 확인하실 수 있습니다.';
    let alert = this.alertCtrl.create({
      title: '알림 예약완료',
      message: message,
      cssClass: 'notice-msg'
    });
    alert.present();    
  }
  gotoCargoLog() {
    if(this.tabSelect == "ems") {
      if(this.ems == "") {
        this.presentToast("EMS를 입력하세요.");  
        return;
      }
      this.navCtrl.push('Cargo_logPage' , {tab : this.tabSelect , ems: this.ems});
    }
    else  {
      if(this.b_l == "") {
        this.presentToast("B/L을 입력하세요.");  
        return;
      }
      if(this.year == "") {
        this.presentToast("년도를 입력하세요.");  
        return;
      }
      this.navCtrl.push('Cargo_logPage' , {tab : this.tabSelect , b_l: this.b_l , year: this.year});
    }
  }
  tab_choose(tabName) {
    this.tabSelect = tabName;  
  }
  update($event) {
    this.businessYn = !this.businessYn;
  }
}
