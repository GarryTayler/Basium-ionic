import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '../../base/base';
declare var jquery: any;
declare var $: any;
@IonicPage()
@Component({
  selector: 'page-profile_setting_1',
  templateUrl: 'profile_setting_1.html'
})
export class Profile_settingPage_1 extends BasePage {

  @ViewChild('input') myInput;

  userid = ""; mobile = ""; zipcode = "";
  password = ""; user_pcc = ""; user_key = "";
  name = "";  user_addr1 = ""; user_addr2 = "";
  user = null; position = 'main';
  constructor(injector: Injector) {
    super(injector);
    this.user = this.preferences.get('user');
    if (!this.user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = this.user['user_key'];
    this.userid = this.user.user_id;
    this.mobile = this.user.user_tel;
    this.name = this.user.user_nm;
    this.user_addr1 = this.user.user_addr1;
    this.user_addr2 = this.user.user_addr2;
    this.user_pcc = this.user.user_pcc;
    this.zipcode = this.user.user_post;
    
      var __this = this;
      window.addEventListener('message', (event) => { 
          __this.zipcode = event.data.zonecode;
          __this.user_addr1 = event.data.fullAddr;
          __this.navCtrl.setRoot('Profile_settingPage_1' , {'zipcode':__this.zipcode , 'addr':__this.user_addr1});
         // __this.navCtrl.setRoot('Profile_settingPage' , {'zipcode':__this.zipcode , 'addr':__this.user_addr1});
      });   

      if( this.navParams.get("zipcode") ) {
          this.zipcode = this.navParams.get("zipcode");
          this.user_addr1 = this.navParams.get("addr");
          setTimeout(() => {
            __this.myInput.setFocus();
          },150);
      }
  }
  back() {
    this.navCtrl.setRoot('My_profilePage');
  }
  save() {
    if(this.user_pcc == "") {
      this.presentToast('통관고유부호를 입력하세요.');
      return;
    }
    if(this.zipcode == "") {
      this.presentToast('우편번호를 입력하세요.');
      return;
    }
    if(this.user_addr1 == "") {
      this.presentToast('주소를 입력하세요.');
      return;
    }
    let params = 'a20';
    let data = '{' +
      '"api_key" : "a9d7f9f5-2a54-407e-8e06-777330b69561", ' +
      '"request_param" : { ' +
        '"user_key" : "' + this.user_key + '", ' +
        '"user_pcc" : "' + this.user_pcc + '", ' + 
        '"user_addr1" : "' + (this.user_addr1) + '", ' +
        '"user_addr2" : "' + this.user_addr2 + '", ' + 
        '"user_post" : "' + this.zipcode + '" ' +
      ' } } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
      }
      this.user['user_pcc'] = this.user_pcc;
      this.user['user_addr1'] = this.user_addr1;
      this.user['user_addr2'] = this.user_addr2; 
      this.user['user_post'] = this.zipcode;
      this.preferences.set('user' , this.user); 
      this.navCtrl.setRoot('My_profilePage');
      //this.navCtrl.parent();
      //this.navCtrl.popToRoot();
      //this.navCtrl.pop();
      //this.navCtrl.first();
    }, err => {
      this.dismiss();
      this.presentToast('정보수정 실패.');
    });

  }
  changeUserId() {
    if(this.userid == "") {
      this.presentToast('이메일을 입력하세요.');
      return;
    }
    let params = 'a21';
    let data = '{ ' +
      '"api_key" : "8d4f03a4-9870-4d1c-bf1a-fa298b6ae7f7", ' + 
      '"request_param" : { ' + 
        '"user_key" : "' + this.user_key + '", ' +
        '"user_id" : "' + this.userid + '" ' +
      '} } ';
      
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
            this.presentToast(data.result_msg);  
            return;
        }
        this.user['user_id'] = this.userid;
        this.preferences.set('user' , this.user);
        this.presentToast("이메일 변경되었습니다.");  
      }, err => {
        this.dismiss();
        this.presentToast('이메일 변경 실패.');
    });
  }  
  changeUserMobile() {
      if(this.mobile == "") {
        this.presentToast('휴대폰 번호를 입력하세요.');
        return;
      }
      let params = 'a23';
      let data = '{ ' +
        '"api_key" : "92701745-145f-4130-aa3c-6f07e0df45e4", ' + 
        '"request_param" : { ' +
          '"user_key" : "' + this.user_key + '", ' +
          '"user_tel" : "' + this.mobile + '" ' +
        ' } } '; 
      this.presentLoading(); 
      this.server.post(encodeURI(params) , data).subscribe(data => {
          this.dismiss();
          if(data.result_cd != "S") {
              this.presentToast(data.result_msg);  
              return;
          }
          this.user['user_tel'] = this.mobile;
          this.preferences.set('user' , this.user);
          this.presentToast("전화번호가 변경되었습니다.");  
        }, err => {
          this.dismiss();
          this.presentToast('전화번호 변경 실패.');
      });
  }  
  changeUserPassword() {
    this.navCtrl.push("Change_passwordPage");
  }
  searchAddress() {
      this.position = 'search';
      this.presentLoading();
      var __this = this;
      setTimeout(function(){
        __this.dismiss();
      } , 2000);
  }
  close() {
    this.position = 'main';
  }
}
