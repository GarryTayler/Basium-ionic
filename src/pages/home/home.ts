import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { BasePage } from '../base/base';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BasePage {
  @ViewChild(Slides) slides: Slides;
  curIndex: number = 0; result_list = []; 
  announcement_list = []; a_selected = -1; user_key = ''; entry_list = [];
  notice_list = [];

  constructor(injector: Injector , public inAppBrowser: InAppBrowser) {
    super(injector);
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = user['user_key'];
    this.load();
    this.getAnnoucementList();
    this.getEntryProgressList();
    this.getNoticeList();
  }
  load() {
    this.presentLoading();
    let params = 'a02';
    let data = '{' +
      '"api_key" : "c6980df4-4232-4c39-9d0d-3484eca223d6"' +
    '}';
    this.server.post(encodeURI(params) , data).subscribe(data => {

      if(data.result_cd != "S") {
        this.dismiss();
        this.presentToast(data.result_msg);
        return;
      }
      this.dismiss();
      this.result_list = data.data_list;
      this.preferences.set("result_list" , this.result_list);
      //this.slides.autoplayDisableOnInteraction = false;
    }, err => {
        this.dismiss();
        //this.presentToast('서버통신 오류.');
        if(this.preferences.get("result_list")) {
          this.result_list = this.preferences.get("result_list");
        }
    })
  }
  slideChanged() {
    this.slides.autoplayDisableOnInteraction = false;
  }
  getAnnoucementList() {
    let params = 'a01';
    let data = '{' +
      '"api_key" : "cd6880a7-da38-4c96-a5aa-b47702d1c97a",' + 
      '"request_param" : {' +
        '"from_dt" : "20190514"' +
      '} }';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      if(data.result_cd != "S") {
        return;
      }
      for(var i = 0; i < (data.data_list.length < 2?data.data_list.length:2); i ++) 
        this.announcement_list.push(data.data_list[i]);

      this.preferences.set("announcement_list" , this.announcement_list);
    }, err => {
      if(this.preferences.get("announcement_list")) {
        this.announcement_list = this.preferences.get("announcement_list");
      }
    })  
  }
  getEntryProgressList() {
    let params = 'a03';
    let data = '{' +
      '"api_key" : "110eef31-1265-47ad-aa5d-878e6e82b0b4", ' +
      '"request_param" : { ' + 
        '"user_key" : "' + this.user_key + '", ' + 
        '"search_gb" : "1", ' + 
        '"sort_gb": "B" ' + 
      ' } } ';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      if(data.result_cd != "S") {
        return;
      }
      for(var i = 0; i < (data.data_list.length < 4?data.data_list.length:4); i ++) {
          switch(data.data_list[i].step1) {
            case '0':
                data.data_list[i]['step_nm'] = '수수료결제';
              break;
            case '1':
                data.data_list[i]['step_nm'] = '수수료완납';
              break;
            case '2':
                data.data_list[i]['step_nm'] = '접수완료';
              break;
            case '3':
                data.data_list[i]['step_nm'] = '세금납부';
              break;
            case '4':
                data.data_list[i]['step_nm'] = '신고필증';
              break;
          }
          this.entry_list.push(data.data_list[i]);
      }
      this.preferences.set("entry_list" , this.entry_list);
    }, err => {
      if(this.preferences.get("entry_list")) {
        this.entry_list = this.preferences.get("entry_list");
      }
    });  
  }
  getNoticeList(flag = 1) {
      let params = 'a37';
      let data = '{ ' + 
        '"api_key" : "68052c20-a6cc-41d9-aecf-a757fed43242", ' + 
        '"request_param" : { ' + 
          '"user_key":"' + this.user_key + '" ' + 
        ' } } ';  
      this.server.post(encodeURI(params) , data).subscribe(data => {
        if(data.result_cd != "S") {
          return;
        }
        for(var i = 0; i < (data.data_list.length < 2?data.data_list.length:2); i ++)  {
          data.data_list[i]['number'] = data.data_list[i]['ems_no'] != '' ? data.data_list[i]['ems_no'] : data.data_list[i]['bl'];
          this.notice_list.push(data.data_list[i]); 
        }
        this.preferences.set("notice_list" , this.notice_list);
      }, err => {
        if(this.preferences.get("notice_list")) {
          this.notice_list = this.preferences.get("notice_list");
        }
      });      
  }
  detailClick (index) {
    if(index == this.a_selected)
      this.a_selected = -1;
    else
      this.a_selected = index;
  }
  goDetail (reg_num) {
    this.navCtrl.push('Entry_detailPage' , {req_num : reg_num});
  }
  presentConfirmWindow(cargoAlertSq) {
    let alert = this.alertCtrl.create({
      message: 'Do you want to remove this notice?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.removeNoticeApi(cargoAlertSq);  
          }
        }
      ]
    });
    alert.present();
  }
  removeNoticeApi(cargoAlertSq) {
    let params = 'a40';
    let data = '{ ' + 
      '"api_key" : "e824a714-e6ab-4719-9064-b9d0e46624fc", ' + 
      '"request_param" : { ' + 
        '"user_key":"' + this.user_key + '", ' + 
        '"cargo_alert_sq":"' + cargoAlertSq + '" ' + 
      ' } } ';  
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
        this.presentToast(data.result_msg);
        return;
      }
      this.notice_list = [];
      this.getNoticeList(2);
    }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    });       
  }
  removeNotice (cargoAlertSq) {
      this.presentConfirmWindow(cargoAlertSq);
  }

  clickBackground (external_link) {
    if(external_link == '')
      return;
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    if( !( external_link.includes('http') || external_link.includes('https') ) )
      external_link = 'https://' + external_link;
    this.inAppBrowser.create( external_link , '_system' , options);
  }
}
