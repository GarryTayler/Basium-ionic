import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '..//..//base/base';
@IonicPage()
@Component({
  selector: 'page-coupon',
  templateUrl: 'coupon.html'
})
export class CouponPage extends BasePage {
  tabSelect = "coupon";
  subtabSelect = 'use';
  coupon_code = ""; user_key = "";
  result_list = [];  user_id = ""; user_tel = "";
  mileage_list = [];
  user: any = null;
  constructor(injector: Injector) {
    super(injector);
    this.user = this.preferences.get('user');
    if (!this.user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = this.user['user_key'];
    this.user_id = this.user.user_id;
    this.user_tel = this.user.user_tel;
    this.tabSelect = this.navParams.get("tab");
    if(this.tabSelect == 'coupon')
      this.couponLoad();
    else if(this.tabSelect == 'fund')
      this.mileageLoad(this.subtabSelect);
  }
  mileageLoad(filter) {
    let params = 'a31';
    let data = '{ ' +
      '"api_key" : "d99f1d95-cea4-48ec-a124-1a274aa34c59", ' +
      '"request_param" : { ' + 
        '"user_key" : "' + this.user_key + '" ' + 
      '} } ';
     this.presentLoading();  
     this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
        }
        this.mileage_list = [];
        if(filter == 'use') {
          for(var i = 0; i < data.data_list.length; i ++) 
            if(data.data_list[i].mileage_type == '사용')
              this.mileage_list.push(data.data_list[i]);
        }
        else {
          for(var i = 0; i < data.data_list.length; i ++) 
            if(data.data_list[i].mileage_type == '적립')
              this.mileage_list.push(data.data_list[i]);
        }        
      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      }); 
  }
  couponLoad() {
      let params = 'a30';
      let data = '{ ' + 
        '"api_key" : "e5b3921b-71ea-4031-b9a1-5d1eca4d020d", ' +
        '"request_param" : { ' + 
          '"user_key" : "' + this.user_key + '" ' +
        '} }';
      this.presentLoading();  
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
        }
        this.result_list = data.data_list;
      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      }); 
  }
  tab_choose(tabName) {
    this.tabSelect = tabName;  
    if(tabName == 'coupon')
      this.couponLoad();
    else
      this.mileageLoad(this.subtabSelect);
  }
  subtab_choose(subtabName) {
    this.subtabSelect = subtabName;
    this.mileageLoad(subtabName);
  }
  back() {
    this.navCtrl.pop();
  }
  issueCoupon() {
      if(this.coupon_code == "") {
        this.presentToast('쿠폰코드를 입력하세요.');
        return;
      }
      let params = 'a29';
      let data = '{ ' + 
        '"api_key" : "f2d465ec-7058-436f-ad67-c1840b95250f", ' + 
        '"request_param" : { ' + 
          '"user_key" : "' + this.user_key + '", ' +
          '"coupon_no" : "' + this.coupon_code + '" ' +
        '} } ';

      this.presentLoading();  
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
        }
        // success case
        this.presentSuccessToast("쿠폰 등록되었습니다.");  
      }, err => {
        this.dismiss();
        this.presentToast('쿠폰등록 실패하였습니다. 다시 시도해 주세요.');
      }); 
  }
}
