import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '../../base/base';
@IonicPage()
@Component({
  selector: 'page-faqs',
  templateUrl: 'faqs.html'
})
export class FaqsPage extends BasePage {
  tabSelect = "all";
  result_list = [];
  total_list = [];
  selected = -1;
  constructor(injector: Injector) {
    super(injector);
    this.load();
  }
  detailClick (index) {
    if(index == this.selected)
      this.selected = -1;
    else
      this.selected = index;
  }
  tab_choose(tabName) {
    this.tabSelect = tabName;  
    if(this.tabSelect == 'all') {
      this.result_list = this.total_list;
    }
    else if(this.tabSelect == 'accept') {
      this.result_list = [];
      for(var i = 0; i < this.total_list.length; i ++) {
        if(this.total_list[i].type=='일반') {
          this.result_list.push(this.total_list[i]);
        }
      }
    }
    else if(this.tabSelect == 'cancel') {
      this.result_list = [];
      for(var i = 0; i < this.total_list.length; i ++) {
        if(this.total_list[i].type=='접수/결재/취소') {
          this.result_list.push(this.total_list[i]);
        }
      }
    }
    else if(this.tabSelect == 'extra') {
      this.result_list = [];
      for(var i = 0; i < this.total_list.length; i ++) {
        if(this.total_list[i].type=='기타') {
          this.result_list.push(this.total_list[i]);
        }
      }
    }
  }
  back() {
    this.navCtrl.pop();
  }
  load() {
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    } 
    let user_key = user['user_key'];
    this.presentLoading();
    let params = 'a28';
    let data = '{' +
      '"api_key" : "42adadfb-51cf-4e7d-b4d5-46d15ffe5c95", ' +
      '"request_param" : { ' +
        '"user_key" : "a8e121ca-972e-4349-a7c6-b871f80faff3" ' +
      '} }';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      this.total_list = data.data_list;
      this.result_list = this.total_list;
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
}
