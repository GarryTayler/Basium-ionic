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
  selector: 'page-verification',
  templateUrl: 'verification.html',
})
export class VerificationPage extends BasePage {
  email = ''; temp_user_key = ''; verify_code = '';
  mobile = ''; 
  retry : boolean = false;
  new_email: string = '';
  constructor(injector: Injector , public keyboard: Keyboard) {
    super(injector);
    this.email = this.navParams.get("email");
    this.mobile = this.navParams.get("mobile");
    //this.email = "TestAllen@gmail.com";
    //this.mobile = '021039288374834';
    this.new_email = this.email;
  }
  gotoSignin () {
   /* if(this.email == '') {
      this.presentToast('이메일을 입력하세요.'); 
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
        '"user_id" : "' + this.email + '", ' + 
        '"user_tel" : "", ' +
        '"temp_user_key" : "' + this.temp_user_key + '", ' + 
        '"cert_gb" : "B", ' + 
        '"cert_no" : "' + this.verify_code + '" ' + 
      '} } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
      }
      this.navCtrl.setRoot('SigninPage');
    }, err => {
      this.dismiss();
      this.presentToast('이메일 인증 실패하였습니다.');
    });  */
    this.navCtrl.setRoot('SigninPage');
  }
  goback () {
    this.navCtrl.setRoot('SignupPage');
  }

  sendVerifyRequest() {
    this.retry = true;
    this.email = this.new_email;
    if(this.email == '') {
      this.presentToast('이메일을 입력하세요.'); 
      return;
    }
    let params = 'a08';
    let data = '{ ' +
      '"api_key" : "545487c0-b7ec-48ad-a5f7-56c93a438ed7", ' +
      '"request_param" : { ' +
        '"user_id" : "' + this.email + '", ' +
        '"user_tel" : "' + this.mobile + '", ' +
        '"cert_type" : "A", ' + 
        '"cert_gb" : "A" ' +
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

}
