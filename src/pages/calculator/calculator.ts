import { Component, Injector } from '@angular/core';
import { IonicPage , ActionSheetController, AlertController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { Common } from '../../common';
/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})
export class CalculatorPage extends BasePage {
  popup = false; category_list = [];
  selected_category = []; 
  depth = 0;
  country = '';  country_nm = '';
  object = ''; currency = 'USD'; unit = 'KG'; fta = '1';
  currency_rate = {}; 
  exchange_rate = ''; fee = ''; fee_value = '';
  unit_price = ''; weight = ''; calc_result = {}; is_calc = false;
  qty = ''; qty_unit = 'PC';
  constructor(injector: Injector, public actionSheetController: ActionSheetController, public alertCtrl: AlertController) {
    super(injector);
    this.load();
  } 
  close() {
    if(this.popup) {
      this.popup = !this.popup;
      this.selected_category = [];
      this.category_list = [];
      this.depth = 0;
    }
    else
      this.navCtrl.pop();
  }
  openCategory() {   
    this.popup = !this.popup;
    this.selected_category = [];
    this.selected_category = [{category_code: '1' , category_name: '물품분류를 선택하세요'}]; 

    this.loadCategory();
  }
  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: '알림 주의사항',
      message: message,
      cssClass: 'notice-msg111'
    });
    alert.present();    
  }
  selectCategory(category_code , category_name , a_msg) {
    if( !(a_msg == '' || a_msg == null) ) {
      this.presentAlert(a_msg);
    }
    this.category_list = [];
    this.selected_category[this.depth - 1].category_code = category_code;
    this.selected_category[this.depth - 1].category_name = category_name;
    if(this.depth < 4) {
      this.selected_category.push({category_code:'' , category_name:'선택중'});
      let c1_cc = this.selected_category.length > 0?this.selected_category[0].category_code:'1';
      let c2_cc = this.selected_category.length > 1?this.selected_category[1].category_code:'1';
      let c3_cc = this.selected_category.length > 2?this.selected_category[2].category_code:'1';
      this.loadCategory((this.depth + 1).toString() , c1_cc , c2_cc , c3_cc);
    }
    else {
      this.popup = false;
    }
  }
  loadCategory(gb = '1' , c1_cc = '1' , c2_cc = '1' , c3_cc = '1') {
    this.presentLoading();

    let params = 'a36';
    let data = '{ ' + 
      '"api_key" : "45f6000b-9bf7-4dd0-a724-4726cc7b20a8", ' + 
      '"request_param" : { ';
    if(gb == '1')
      data += '"gb":"1" ';
    else if(gb == '2') 
      data += '"gb":"2", ' + '"c1_cc":"' + c1_cc + '" ';
    else if(gb == '3') 
      data += '"gb":"3", ' + '"c1_cc":"' + c1_cc + '", ' + '"c2_cc":"' + c2_cc + '" ';
    else if(gb == '4') 
      data += '"gb":"4", "c1_cc":"' + c1_cc + '", "c2_cc":"' + c2_cc + '", "c3_cc":"' + c3_cc + '" ';
    data += '} } ';

    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != 'S') {
        this.presentToast(data.result_msg);
        return;
      }
      if(data.data_list.length < 1) {
        this.popup = false;
        this.selected_category.pop();
        return;
      }
      this.category_list = data.data_list;
      this.depth ++;
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })  
  }

  /* action sheet ctrl */
  async presentCountryActionSheet() {
    let buttons = [];
    Object.keys(Common.mark_country).forEach(key => {
        let country_key = key;
        let country_name = Common.mark_country[key];
        var value = {
          text: country_name,
          handler: () => {
            this.country = country_name;
            this.country_nm = country_name;
            if(this.weight != '') 
              this.calcShipFee();
          }
        }
        buttons.push(value);
    });
    var value = {
      text: '닫기',
      role: 'cancel',
      handler: () => {
      }
    }
    buttons.push(value);
    const actionSheet = await this.actionSheetController.create({
      buttons: buttons
    });
    await actionSheet.present();
  }
  async presentFTAActionSheet() {
    let buttons = [];
    Object.keys(Common.key_fta).forEach(key => {
      if(key != '1') {
        let fta_key = key;
        let fta_name = Common.key_fta[key];
        var value = {
          text: fta_name,
          handler: () => {
            this.fta = fta_key;
            this.object = fta_name;
          }
        }
        buttons.push(value);
      }
      else {
        let fta_key = key;
        let fta_name = Common.key_fta[key];
        var value = {
          text: fta_name,
          handler: () => {
            this.fta = fta_key;
            this.object = '';
          }
        }
        buttons.push(value);
      }
    });
    var value = {
      text: '닫기',
      role: 'cancel',
      handler: () => {
      }
    }
    buttons.push(value);
    const actionSheet = await this.actionSheetController.create({
      buttons: buttons
    });
    await actionSheet.present();
  }
  async presentCurrencyActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'USD',
        handler: () => {
          this.currency = 'USD';
          this.exchange_rate = this.currency_rate[this.currency];
        }
      }, {
        text: 'EUR',
        handler: () => {
          this.currency = 'EUR';
          this.exchange_rate = this.currency_rate[this.currency];
        }
      }, {
        text: 'CNY',
        handler: () => {
          this.currency = 'CNY';
          this.exchange_rate = this.currency_rate[this.currency];
        }
      }, {
        text: 'JPY',
        handler: () => {
          this.currency = 'JPY';
          this.exchange_rate = this.currency_rate[this.currency];
        }
      }, {
        text: '닫기',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
  async presentUnitActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'KG',
        handler: () => {
          this.unit = 'KG';
        }
      }, {
        text: 'LBS',
        handler: () => {
          this.unit = 'LBS';
        }
      }, {
        text: 'POUND',
        handler: () => {
          this.unit = 'POUND';
        }
      }, {
        text: 'OZ',
        handler: () => {
          this.unit = 'OZ';
        }
      }, {
        text: '닫기',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
  async presentActionSheetQtyUnit() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'PC',
        handler: () => {
          this.qty_unit = 'PC';
        }
      }, {
        text: 'EA',
        handler: () => {
          this.qty_unit = 'EA';
        }
      }, {
        text: 'SET',
        handler: () => {
          this.qty_unit = 'SET';
        }
      }, {
        text: 'MT',
        handler: () => {
          this.qty_unit = 'MT';
        }
      }, {
        text: '닫기',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
  /* ------ */
  selectCountry() {
    this.presentCountryActionSheet();
  }
  selectFTA() {
    this.presentFTAActionSheet();
  }
  selectCurrency() {
    this.presentCurrencyActionSheet();
  }
  selectUnit() {
    this.presentUnitActionSheet();
  }
  selectQtyUnit() {
    this.presentActionSheetQtyUnit();
  }
  /*------------*/
  calcShipFee () {
      if(this.weight == '') 
        return;
      if(this.country == '')
        return;
      let params = 'a39';
      let data = '{ ' +
        '"api_key" : "f6b24cd7-98e4-4605-8d43-dc07a9d5bc17", ' + 
        '"request_param" : { ' + 
          '"weight":"' + this.weight + '", ' + 
          '"exporter_cc":"' + Common.country_mark[this.country] + '" ' + 
        '} } ';
      this.server.post(encodeURI(params) , data).subscribe(data => {
        if(data.result_cd != 'S') {
          this.presentToast(data.result_msg);
          return;
        }
        if(data.hasOwnProperty('freight_charge')) {
          this.fee = '₩ ' + data.freight_charge;
        }
      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      });    
  }
  load() {
    let params = 'a38';
    let data = '{ ' + 
      '"api_key" : "46d97eba-0695-425d-8dfd-1d8820701198" ' + 
    ' } ';
    this.presentLoading();
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      if(data.result_cd != 'S') {
        this.presentToast(data.result_msg);
        return;
      }
      for(var i = 0; i < data.data_list.length; i ++) {
        if(data.data_list[i]['currSgn'] == 'USD')
          this.currency_rate['USD'] = data.data_list[i]['fxrt'];
        else if(data.data_list[i]['currSgn'] == 'EUR')
          this.currency_rate['EUR'] = data.data_list[i]['fxrt'];
        else if(data.data_list[i]['currSgn'] == 'CNY')
          this.currency_rate['CNY'] = data.data_list[i]['fxrt'];
        else if(data.data_list[i]['currSgn'] == 'JPY')
          this.currency_rate['JPY'] = data.data_list[i]['fxrt'];
      }
      this.exchange_rate = this.currency_rate[this.currency];
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    });  
  }

  calculate() {
    if(this.country == '') {
      this.presentToast('수출국가를 선택하세요.');
      return;
    }
    if(this.fta == '') {
      this.presentToast('FTA 대상여부를 선택하세요.');
      return;
    }
    if(this.selected_category.length < 1) {
      this.presentToast('물품분류를 선택하세요.');
      return;
    }
    if(this.qty == '') {
      this.presentToast('수량을 입력하세요.');
      return;
    }
    if(this.unit_price == '') {
      this.presentToast('단가를 입력하세요.');
      return;
    }
    if(this.weight == '') {
      this.presentToast('무게를 입력하세요.');
      return;
    }

    let c1 = '0' , c2 = '0' , c3 = '0' , c4 = '0';
    if(this.selected_category.length > 0)
      c1 = this.selected_category[0].category_code;
    if(this.selected_category.length > 1)
      c2 = this.selected_category[1].category_code;
    if(this.selected_category.length > 2)
      c3 = this.selected_category[2].category_code;
    if(this.selected_category.length > 3)
      c4 = this.selected_category[3].category_code;

    let params = 'a15';
    let data = '{ ' +
      '"api_key" : "f0c185b0-31cf-433b-b450-3dfb7fad16e4", ' +
      '"request_param" : { ' + 
        '"exporter_cc" : "' + Common.country_mark[this.country] + '", ' + 
        '"items" : [ ' + 
          '{ ' + 
            '"c1" : "' + c1 + '", ' + 
            '"c2" : "' + c2 + '", ' + 
            '"c3" : "' + c3 + '", ' +
            '"c4" : "' + c4 + '", ' + 
            '"qty" : "' + this.qty + '", ' +
            '"qty_unit" : "' + this.qty_unit + '", ' +
            '"unit_price" : "' + this.unit_price + '", ' +
            '"current_unit" : "' + this.currency + '", ' +
            '"weight" : "' + this.weight + '", ' + 
            '"weight_unit" : "' + this.unit + '", ' + 
            '"fta_gb" : "' + this.fta + '"	' + 
          ' } ] } } ';

      this.presentLoading();
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != 'S') {
          this.presentToast(data.result_msg);
          return;
        }
        console.log(data);
        this.calc_result = data;
        this.is_calc = true;
      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      });  
  }
  reset() {
    this.selected_category = []; this.depth = 0;
    this.country_nm = ''; this.country = ''; this.object = ''; this.fta = '1';
    this.currency = 'USD'; this.unit_price = '';
    this.unit = 'KG'; this.weight = '';
    this.exchange_rate = this.currency_rate[this.currency];
    this.fee = '';
  }
  weightChange() {
    this.calcShipFee();
  }
  gotoPriceRegister() {
    let calc_params = {
        exporter_cc: this.country , 
        fta_gb: this.fta , 
        weight_unit: this.unit , 
        weight: this.weight , 
        current_unit: this.currency , 
        unit_price: this.unit_price , 
        selected_category: this.selected_category
    };
    this.navCtrl.setRoot('ConfirmPage' , {calc_params: calc_params});
  }
}
