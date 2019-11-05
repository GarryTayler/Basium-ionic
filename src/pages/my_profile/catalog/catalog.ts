import { Component, Injector, ViewChild } from '@angular/core';
import { BasePage } from '../../base/base';
import { Slides, IonicPage } from 'ionic-angular';

/**
 * Generated class for the WalkthroughPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-catalog',
  templateUrl: 'catalog.html',
})

export class CatalogPage extends BasePage {

  @ViewChild(Slides) slides: Slides;
  curIndex: number = 0; result_list = []; slide_count = 0;
  constructor(injector: Injector) {
    super(injector);
    this.load();
  }
  slideChanged() {
    this.curIndex = this.slides.getActiveIndex();
  }
  next() {
    this.slides.slideNext();
  }
  back() {
    this.navCtrl.pop();
  }
  load() {
    this.presentLoading();
    let params = 'a32';
    let data = '{' +
      '"api_key" : "b69ceea6-2c99-4ecf-875f-447f61db23e8"' +
    '}';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      this.result_list = data.data_list;
      this.slide_count = data.data_list.length;
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
}
