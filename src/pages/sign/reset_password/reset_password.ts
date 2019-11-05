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
  selector: 'page-reset_password',
  templateUrl: 'reset_password.html',
})
export class Reset_passwordPage extends BasePage {
  password = '';
  con_password = '';
  mobile = '';
  constructor(injector: Injector , public keyboard: Keyboard) {
    super(injector);
    this.mobile = this.navParams.get("mobile");
  }
  cancel() {
    this.navCtrl.setRoot('SigninPage');
  }
  resetPassword() {
    if( this.mobile == '' ) {
      this.presentToast('휴대폰 번호를 입력하세요.');
      return;
    }
    if( this.password.length < 8 ) {
      this.presentToast('비밀번호는 8자이상 32자 이하로 입력하세요');
      return;
    }
    if( this.password.length > 32 )  {
      this.presentToast('비밀번호는 8자이상 32자 이하로 입력하세요');
      return;
    }
    let letterNumber = /^[a-zA-Z]+$/;
    if( !(/[a-zA-Z]/.test(this.password)) ) {
      this.presentToast('비밀번호는 영문,숫자,특수문자를 포함하여  8자이상으로 설정하여야 합니다.');
      return;
    }
    letterNumber = /^[0-9]+$/;
    if( !(/\d/.test(this.password)) ) {
      this.presentToast('비밀번호는 영문,숫자,특수문자를 포함하여  8자이상으로 설정하여야 합니다.');
      return;
    }
    letterNumber = /^[A-Za-z0-9 ]+$/
    if(letterNumber.test(this.password)) {
      this.presentToast('비밀번호는 영문,숫자,특수문자를 포함하여  8자이상으로 설정하여야 합니다.');
      return;
    }
    if( this.password != this.con_password ) {
      this.presentToast('아이디 혹은 비밀번호가 일치하지 않습니다.');
      return;
    }

    this.presentLoading();
    let params = 'a12';
    let data = '{ ' +
      '"api_key" : "284e6f8d-c443-4d2a-bd14-493b76588325", ' + 
      '"request_param" : { ' + 
        '"user_tel" : "' + this.mobile + '", ' + 
        '"user_pw" : "' + this.password + '" ' + 
      ' } } ';

    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
      }
      this.navCtrl.setRoot('SigninPage');
    }, err => {
      this.dismiss();
      this.presentToast('암호 재설정 실패.');
    })
  }
  goback() {
    this.navCtrl.pop();
  }
}
