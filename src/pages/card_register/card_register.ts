import { Component, Injector } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../base/base';
import { Common } from '../../common';
import BootPay from "bootpay-js";
declare var BootPay: any;
/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-card_register',
  templateUrl: 'card_register.html',
})
export class Card_registerPage extends BasePage {
  card_number = ''; card_no = ''; bank_card_number = ''; bank_name = '';
  card_cvc = ''; card_comp = 'BC'; card_pw = '';
  card_birth = ''; card_mmyy = ''; mm = ''; yy = '';
  card_number1 = ''; card_number2 = ''; card_number3 = ''; card_number4 = '';
  user_key = "";  user = null; billing_key = '';
  constructor(injector: Injector) {
    super(injector);

    this.user = this.preferences.get('user');
    if (!this.user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = this.user['user_key'];

    if(this.navParams.get('card_no')) {
        this.card_comp = this.navParams.get('card_comp');
        this.card_number = this.navParams.get('card_num');
        this.card_no = this.navParams.get('card_no');
        this.billing_key = this.navParams.get('billing_key');
        let jbSplit = this.card_number.split('-');
        this.card_number1 = jbSplit[0]; this.card_number2 = jbSplit[1]; this.card_number3 = jbSplit[2]; this.card_number4 = jbSplit[3];
        this.bank_card_number = this.card_number1;
    }
    else {
        if(this.navParams.get('card_number1')) {
          this.card_number = this.navParams.get('card_number1') + '-' + this.navParams.get('card_number2') + '-' + this.navParams.get('card_number3') + '-' + this.navParams.get('card_number4');
          this.bank_card_number = this.navParams.get('card_number1');
          this.card_mmyy = this.navParams.get('card_mm') + '/' + this.navParams.get('card_yy');
          this.mm = this.navParams.get('card_mm');
          this.yy = this.navParams.get('card_yy');
        }
    }
    let common = new Common();
    common.getCardName(this.card_number1 , this.card_number2);
    this.bank_name = common.card_bank_name;
  } 
  back() {
      this.navCtrl.pop();
  }
  cardRegister() {
      if(this.card_number == '') {
        this.presentToast("카드번호를 입력하세요.");  
        return;
      }
      if(this.card_pw == '') { 
        this.presentToast("비밀번호를 입력하세요.");  
        return;
      }
      if(this.card_birth == '') { 
        this.presentToast("생년월일을 입력하세요.");  
        return;
      }
      if(this.mm == '' || this.yy == '') {
        this.presentToast("유효기간을 입력하세요.");  
        return;
      }
      this.card_mmyy = this.mm + '/' + this.yy; 

      /*if(this.card_no == '') {
            let __this = this;
            let order_id = Math.floor(Date.now() / 1000).toString() + this.card_number;
            BootPay.request({
              price: 0, 
              application_id: Common.application_id,
              name: '정기적인 결제', 
              pg: 'danal',
              method: 'card_rebill', 
              show_agree_window: 0, 
              user_info: {
                username: this.user['user_nm'],
                email: this.user['user_id'],
                addr: this.user['user_addr1'] + ' ' + this.user['user_addr2'],
                phone: this.user['user_tel']
              },
              order_id: order_id, //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
              params: {email: this.user['user_id'], phone: this.user['user_tel'], card_number: this.card_number},
              extra: {
                start_at: '', // 정기 결제 시작일 - 시작일을 지정하지 않으면 그 날 당일로부터 결제가 가능한 Billing key 지급
                end_at: '' // 정기결제 만료일 -  기간 없음 - 무제한
              }
            }).error(function (data) {
              //결제 진행시 에러가 발생하면 수행됩니다.
              console.log(data);
            }).cancel(function (data) {
              //결제가 취소되면 수행됩니다.
              console.log(data);
            }).done(function (data) {
              // 빌링키를 정상적으로 가져오면 해당 데이터를 불러옵니다.
              __this.billing_key = data['billing_key'];
              __this.register_card();
            });        
      }
      else { */
        this.register_card();
      //}   
  }
  register_card() {
    let params = 'a25';
    let data = ' { ' +
      '"api_key" : "5777268a-5942-4fcc-9ec6-11e2699c06aa", ' + 
      '"request_param" : { ' + 
        '"user_key" : "' + this.user_key + '", ' + 
        '"card_no" : "' + this.card_no + '", ' + 
        '"card_num" : "' + this.card_number + '", ' + 
        '"card_pw" : "' + this.card_pw + '", ' +
        '"card_birth" : "' + this.card_birth + '", ' +
        '"card_mmyy" : "' + this.card_mmyy + '" ' +
        ' } } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
      }
      else {
        /* fix later */
          if(this.card_no == '') {
            this.presentSuccessToast("카드 정보가 등록되었습니다.");  
            this.navCtrl.pop();
          }
          else {
            this.presentSuccessToast("카드 정보가 변경되었습니다.");  
            this.navCtrl.pop();
          }
      }
    }, err => {
        this.dismiss();
        if(this.card_no == '')
          this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
        else
          this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    });     
  }
}
