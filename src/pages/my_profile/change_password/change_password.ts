import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '../../base/base';
@IonicPage()
@Component({
  selector: 'page-change_password',
  templateUrl: 'change_password.html'
})
export class Change_passwordPage extends BasePage {
  user_key = ""; prev_password = "";
  password = ""; password_con = "";
  constructor(injector: Injector) {
    super(injector);
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = user['user_key'];
  }
  back() {
    this.navCtrl.pop();
  }
  save() {
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
    if( this.password != this.password_con ) {
      this.presentToast('아이디 혹은 비밀번호가 일치하지 않습니다.');
      return;
    }    

    let params = 'a22';
    let data = '{ ' + 
      '"api_key" : "1a946acf-5eee-43c1-a286-ed987cb22f86", ' + 
      '"request_param" : { ' + 
        '"user_key" : "' + this.user_key + '", ' + 
        '"user_pw_before" : "' + this.prev_password + '", ' + 
        '"user_pw_after" : "' + this.password + '" ' +
      ' } } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
          this.dismiss();
          if(data.result_cd != "S") {
              this.presentToast(data.result_msg);  
              return;
          }
          else {
              this.navCtrl.pop();
          }
    }, err => {
          this.dismiss();
          this.presentToast('비밀번호 변경 실패.');
    }); 

  }
}
