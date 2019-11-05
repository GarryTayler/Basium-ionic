import { Component, Injector } from '@angular/core';
import { IonicPage , ActionSheetController , Platform } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { AppAvailability } from '@ionic-native/app-availability';
import { CallNumber } from '@ionic-native/call-number';
import { BasePage } from '../base/base';
import { Common } from '../../common';
import BootPay from "bootpay-js";
//import * as launcher from '../../assets/js/start-app';
declare var launcher: any;
declare var jquery: any;
declare var $: any;
declare var BootPay: any;
@IonicPage()
@Component({
  selector: 'page-entry_detail',
  templateUrl: 'entry_detail.html'
})
export class Entry_detailPage extends BasePage {
  req_number = ""; user_key = ""; result = {};
  img_url = "";    user = null; card_list = [];
  mileage_value = '0';
  active_coupon_no = '쿠폰 선택';
  active_coupon_amount = 0;
  active_mileage = 0;
  is_payment_access = false;
  constructor(injector: Injector, private platform: Platform, public actionSheetController: ActionSheetController , public inAppBrowser: InAppBrowser, private callNumber: CallNumber, private appAvailability: AppAvailability) {
    super(injector);
    this.user = this.preferences.get('user');
    if (!this.user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = this.user['user_key'];
    this.req_number = this.navParams.get("req_num");
    this.load();
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'entry_submenu_asheet',
      buttons: [{
        text: '접수변경',
        handler: () => {
          this.navCtrl.setRoot('ConfirmPage');
        }
      }, {
        text: '접수취소',
        handler: () => {
        }
      },  {
        text: '닫기',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  //click submenu
  clickSubMenu() {
    this.presentActionSheet();
  }
  goback() {
  }
  load() {
    let params = 'a04';
    let data = '{ ' + 
      '"api_key" : "55a0fa84-b4aa-431d-b6cd-36b432f44565", ' + 
      '"request_param" : { ' + 
        '"user_key" : "' + this.user_key + '", ' + 
        '"reg_number" : "' + this.req_number + '" ' +
      '} } ';

    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      this.result = data;
      this.img_url = "./assets/icon/progress_circle_" + this.result['step1'] + "_4.png";
      if(this.result['step1'] == "0") {
        this.result['step1_nm'] = '수수료결제';
      }
      else if(this.result['step1'] == "1") {
        this.result['step1_nm'] = '수수료완납';
      }
      else if(this.result['step1'] == "2") {
        this.result['step1_nm'] = '접수완료';
      }
      else if(this.result['step1'] == "3") {
        this.result['step1_nm'] = '세금납부';
      }
      else if(this.result['step1'] == "4") {
        this.result['step1_nm'] = '신고필증';
      }
      for(var i = 0; i < this.result["history"].length; i ++) {
        switch(this.result["history"][i]["his_step1"]) {
          case "0":
              this.result["history"][i]["progress"] = "수수료결제";
            break;
          case "1":
              this.result["history"][i]["progress"] = "수수료완납";
            break;
          case "2":
              this.result["history"][i]["progress"] = "접수완료";
            break;
          case "3":
              this.result["history"][i]["progress"] = "세금납부";
            break;
          case "4":
              this.result["history"][i]["progress"] = "신고필증";
            break;
        }
      }
      for(var k = 0; k < this.result["items"].length; k ++) {
        this.result["items"][k]["invoice_yn"] = "N";
        for(var j = 0; j < this.result["items"][k]["attach_file_list"].length; j ++)
          if(this.result["items"][k]["attach_file_list"][j].attach_type == 'I') {
              this.result["items"][k]["invoice_yn"] = "Y";
              break;
          }
      }
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
  calling(mobile_number) {
    mobile_number = (mobile_number == '')?'02073627291':mobile_number;
    this.callNumber.callNumber(mobile_number, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
  goItemDetail(item_no) {
      let item_product = {};
      for(var i = 0; i < this.result['items'].length; i ++) {
          if(this.result['items'][i]['item_no'] == item_no) {
            item_product = this.result['items'][i];
            break;
          }
      }
      item_product['bl'] = this.result['bl'];
      item_product['exporter_nm'] = this.result['exporter_nm'];
      item_product['exporter_cc'] = this.result['exporter_cc'];
      
      /*item_product['bl_list'] = this.result['bl_list'];
      item_product['br_list'] = this.result['br_list'];
      item_product['coe_list'] = this.result['coe_list'];*/

      item_product['bl_list'] = []; item_product['br_list'] = [];  item_product['coe_list'] = []; 
      item_product['bl_pdf_list'] = []; item_product['br_pdf_list'] = [];  item_product['coe_pdf_list'] = []; 
      item_product['invoice_pdfs'] = []; item_product['invoice_photos'] = [];
      item_product['origin_pdfs'] = []; item_product['origin_photos'] = [];

      for(var i = 0; i < this.result['bl_list'].length; i ++) {
        if(this.isPdfFile(this.result['bl_list'][i]['bl_attach_url']))
          item_product['bl_pdf_list'].push(this.result['bl_list'][i]['bl_attach_url']);
        else
          item_product['bl_list'].push(this.result['bl_list'][i]['bl_attach_url']);
      }
      for(var i = 0; i < this.result['br_list'].length; i ++) {
        if(this.isPdfFile(this.result['br_list'][i]['br_attach_url']))
          item_product['br_pdf_list'].push(this.result['br_list'][i]['br_attach_url']);
        else
          item_product['br_list'].push(this.result['br_list'][i]['br_attach_url']);
      }
      for(var i = 0; i < this.result['coe_list'].length; i ++) {
        if(this.isPdfFile(this.result['coe_list'][i]['coe_attach_url']))
          item_product['coe_pdf_list'].push(this.result['coe_list'][i]['coe_attach_url']);
        else
          item_product['coe_list'].push(this.result['coe_list'][i]['coe_attach_url']);
      }
      ////////
      for(var i = 0; i < item_product['attach_file_list'].length; i ++) {
        if(this.isPdfFile(item_product['attach_file_list'][i]['attach_url'])) {
            if(item_product['attach_file_list'][i]['attach_type'] == 'I')
              item_product['invoice_pdfs'].push(item_product['attach_file_list'][i]['attach_url']);
            else
              item_product['origin_pdfs'].push(item_product['attach_file_list'][i]['attach_url']);
        }
        else {
          if(item_product['attach_file_list'][i]['attach_type'] == 'I')
            item_product['invoice_photos'].push(item_product['attach_file_list'][i]['attach_url']);
          else
            item_product['origin_photos'].push(item_product['attach_file_list'][i]['attach_url']);
        }
      }
      item_product['tabSelect'] = 'ems';
      if(this.result.hasOwnProperty('reg_type'))  {
        if(this.result['reg_type'] == 'A') 
          item_product['tabSelect'] = 'ems';
        else if(this.result['reg_type'] == 'B')
          item_product['tabSelect'] = 'bl';
        else if(this.result['reg_type'] == 'C')
          item_product['tabSelect'] = 'hand';
      }
      this.navCtrl.push('Item_detailPage' , {item_product: item_product});
  }

  //세금 납부하기
  payTax() {
      this.launchExternalApp('instagram://', Common.app_link['ijiro']['packagename'], Common.app_link['ijiro']['ios_url'], Common.app_link['ijiro']['android_url']);
  }

  payment() {
    if(this.result['fee'] == '') {
      this.presentToast('수수료를 확인해 주세요.');
      return;
    } 
    this.presentCardSheet();
  }

  presentCardSheet() {
    let params = 'a24';
    let data = '{ ' + 
      '"api_key" : "607d835a-e2e4-4f9e-814a-69f9ef70dfa2", ' + 
      '"request_param" : { ' + 
        '"user_key" : "' + this.user_key + '" ' + //need to change it later    this.user_key
      ' } } ';
    this.server.post(encodeURI(params) , data).subscribe(data => {

      this.dismiss();
      if(data.result_cd != "S") {
        this.presentToast(data.result_msg);
        return;
      }
      this.card_list = data.data_list;
      let buttons = [];
      for(var i = 0; i < this.card_list.length; i ++) {
          let card_info = this.card_list[i];
          let button = {
            text: this.card_list[i]['card_num'],
            handler: () => {  
              this.paymentRegular(card_info['card_num'] , card_info[i]['billing_key']);
            }
          }
          buttons.push(button);
      }
      let button = {
        text: '다른 카드로 결제',
        handler: () => {
          this.paymentFee();
        }
      }
      buttons.push(button);
      buttons.push({ text: '닫기', role: 'cancel', handler: () => {} });
      this.cardPopup(buttons);
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    });
  }

  async cardPopup(buttons) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'card_submenu_asheet',
      buttons: buttons
    });
    await actionSheet.present();
}

// 정기 결제
paymentRegular(card_number , billing_key) {
    console.log(card_number , billing_key);
    let price =  (this.result['fee'] == '' ? '3000' : this.result['fee']);
    price = parseFloat(price);
    let fee = price;
    price = fee - this.active_coupon_amount - this.active_mileage;

    let mileage_use_gb = 'N' , coupon_use_gb ='N';
    if(this.active_mileage == 0)
      mileage_use_gb = 'N';
    else
      mileage_use_gb = 'Y';
    if(this.active_coupon_amount == 0)
      coupon_use_gb = 'N';
    else
      coupon_use_gb = 'Y';
    let coupon_number = '';
    if(coupon_use_gb != 'N')
        coupon_number = this.active_coupon_no;

    let params = 'a43';
    let data = '{ ' + 
      '"api_key" : "f0a5b7a0-e4e7-4c18-aa69-21f018f5c066", ' + 
      '"request_param" : { ' + 
        '"user_key":"' + this.user['user_key'] + '", ' + 
        '"price":"' + price + '", ' + 
        '"unique":"' + this.req_number + '", ' + 
        '"fee":"' + fee + '", ' + 
        '"mileage_use_gb":"' + mileage_use_gb + '", ' + 
        '"coupon_use_gb":"' + coupon_use_gb + '", ' + 
        '"u_mileage_amount":"' + this.active_mileage + '", ' + 
        '"u_coupon_amount":"' + this.active_coupon_amount + '", ' + 
        '"u_coupon_no":"' + coupon_number + '", ' + 
        '"base_bl":"' + this.result['bl'] + '", ' + 
        '"billing_key":"' + billing_key + '" ' + 
      ' } }';
      this.presentLoading();
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
            this.presentToast(data.result_msg);  
            return;
        }
        this.presentSuccessToast("결제 완료되었습니다.");
        //this.navCtrl.pop();
        this.navCtrl.push('EntryPage');
      }, err => {
        this.dismiss();
        this.presentToast('결제시도가 실패하였습니다. 다시 시도해 주세요');
      });
  }

  //카드결제
  paymentFee() {

    let price =  (this.result['fee'] == '' ? '3000' : this.result['fee']);
    price = parseFloat(price);
    let fee = price;
    price = fee - this.active_coupon_amount - this.active_mileage;
    let mileage_use_gb = 'N' , coupon_use_gb ='N';
    if(this.active_mileage == 0)
      mileage_use_gb = 'N';
    else
      mileage_use_gb = 'Y';

    if(this.active_coupon_amount == 0)
      coupon_use_gb = 'N';
    else
      coupon_use_gb = 'Y';

    let coupon_number = '';
    if(coupon_use_gb != 'N')
        coupon_number = this.active_coupon_no;
    //send log request before fee payment
    let params = 'a16';
    let data = '{ ' +
      '"api_key" : "ba2d0547-4682-46c8-806b-151ad3d44746", ' + 
      '"request_param" : { ' + 
        '"user_key":"' + this.user['user_key'] + '", ' + 
        '"price":"' + price + '", ' + 
        '"unique":"' + this.req_number + '", ' + 
        '"fee":"' + fee + '", ' + 
        '"mileage_use_gb":"' + mileage_use_gb + '", ' + 
        '"coupon_use_gb":"' + coupon_use_gb + '", ' + 
        '"u_mileage_amount":"' + this.active_mileage + '", ' + 
        '"u_coupon_amount":"' + this.active_coupon_amount + '", ' + 
        '"u_coupon_no":"' + coupon_number + '", ' + 
        '"base_bl":"' + this.result['bl'] + '" ' + 
      ' } } ';

      this.presentLoading();
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
            this.presentToast(data.result_msg);  
            return;
        }
        this.bootPayGeneral(data.params);
      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      });
    /*const options: InAppBrowserOptions = {
      zoom: 'no' , 
      location: 'no' ,
      hideurlbar: 'yes'
    }
    let url = 'http://45.76.180.140/bootpay';
    url += '?price=' + (this.result['fee'] == '' ? '3000' : this.result['fee']);
    url += '&order_id=' + this.result['reg_number'];
    url += '&username=' + this.result['name'];
    url += '&email=' + this.user['user_id'];
    url += '&phone=' + this.result['mobile'];
    url += '&unique=' + this.result['reg_number'];
    url += '&addr=' + this.result['addr1'] + ' ' + this.result['addr2'];
    const browser = this.inAppBrowser.create(url , '_blank' , options);
    let __this = this;
    browser.on('loadstop').subscribe(event => {
        let url = event.url;
        if (url.includes('return.php')) {
          browser.close();
          let queryparams = url.split('?')[1];
          let params = queryparams.split('&');
          let pair = null, data = [];
          params.forEach(function (d) {
            pair = d.split('=');  data[pair[0]] = pair[1];
          });
          switch(data['return_code']) {
              case '1':
                __this.presentToast("Payment succeeded.");
                __this.navCtrl.pop();
                break;
              case '2':
                __this.presentToast("Payment was cancelled by user.");
                break;
              case '3':
                __this.presentToast("Payment verification was failed.");
                break;
              case '4':
                __this.presentToast("Payment failed. Please contact the support team.");
                break;
              case '5':
                __this.presentToast("Payment failed. Payment information is incorrect.");
                break;
          }
        }
    }); */
  }

  bootPayGeneral(params) {
    let __this = this;
    let product_items = [];

    for(var i = 0; i < this.result['items'].length; i ++) {
      let product = {
        item_name: this.result['items'][i]['item_nm'],
        qty: this.result['items'][i]['qty'], 
        unique: Math.floor(Date.now() / 1000).toString() + '_' + this.result['items'][i]['item_no'], 
        price: this.result['items'][i]['unit_price']
      };
      product_items.push(product);
    }

    this.is_payment_access = true;

    BootPay.request({
        price: params['price'], 
        application_id: Common.application_id,
        name: '통관수수료', 
        pg: 'nicepay',
        method: 'card',
        show_agree_window: 0, 
        items: product_items,
        user_info: { 
          email: params['email'],
          phone: params['phone'],                        
          username: params['username']
        },
        order_id: params['order_id'],
        params: {price: params['price'], email: params['email'], phone: params['phone']}
    }).error(function (data) { 
        // 결제가 실패했을 때 호출되는 함수입니다.
        var msg = "결제 오류입니다.";
        __this.presentToast(msg);
    }).cancel(function (data) {
        // 결제창에서 결제 진행을 하다가 취소버튼을 눌렀을때 호출되는 함수입니다.
        var msg = "결제가 취소되었습니다.";
        __this.presentToast(msg);
    })/*.confirm(function (data) {
        // 결제가 진행되고 나서 승인 이전에 호출되는 함수입니다.
        // 일부 결제는 이 함수가 호출되지 않을 수 있습니다. ex) 가상계좌 및 카드 수기결제는 호출되지 않습니다.        
        // 만약 이 함수를 정의하지 않으면 바로 결제 승인이 일어납니다.
        if (confirm('결제를 정말 승인할까요?')) {
            console.log("do confirm data: " + JSON.stringify(data));
            // 이 함수를 반드시 실행해야 결제가 완전히 끝납니다.
            // 부트페이로 서버로 결제를 승인함을 보내는 함수입니다.
            this.transactionConfirm(data);
        } else {
            var msg = "결제가 승인거절되었습니다.: " + JSON.stringify(data);
            alert(msg);
            console.log(data);
        }
    })*/.close(function (data) {
    // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
          console.log(data);
     }).done(function (data) {
        //결제가 정상적으로 완료되면 수행됩니다
        //비즈니스 로직을 수행하기 전에 결제 유효성 검증을... 
        console.log(data); // need to check this file
        __this.sendPaymentVerification(data);
     }).ready(function (data) {
        console.log(data);
    });     
  }
  sendPaymentVerification(parameter) {
    let params = 'a41';
    //data should be made by parameter
    let data = '{ ' + 
      '"api_key" : "db1b58ca-1c9e-491c-aec0-83bc8f0728b0", ' + 
      '"request_param" : { ' + 
        '"order_id":"' + parameter['order_id'] + '", ' + 
        '"receipt_id":"' + parameter['receipt_id'] + '" ' + 
      ' } } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != "S") {
          this.presentToast(data.result_msg);  
          return;
      }
      this.presentSuccessToast("결제 완료되었습니다.");
      this.navCtrl.pop();
    }, err => {
      this.dismiss();
      this.presentToast('결제시도가 실패하였습니다. 다시 시도해 주세요');
     });
  }
  coupon_popup() {
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
      this.couponOpen(data.data_list);
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    });   
  }
  async couponOpen(data_list) {
      var buttons = [];
      for(var i = 0; i < data_list.length; i ++) {
        let data = data_list[i];
        let button = {
          text: data_list[i]['coupon_no'],
          handler: () => {  
            this.selectCoupon(data['coupon_no'] , data['discount_amount']);
          }
        }
        buttons.push(button);    
      }
      buttons.push({ text: '닫기', role: 'cancel', handler: () => {} });

      const actionSheet = await this.actionSheetController.create({
        cssClass: 'card_submenu_asheet',
        buttons: buttons
      });
      await actionSheet.present();
  }
  selectCoupon(coupon_no , coupon_amount) {
    this.active_coupon_no = coupon_no;
    if(coupon_amount == '')
      this.active_coupon_amount = 0;
    else
      this.active_coupon_amount = parseFloat(coupon_amount);
  }
  apply() {
    if(parseFloat(this.mileage_value) > parseFloat(this.user['user_mileage']))
      this.presentToast("마일리지를 확인해 주세요.");
    else
      this.active_mileage = parseFloat(this.mileage_value);
  }
  launchExternalApp(iosSchemaName: string, androidPackageName: string, iosUrl: string, androidUrl: string) {
    let appurl: string;
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    if (this.platform.is('ios')) {
      this.appAvailability.check(iosSchemaName)
        .then(
        (yes: boolean) => launcher.uriLaunch(iosSchemaName),
        (no: boolean) => this.inAppBrowser.create( iosUrl , '_system' , options)
        ); 
    } else if (this.platform.is('android')) {
        this.appAvailability.check(androidPackageName)
        .then(
        (yes: boolean) => launcher.packageLaunch(androidPackageName),
        (no: boolean) => this.inAppBrowser.create( androidUrl , '_system' , options)
        ); 
    } else {
      const browser = this.inAppBrowser.create(androidUrl , '_system' , options);
      return;
    }
  }
}
