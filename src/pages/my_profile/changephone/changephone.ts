import { Component, Injector } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../../base/base';
/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-changephone',
  templateUrl: 'changephone.html',
})
export class ChangephonePage extends BasePage {
  user_id: string = "";
  user_tel: string = "";
  code: string = "";
  temp_user_key: string = "";
  callback = null;
  constructor(injector: Injector) {
    super(injector);
    this.user_id = this.navParams.get('user_id');
    this.callback = this.navParams.get("callback");
  }
  sendVerifyRequest() {
    if(this.user_id == "") {
      this.presentToast("이메일을 입력하세요.");
      return;
    }
    if(this.user_tel == "") {
      this.presentToast("휴대폰 번호를 입력하세요.");
      return;
    }
    let params = 'a08';
    let data = '{ ' + 
      '"api_key" : "545487c0-b7ec-48ad-a5f7-56c93a438ed7", ' + 
      '"request_param" : { ' + 
        '"user_id" : "' + this.user_id + '", ' + 
        '"user_tel" : "' + this.user_tel + '", ' + 
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
          else {
              this.temp_user_key = data['temp_user_key'];
          }
    }, err => {
          this.dismiss();
          this.presentToast('접속이 실패하였습니다.');
    }); 
  }
  confirm() {

    if(this.code == '') {
        this.presentToast('인증코드 입력하세요.'); 
        return;
    }

    let params = 'a09';
    let data = '{ ' + 
      '"api_key" : "085ed6a8-b3db-488f-9941-6fc7a40e8f8b", ' +
      '"request_param" : { ' +
        '"user_id" : "' + this.user_id + '", ' + 
        '"user_tel" : "' + this.user_tel + '", ' +
        '"temp_user_key" : "' + this.temp_user_key + '", ' + 
        '"cert_gb" : "A", ' + 
        '"cert_no" : "' + this.code + '" ' + 
      '} } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
      }
      //this.navCtrl.setRoot('SigninPage');
      this.callback({user_tel:this.user_tel}).then(()=>{
        this.navCtrl.pop();
      });

    }, err => {
      this.dismiss();
      this.presentToast('휴대폰 인증 실패하였습니다.');
    });

  }
  goback() {
    this.navCtrl.pop();
  }
}
