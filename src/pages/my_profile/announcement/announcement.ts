import { Component, Injector } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../../base/base';
@IonicPage()
@Component({
  selector: 'page-announcement',
  templateUrl: 'announcement.html'
})
export class AnnouncementPage extends BasePage {
  result_list = [];
  selected = -1;
  constructor(injector: Injector) {
    super(injector);
    this.load();
  }
  load() {
    this.presentLoading();
    let params = 'a01';
    let data = '{' +
      '"api_key" : "cd6880a7-da38-4c96-a5aa-b47702d1c97a",' + 
      '"request_param" : {' +
        '"from_dt" : "20190514"' +
      '} }';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      this.result_list = data.data_list;
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
  detailClick (index) {
    if(index == this.selected)
      this.selected = -1;
    else
      this.selected = index;
  }
  back() {
    this.navCtrl.pop();
  }
}
