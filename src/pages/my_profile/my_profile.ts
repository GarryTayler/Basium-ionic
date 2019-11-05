import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '../base/base';
@IonicPage()
@Component({
  selector: 'page-my_profile',
  templateUrl: 'my_profile.html'
})
export class My_profilePage extends BasePage {
  result = {};
  coupon_count: number = 0;
  constructor(injector: Injector) {
    super(injector);
    this.load();
  }
  load() {
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.result = user;
    this.couponLoad();
  }
  gotoSetting() {
    this.navCtrl.push('Profile_settingPage');
  }
  gotoCoupon(tab) {
    this.navCtrl.push('CouponPage' , {tab : tab});
  }
  gotoHistory() {
    this.navCtrl.push('EntryPage');
  }
  gotoCalculator() {
    this.navCtrl.push('CalculatorPage');
  }
  gotoPayment() {
    this.navCtrl.push('Card_paymentPage');
  }
  gotoAnnouncement() {
    this.navCtrl.push('AnnouncementPage');
  }
  gotoCatalog() {
    this.navCtrl.push('CatalogPage');
  }
  gotoInquiry() {
    this.navCtrl.push('InquiryPage');
  }
  gotoFAQs() {
    this.navCtrl.push('FaqsPage');
  }
  gotoPolicy() {
    this.navCtrl.push('PolicyPage');
  }
  gotoBasiumService() {
    this.navCtrl.push('Basium_servicePage');
  }
  gotoBest() {
    this.navCtrl.push('BestPage');
  }
  gotoNotifySetting() {
    this.navCtrl.push('Setting_notifyPage');
  }
  couponLoad() {
      let params = 'a30';
      let data = '{ ' + 
        '"api_key" : "e5b3921b-71ea-4031-b9a1-5d1eca4d020d", ' +
        '"request_param" : { ' + 
          '"user_key" : "' + this.result['user_key'] + '" ' +
        '} }';
      this.presentLoading();  
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
        }
        if(!data.data_list)
          this.coupon_count = 0;
        else
          this.coupon_count = data.data_list.length;
      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      }); 
  }

}
