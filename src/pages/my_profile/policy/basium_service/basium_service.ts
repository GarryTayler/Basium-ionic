import { Component, Injector } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../../../base/base';
@IonicPage()
@Component({
  selector: 'page-basium_service',
  templateUrl: 'basium_service.html'
})
export class Basium_servicePage extends BasePage {
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
    let params = 'a34';
    let data = '{' +
      '"api_key" : "7df7f9d8-4f10-4e90-9be2-123e3225a7e8"' +
    '}';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      this.result_str = data;
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
}
