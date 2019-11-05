import { Component, Injector } from '@angular/core';
import { IonicPage , AlertController , Keyboard } from 'ionic-angular';
import { BasePage } from '../../base/base';
@IonicPage()
@Component({
  selector: 'page-exit',
  templateUrl: 'exit.html'
})
export class ExitPage extends BasePage {
  user_key: string = "";
  constructor(injector: Injector , public alertController: AlertController , public keyboard: Keyboard) {
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
  exit_func()  {
      this.presentLoading();
      let params = 'a44';
      let data = '{ ' + 
        '"api_key" : "c46b3070-a346-455e-92d0-33e8b753adbf", ' + 
        '"request_param" : { ' + 
          '"user_key":"' + this.user_key + '" ' + 
        ' } } ';
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
        }
        this.preferences.setEmpty();
        this.navCtrl.setRoot("SigninPage");
      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      }) 
  }

  async presentAlertConfirm() {
    let __this = this;
    const alert = await this.alertController.create({
      message: '탈퇴하기 하시겠습니까?',
      cssClass: 'exit_alert',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '확인',
          handler: () => {
            __this.exit_func();
          }
        }
      ]
    });
    await alert.present();  
  }
  exit() {
    this.presentAlertConfirm();
  }
}
