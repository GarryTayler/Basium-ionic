import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '../base/base';
import { CardIO } from '@ionic-native/card-io';
@IonicPage()
@Component({
  selector: 'page-card_payment',
  templateUrl: 'card_payment.html'
})
export class Card_paymentPage extends BasePage {
  @ViewChild(Slides) slides: Slides;
  curIndex: number = 0;
  result_list = [];
  slide_count = 0; 
  constructor(injector: Injector , private cardIO: CardIO) {
    super(injector);
    this.load();
  }
  load() {
    //let user_key = this.preferences.get('user_key');
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    let user_key = user['user_key'];
    this.presentLoading();
    let params = 'a24';
    let data = '{ ' + 
      '"api_key" : "607d835a-e2e4-4f9e-814a-69f9ef70dfa2", ' + 
      '"request_param" : { ' + 
        '"user_key" : "' + user_key + '" ' + //need to change it later    a8e121ca-972e-4349-a7c6-b871f80faff3
      ' } } ';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
        this.presentToast(data.result_msg);
        return;
      }
      this.result_list = data.data_list;
      this.slide_count = data.data_list.length + 1;
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
  slideChanged() {
    this.curIndex = this.slides.getActiveIndex();
  }
  next() {
    this.slides.slideNext();
  }
  back() {
    this.navCtrl.setRoot('My_profilePage');
  }
  clickCard() {
      let __this = this;
      this.cardIO.canScan()
      .then(
        (res: boolean) => {
          if(res){
            let options = {
              requireExpiry: true,
              requireCVV: false,
              requirePostalCode: false,
              hideCardIOLogo: false
            };
            const promise = this.cardIO.scan(options);
            let ___this = __this;
            promise.then((res) => {
                let card_number1 = '', card_number2 = '', card_number3 = '', card_number4 = '' , card_mm = '' , card_yy = '';
                card_number1 = res.cardNumber.substr(0, 4);
                card_number2 = res.cardNumber.substr(4, 4);
                card_number3 = res.cardNumber.substr(8, 4);
                card_number4 = res.cardNumber.substr(12, 4);
                if(res.expiryMonth < 10)
                  card_mm = '0' + res.expiryMonth.toString();
                else
                  card_mm = res.expiryMonth.toString();
                card_yy = res.expiryYear.toString().substr(2,2);
                ___this.navCtrl.push('Card_registerPage' , {card_number1:card_number1,card_number2:card_number2,card_number3:card_number3,card_number4:card_number4,card_mm:card_mm , card_yy:card_yy});
            });
          }
        }
      );
  }
  card_edit(card_comp , card_num , card_no , billing_key) {
    this.navCtrl.push('Card_registerPage' , {card_comp:card_comp , card_num:card_num , card_no:card_no , billing_key:billing_key});
  }
}
