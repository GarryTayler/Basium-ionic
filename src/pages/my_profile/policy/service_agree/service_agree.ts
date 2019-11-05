import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '../../../base/base';
@IonicPage()
@Component({
  selector: 'page-service_agree',
  templateUrl: 'service_agree.html'
})
export class Service_agreePage extends BasePage {
  result_str = {};
  constructor(injector: Injector) {
    super(injector);
    this.load();
  }
  back() {
    this.navCtrl.pop();
  }
  load() {
    this.presentLoading();
    let params = 'a33';
    let data = '{' +
      '"api_key" : "e7fbbbcb-29ce-4fce-a09a-03a7d8314537"' +
    '}';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      this.result_str = data.data_list[0];
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
}
