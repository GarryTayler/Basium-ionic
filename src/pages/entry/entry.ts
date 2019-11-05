import { Component, Injector } from '@angular/core';
import { IonicPage , ActionSheetController } from 'ionic-angular';
import { BasePage } from '../base/base';
@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html'
})
export class EntryPage extends BasePage {
  result_list = []; user_key = '';
  constructor(injector: Injector, public actionSheetController: ActionSheetController) {
    super(injector);
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = user['user_key'];
    this.load();    
  }
  load(sort_gb = 'A') {
    this.presentLoading();
    let params = 'a03';
    let data = '{ ' + 
      '"api_key" : "110eef31-1265-47ad-aa5d-878e6e82b0b4", ' + 
      '"request_param" : { ' + 
        '"user_key" : "' + this.user_key + '", ' + 
        '"search_gb" : "2", ' + 
        '"sort_gb": "' + sort_gb + '" ' + 
      '} } ';      
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if( data.result_cd != "S" ) {
        this.presentToast(data.result_msg);  
        return;
      }
      for(var i = 0; i < data.data_list.length; i ++) 
      {
        switch(data.data_list[i].step1) {
            case "0":
              data.data_list[i].step1_nm = '수수료결제';
              break;
            case "1":
              data.data_list[i].step1_nm = '수수료완납';
              break;
            case "2":
              data.data_list[i].step1_nm = '접수완료';
              break;
            case "3":
              data.data_list[i].step1_nm = '세금납부';
              break;
            case "4":
              data.data_list[i].step1_nm = '신고필증';
              break;
        }
      }
      this.result_list = data.data_list;
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
  do_action () {
  }
  do_filter() {
    this.presentActionSheet();
  }
  goDetail (reg_num) {
    this.navCtrl.push('Entry_detailPage' , {req_num : reg_num});
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: '최신접수순',
        handler: () => {
          this.load('A');
        }
      }, {
        text: '처리진행순',
        handler: () => {
          this.load('B');
        }
      }, {
        text: '통관완료순',
        handler: () => {
          this.load('C');
        }
      }, {
        text: '높은가격순',
        handler: () => {
          this.load('D');
        }
      }, {
        text: '닫기',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
  
}
