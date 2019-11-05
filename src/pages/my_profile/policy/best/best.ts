import { Component, Injector } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../../../base/base';
@IonicPage()
@Component({
  selector: 'page-best',
  templateUrl: 'best.html'
})
export class BestPage extends BasePage {
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
    let params = 'a35';
    let data = '{' +
      '"api_key" : "f807a0fa-c6c0-433d-be6f-99ff4001d9a4"' +
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
