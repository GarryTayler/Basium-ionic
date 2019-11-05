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
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage extends BasePage {
  userid = ""; password = "";
  constructor(injector: Injector , public keyboard: Keyboard) {
    super(injector);
  }
  gotoPasswordFind() {
    this.navCtrl.push('Searchid_1Page');
  }
  signin() {
    this.presentLoading();
    let params = 'a06';
    let data = ' { ' +
      '"api_key" : "c8b9041d-7851-476e-a46f-c2fcf8a152da", ' + 
      '"request_param" : { ' + 
        '"user_id" : "' + this.userid + '", ' +
        '"user_pw" : "' + this.password + '" ' +
      ' } } ';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      if(data.result_cd != "S") {
          this.dismiss();
          this.presentToast(data.result_msg);  
          return;
      }
      //this.preferences.set('user_key', data.user_key);
      this.getUserDetail(data.user_key);
    }, err => {
      this.dismiss();
      this.presentToast('접속이 실패하였습니다.');
    })
  }
  getUserDetail(user_key) {
      let params = 'a19';
      let data = '{ ' + 
        '"api_key" : "f1bbf31c-f6f8-4b2d-844b-d4df8afd0974", ' + 
        '"request_param" : { ' + 
          '"user_key" : "' + user_key + '" ' + 
        ' } } ';
        
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        data["user_key"] = user_key;
        this.preferences.set('user' , data);
        this.navCtrl.setRoot('HomePage');
      }, err => {
        this.dismiss();
        this.presentToast('접속이 실패하였습니다.');
      })
  }
  gotoPolicy1() {
    this.navCtrl.push('Service_agreePage');
  }
  gotoPolicy2() {
    this.navCtrl.push('Privacy_profilePage');
  }
  createAccount() {
    this.navCtrl.push('Terms_conditionsPage');
  }
  findUserId() {
    this.navCtrl.push('SearchuseridPage');    
  }
}
