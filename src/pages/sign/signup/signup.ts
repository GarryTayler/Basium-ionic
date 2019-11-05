import { Component, Injector } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../../base/base';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage extends BasePage {

  userid = ""; name = ""; email_alert_agree = "N";
  mobile = ""; verification_code = "";
  password = ""; con_password = ""; temp_user_key = "";

  constructor(injector: Injector) {
    super(injector);
    this.email_alert_agree = this.navParams.get("email_alert_agree") == true ? "Y" : "N" ;
  }

  verification() {
    if(this.mobile == "") {
      this.presentToast('휴대전화번호를 입력하세요.');
      return;
    }
    this.presentLoading();
    let params = 'a08';
    let data = '{' +
      ' "api_key" : "545487c0-b7ec-48ad-a5f7-56c93a438ed7", ' + 
      ' "request_param" : { ' + 
      ' "user_id" : "' + this.userid + '", ' + 
      ' "user_tel" : "' + this.mobile + '", ' + 
      ' "cert_type" : "B", ' + 
      ' "cert_gb" : "A" ' + 
      ' } } ';

      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
            this.presentToast(data.result_msg);  
            return;
        }
        this.temp_user_key = data.temp_user_key;
      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      }); 
  }

  goback() {
    this.navCtrl.pop();
  }

  do_verification() {
    if(this.mobile == "") {
      this.presentToast('휴대전화번호를 입력하세요.');
      return;
    }
    if(this.verification_code == "") {
      this.presentToast('인증코드 입력하세요.');
      return;
    }
    if(this.temp_user_key == '') {
      this.presentToast('인증코드 입력하세요.');
      return;
    }
    let params = 'a09';
    let data = '{ ' +
      '"api_key" : "085ed6a8-b3db-488f-9941-6fc7a40e8f8b", ' +
      '"request_param" : { ' +
        '"user_id" : "' + this.userid + '", ' + 
        '"user_tel" : "' + this.mobile + '", ' + 
        '"temp_user_key" : "' + this.temp_user_key + '", ' +
        '"cert_gb" : "A", ' +
        '"cert_no" : "' + this.verification_code + '" ' +
      '} }';
      this.presentLoading();
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
            this.presentToast(data.result_msg);  
            return;
        }
        else {
            //success toast
            this.presentSuccessToast("인증 성공하였습니다.");  
        }
      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      }); 
  }
  signup() {
    if( this.userid == "" ) {
      this.presentToast('이메일을 입력하세요.');
      return;
    }
    if( this.mobile == "" ) {
      this.presentToast('휴대전화번호를 입력하세요.');
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
    
    let params = 'a07';
    let data = '{ ' + 
      ' "api_key" : "77eed512-7db8-4230-950c-0eb975cafd66", ' + 
      ' "request_param" : { ' +
      ' "user_id" : "' + this.userid + '", ' +
      ' "user_pw" : "' + this.password + '", ' +
      ' "email_alert_agree" : "' + this.email_alert_agree + '", ' +  
      ' "user_nm" : "' + this.name + '", ' + 
      ' "user_tel" : "' + this.mobile + '", ' + 
      ' "user_pcc" : "", ' + 
      ' "user_addr1" : "", ' + 
      ' "user_addr2" : "", ' + 
      ' "user_post" : "" ' +
      ' } } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
      }
      else {
          this.navCtrl.setRoot('VerificationPage' , {email:this.userid , mobile: this.mobile});
      }
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    }); 
  } 
}
