import { Component, Injector } from '@angular/core';
import { IonicPage, Keyboard } from 'ionic-angular';
import { BasePage } from '../../base/base';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchid_1',
  templateUrl: 'searchid_1.html',
})
export class Searchid_1Page extends BasePage {
  mobile = ''; temp_user_key = ""; verify_code = '';
  constructor(injector: Injector , public keyboard: Keyboard) {
    super(injector);
  }
  sendVerifyRequest() {
    if(this.mobile == '') {
      this.presentToast('휴대폰 번호를 입력하세요.'); 
      return;
    }
    let params = 'a08';
    let data = '{ ' +
      '"api_key" : "545487c0-b7ec-48ad-a5f7-56c93a438ed7", ' +
      '"request_param" : { ' +
        '"user_id" : "", ' +
        '"user_tel" : "' + this.mobile + '", ' +
        '"cert_type" : "B", ' + 
        '"cert_gb" : "B" ' +
      ' } } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
      }
      this.temp_user_key = data.temp_user_key;
    }, err => {
      this.dismiss();
      this.presentToast('인증 실패하였습니다.');
    });
  }
  confirm() {
      if(this.mobile == '') {
        this.presentToast('휴대폰 번호를 입력하세요.'); 
        return;
      }
      if(this.temp_user_key == '') {
        this.presentToast('인증코드 입력하세요.'); 
        return;
      }
      if(this.verify_code == '') {
        this.presentToast('인증코드 입력하세요.'); 
        return;
      }
      let params = 'a09';
      let data = '{ ' + 
        '"api_key" : "085ed6a8-b3db-488f-9941-6fc7a40e8f8b", ' +
        '"request_param" : { ' +
          '"user_id" : "", ' + 
          '"user_tel" : "' + this.mobile + '", ' +
          '"temp_user_key" : "' + this.temp_user_key + '", ' + 
          '"cert_gb" : "D", ' + 
          '"cert_no" : "' + this.verify_code + '" ' + 
        '} } ';
      this.presentLoading();
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
            this.presentToast(data.result_msg);  
            return;
        }
        this.navCtrl.push('Reset_passwordPage' , {mobile : this.mobile});
      }, err => {
        this.dismiss();
        this.presentToast('인증 실패하였습니다.');
      });    
  }
  findUserId() {
    this.navCtrl.push('SearchuseridPage');
  }
  goback() {
    this.navCtrl.pop();
  }
}
