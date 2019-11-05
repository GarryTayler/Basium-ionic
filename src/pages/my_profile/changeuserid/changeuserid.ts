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
  selector: 'page-changeuserid',
  templateUrl: 'changeuserid.html',
})
export class ChangeuseridPage extends BasePage {
  userid : string = '';
  success_flag: boolean = false;
  callback = null;
  constructor(injector: Injector) {
    super(injector);
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.callback = this.navParams.get("callback");
  }

  sendVerifyRequest() {
    if(this.userid == '') {
      this.presentToast("이메일을 입력하세요.");
      return;
    }
    let params = 'a08';
    let data = '{ ' + 
      '"api_key" : "545487c0-b7ec-48ad-a5f7-56c93a438ed7", ' + 
      '"request_param" : { ' + 
        '"user_id" : "' + this.userid + '", ' + 
        '"user_tel" : "", ' + 
        '"cert_type" : "A", ' + 
        '"cert_gb" : "B" ' + 
       ' } } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
          this.dismiss();
          if(data.result_cd != "S") {
              this.presentToast(data.result_msg);  
              this.navCtrl.pop();
              return;
          }
          else {
              this.success_flag = true;
              this.callback({success:true}).then(()=>{
                this.navCtrl.pop();
              });
          }
    }, err => {
          this.dismiss();
          this.presentToast('접속이 실패하였습니다.');
          this.navCtrl.pop();
    }); 
  }
  goback() {
    this.navCtrl.pop();
  }
  confirm() {
  }
}
