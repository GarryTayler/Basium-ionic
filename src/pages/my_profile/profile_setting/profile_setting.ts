import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , AlertController } from 'ionic-angular';
import { BasePage } from '../../base/base';
declare var jquery: any;
declare var $: any;
@IonicPage()
@Component({
  selector: 'page-profile_setting',
  templateUrl: 'profile_setting.html'
})
export class Profile_settingPage extends BasePage {

  @ViewChild('input') myInput;

  searchAddress_visit = false;
  userid = ""; mobile = ""; zipcode = "";
  password = ""; user_pcc = ""; user_key = "";
  name = "";  user_addr1 = ""; user_addr2 = "";
  user = null; position = 'main';
  is_address_access = false;
  constructor(injector: Injector , public alertController: AlertController) {
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
    this.zipcode = this.user.user_post;
    this.user_addr1 = this.user.user_addr1;
    this.user_addr2 = this.user.user_addr2;
    this.user_pcc = this.user.user_pcc;

      var __this = this;
      window.addEventListener('message', (event) => { 
          __this.zipcode = event.data.zonecode;
          __this.user_addr1 = event.data.fullAddr;
          __this.is_address_access = true;
          $('.mainWindow').show();
          $('.navar_top').show();
          $('.searchWindow').hide();   
          setTimeout(() => {
            __this.myInput.setFocus();
          },150);
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
    if(this.is_address_access)
      this.navCtrl.push('My_profilePage');
    else
      this.navCtrl.pop();
  }
  save() {
    if(this.user_pcc == "") {
      this.presentToast('통관고유부호를 입력하세요.');
      return;
    }
    if(this.zipcode == "") {
      this.presentToast('주소지를 확인하세요.');
      return;
    }
    if(this.user_addr1 == "") {
      this.presentToast('주소를 입력하세요.');
      return;
    }
    if(this.name == "") {
      this.presentToast('이름을 입력하세요.');
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
        '"user_post" : "' + this.zipcode + '", ' +
        '"user_nm" : "' + this.name + '" ' +
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
      this.user['user_nm'] = this.name;
      this.preferences.set('user' , this.user); 
      this.presentSuccessToast("정보가 변경되었습니다.");
      this.navCtrl.push('My_profilePage');
    }, err => {
      this.dismiss();
      this.presentToast('정보수정 실패.');
    });

  }
  changeUserId() {
    let __this = this;
    let myCallbackFunction = (_params) => {
      return new Promise((resolve , reject) => {
          if(_params['success']) {
            let params = 'a19';
            let data = '{ ' + 
              '"api_key" : "f1bbf31c-f6f8-4b2d-844b-d4df8afd0974", ' + 
              '"request_param" : { ' + 
                '"user_key" : "' + __this.user_key + '" ' + 
              ' } } ';
            __this.presentLoading();
            __this.server.post(encodeURI(params) , data).subscribe(data => {
              __this.dismiss();
              __this.preferences.set('user' , data);
              __this.userid = data['user_id'];
              __this.user['user_id'] = __this.userid;
            }, err => {
              __this.dismiss();
            })
          }
          resolve();
      });
    }

    this.navCtrl.push('ChangeuseridPage' , {callback: myCallbackFunction});
  }  
  changeUserMobile() {
      let __this = this;
      let myCallbackFunction = (_params) => {
        return new Promise((resolve , reject) => {
            __this.mobile = _params['user_tel'];
            __this.user['user_tel'] = __this.mobile;
            __this.preferences.set('user' , __this.user);
            resolve();
        });
      }
      this.navCtrl.push('ChangephonePage' , {user_id : this.userid , callback: myCallbackFunction});
  }  
  changeUserPassword() {
    this.navCtrl.push("Change_passwordPage");
  }
  searchAddress() {
      //this.position = 'search';
      $('.mainWindow').hide();
      $('.navar_top').hide();
      $('.searchWindow').show();
      if(!this.searchAddress_visit) {
        var iframe = $('#iframe');
        iframe[0].src = iframe[0].src;
        setTimeout(function() {
          $('#iframe').css('visibility' , 'visible');
        } , 500);
      }
      this.presentLoading();
      var __this = this;
      setTimeout(function(){
        __this.dismiss();
      } , 2000);
      this.searchAddress_visit = true;
  }
  close() {
    //this.position = 'main';
    $('.mainWindow').show();
    $('.navar_top').show();
    $('.searchWindow').hide();
  }
  logout() {
    this.presentAlertConfirm();    
  }
  exit() {
    this.navCtrl.push('ExitPage');
  }
  async presentAlertConfirm() {
    let __this = this;
    const alert = await this.alertController.create({
      message: '로그 아웃 하시겠습니까?',
      cssClass: 'logout_alert',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: '확인',
          handler: () => {
            __this.preferences.setEmpty();
            __this.navCtrl.setRoot("SigninPage");
          }
        }
      ]
    });
    await alert.present();  
  }
}
