import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , ActionSheetController , Slides, AlertController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { Common } from '../../common';
import { File } from '@ionic-native/file';
declare var jquery: any;
declare var $: any;
/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-price_register',
  templateUrl: 'price_register.html',
})
export class Price_registerPage extends BasePage {

  @ViewChild(Slides) slides: Slides;
  curIndex: number = 0; slide_count = 3; images = [];
  popup_c = false;

  calc_params = null;
  tabSelect = "ems";  selft_use_gb = 'N'; selectedImage = '';  item_nm = '';
  invoice_photos = []; invoice_photos_count = 0; 
  origin_photos = []; origin_photos_count = 0;   origin_cc = ''; origin_nm = '';
  invoice_pdfs = []; origin_pdfs = [];
  stage1 = {}; stage2 = {};
  popup = false; category_list = []; selected_category = []; depth = 0;
  qty_unit = 'PC'; current_unit = 'USD'; weight_unit = 'KG'; fta_text = ''; fta_gb = '1';
  qty = '';        unit_price = '';      weight = '';
  items_list = []; item_count = 0;
  user_key = '';
//////////////////////////////
  upload_file_count = 0; response_count = 0;
  bl_attach_url = []; br_attach_url = []; coe_attach_url = [];
  attach_file_list = [];

  old_weight : string = '';
  old_qty : string = '';
  old_unit_price : string = '';


  constructor(injector: Injector, public actionSheetController: ActionSheetController, private camera: Camera, public transfer: FileTransfer, public file: File 
    , private fileChooser: FileChooser, private fileOpener: FileOpener, private filePath: FilePath, public alertCtrl: AlertController) {
    super(injector);
    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = user['user_key'];
    this.stage1 = this.navParams.get("stage1");
    this.stage2 = this.navParams.get("stage2");
    if(this.navParams.get("calc_params")) {
      this.calc_params = this.navParams.get("calc_params");  
      this.current_unit = this.calc_params['current_unit'];
      this.weight_unit = this.calc_params['weight_unit'];
      this.unit_price = this.calc_params['unit_price'];
      this.weight = this.calc_params['weight'];
      this.fta_gb = this.calc_params['fta_gb'];
      this.selected_category = this.calc_params['selected_category'];
    }
    else {
      if(this.stage2['exporter_cc'] == 'US') {
        this.fta_gb = '2';
        this.fta_text = '한-미 FTA';
      }
      else if(this.stage2['exporter_cc'] == 'CN') {
        this.fta_gb = '4';
        this.fta_text = '한-중 FTA';
      }
      else if(this.stage2['exporter_cc'] == 'EU') {
        this.fta_gb = '3';
        this.fta_text = '한-EU FTA';
      }
    }
  } 

  ionViewDidEnter(){  
    let __this = this;
    $('#weight input').on('keyup' , function(e) {
        var input_text = $('#weight input').val();
        input_text = /^\d*\.?\d*$/.test(input_text);
        if(!input_text)
        {
          __this.weight = __this.old_weight;
          $('#weight input').val(__this.weight);
        }
        else
          __this.old_weight = __this.weight;
    });

    $('#qty input').on('keyup' , function(e) {
      var input_text = $('#qty input').val();
      input_text = /^\d*\.?\d*$/.test(input_text);
      if(!input_text)
      {
        __this.qty = __this.old_qty;
        $('#qty input').val(__this.qty);
      }
      else
        __this.old_qty = __this.qty;
    });

    $('#unit_price input').on('keyup' , function(e) {
      var input_text = $('#unit_price input').val();
      input_text = /^\d*\.?\d*$/.test(input_text);
      if(!input_text)
      {
        __this.unit_price = __this.old_unit_price;
        $('#unit_price input').val(__this.unit_price);
      }
      else
        __this.old_unit_price = __this.unit_price;
    });
  }

  getPicture(sourceType: PictureSourceType , type) {
    this.camera.getPicture({
      quality: 100 ,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then(imageData => {
       // this.selectedImage = `data:image/jpeg;base64,${imageData}`;
        if(type == 'invoice') {
          this.invoice_photos_count ++;
          this.invoice_photos.push(imageData);
        }
        else {
          this.origin_photos_count ++;
          this.origin_photos.push(imageData);
        }
    });
  }
  async selectSource(type) {
      let actionSheet = this.actionSheetController.create({
        buttons: [
          {
            text: '앨범', 
            icon: 'albums',
            handler: () => {
              this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY , type);
            }
          } ,
          {
            text: '촬영',
            icon: 'camera' , 
            handler: () => {
              this.getPicture(this.camera.PictureSourceType.CAMERA , type);
            }
          } ,
          {
            text: '파일',
            icon: 'link' , 
            handler: () => {
              this.getFile(type);  
            }
          } , {
            text: '닫기',
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
  }

  getFile(type) {
    let __this = this;
    this.fileChooser.open().then(file=> {
      this.filePath.resolveNativePath(file).then(resolvedFilePath=> {
        /* this.fileOpener.open(resolvedFilePath , 'application/pdf').then(value => {
          alert(resolvedFilePath);
        }).catch(err => {
          alert(JSON.stringify(err));
        }); */
        //  if(__this.isPdfFile(resolvedFilePath)) {
            if(type == 'invoice')
              __this.invoice_pdfs.push(resolvedFilePath);
            else
              __this.origin_pdfs.push(resolvedFilePath);
//          }
   /*     else {
              __this.file.resolveLocalFilesystemUrl(resolvedFilePath).then((entry:any)=>{
                  entry.file((file1)=>{
                  var reader = new FileReader();
                  reader.onload =  (encodedFile: any)=>{
                    var src = encodedFile.target.result;
                    if(type == 'invoice') {
                      __this.invoice_photos.push(src);
                      __this.invoice_photos_count ++;
                    }
                    else {
                      __this.origin_photos.push(src);
                      __this.origin_photos_count ++;
                    }
                  }
                  reader.readAsDataURL(file1);   
                })
              }).catch((error)=>{
                console.log(error);
              });
        } */
      }).catch(err=> {
          console.log(JSON.stringify(err));
      });
    }).catch(err => {
      console.log(JSON.stringify(err));
    });
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
  async presentActionSheetCurrentUnit() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'USD',
        handler: () => {
          this.current_unit = 'USD';
        }
      }, {
        text: 'EUR',
        handler: () => {
          this.current_unit = 'EUR';
        }
      }, {
        text: 'CNY',
        handler: () => {
          this.current_unit = 'CNY';
        }
      }, {
        text: 'JPY',
        handler: () => {
          this.current_unit = 'JPY';
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
  async presentActionSheetWeightUnit() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'KG',
        handler: () => {
          this.weight_unit = 'KG';
        }
      }, {
        text: 'LBS',
        handler: () => {
          this.weight_unit = 'LBS';
        }
      }, {
        text: 'POUND',
        handler: () => {
          this.weight_unit = 'POUND';
        }
      }, {
        text: 'OZ',
        handler: () => {
          this.weight_unit = 'OZ';
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

  async presentActionSheetFTA() {
    let buttons = [];
    Object.keys(Common.key_fta).forEach(key => {
      if(key != '1') {
        let fta_key = key;
        let fta_name = Common.key_fta[key];
        var value = {
          text: fta_name,
          handler: () => {
            this.fta_gb = fta_key;
            this.fta_text = fta_name;
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
            this.fta_gb = fta_key;
            this.fta_text = '';
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

  async presentActionSheetCountry() {
    let buttons = [];
    Object.keys(Common.mark_country).forEach(key => {
        let country_key = key;
        let country_name = Common.mark_country[key];
        var value = {
          text: country_name,
          handler: () => {
            this.origin_cc = country_key;
            this.origin_nm = country_name;
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

  prev() {
    this.navCtrl.pop();
  }
  update($event) {
    if(this.selft_use_gb == 'N')
      this.selft_use_gb = 'Y';
    else
      this.selft_use_gb = 'N';
  }
  //////////////////////////////////
  close() {
    this.popup = !this.popup;
    this.selected_category = [];
  }
  openCategory() {   
    this.popup = !this.popup;
    this.selected_category = [];
    this.selected_category = [{category_code: '1' , category_name: '물품분류를 선택하세요'}]; 
    this.loadCategory();
  }
  loadCategory(gb = '1' , c1_cc = '0' , c2_cc = '0' , c3_cc = '0') {
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

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: '알림 주의사항',
      message: message,
      cssClass: 'notice-msg222'
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
      let c1_cc = this.selected_category.length > 0?this.selected_category[0].category_code:'0';
      let c2_cc = this.selected_category.length > 1?this.selected_category[1].category_code:'0';
      let c3_cc = this.selected_category.length > 2?this.selected_category[2].category_code:'0';
      this.loadCategory((this.depth + 1).toString() , c1_cc , c2_cc , c3_cc);
    }
    else {
      this.popup = false;
    }
  }

  selectQtyUnit() {
    this.presentActionSheetQtyUnit();
  }
  selectCurrentUnit() {
    this.presentActionSheetCurrentUnit();
  }
  selectWeightUnit() {
    this.presentActionSheetWeightUnit();
  }
  selectFTA() {
    this.presentActionSheetFTA();
  }
  selectCountry() {
    this.presentActionSheetCountry();
  }

  register_items() {
    if(this.selected_category.length < 1) {
      this.presentToast('물품분류를 선택해주세요.');
      return;
    }
    if(this.item_nm == '') {
      this.presentToast('상표를 입력하세요.');
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
    if(this.origin_nm == '') {
      this.presentToast('원산지국가를 입력하세요.');
      return;
    }
    this.origin_cc = Common.country_mark[this.origin_nm];
    if(this.origin_cc == '' || !this.origin_cc) {
      this.presentToast('원산지 국가를 정확히 입력하세요.');
      return;
    }

    var item = {};
    this.item_count ++;
    item['item_no'] = this.item_count.toString();
    item['c1'] = '0'; item['c2'] = '0'; item['c3'] = '0'; item['c4'] = '0';
    if(this.selected_category.length > 0)
      item['c1'] = this.selected_category[0].category_code;
    if(this.selected_category.length > 1)
      item['c2'] = this.selected_category[1].category_code;
    if(this.selected_category.length > 2)
      item['c3'] = this.selected_category[2].category_code;
    if(this.selected_category.length > 3)
      item['c4'] = this.selected_category[3].category_code;

    item['item_nm'] = this.item_nm; item['qty_unit'] = this.qty_unit; item['qty'] = this.qty;
    item['unit_price'] = this.unit_price; item['current_unit'] = this.current_unit; 
    item['weight'] = this.weight; item['weight_unit'] = this.weight_unit;
    item['selft_use_gb'] = this.selft_use_gb;
    item['fta_gb'] = this.fta_gb; item['origin_cc'] = this.origin_cc;
    item['invoice_arr'] = this.invoice_photos;
    item['origin_arr'] = this.origin_photos;

    item['invoice_pdfs'] = this.invoice_pdfs;
    item['origin_pdfs'] = this.origin_pdfs;
    item['attach_file_list'] = [];
    this.items_list.push(item);

    this.item_nm = ''; this.qty_unit = 'PC'; this.qty = '';
    this.current_unit = 'USD'; this.unit_price = '';
    this.weight = ''; this.weight_unit = 'KG';
    this.selft_use_gb = 'N'; this.origin_nm = '';
    this.fta_gb = ''; this.origin_cc = ''; this.fta_text = '';
    this.invoice_photos = []; this.invoice_photos_count = 0;
    this.origin_photos = []; this.origin_photos_count = 0;
    this.invoice_pdfs = []; this.origin_pdfs = [];
    this.selected_category = [];  this.depth = 0;
    if(this.navParams.get("calc_params")) {
      this.calc_params = this.navParams.get("calc_params");  
      this.current_unit = this.calc_params['current_unit'];
      this.weight_unit = this.calc_params['weight_unit'];
      this.unit_price = this.calc_params['unit_price'];
      this.weight = this.calc_params['weight'];
      this.fta_gb = this.calc_params['fta_gb'];
    }
  }

  uploadPdfFile(filePath , type , index = 0) {
      const fileTransfer: FileTransferObject = this.transfer.create();      
      let options: FileUploadOptions = {
          fileKey: 'attach_file', fileName: this.getFileName(filePath),
          //mimeType: 'application/pdf', 
          chunkedMode: false,
          headers: {
              Connection: 'close'
          },
          //params: {}
         params: {
            "api_key" : "00ab2c87-fd25-45b6-b8ad-f82d1adf5be0"
         }
      };
      //alert(this.getFileName(filePath));
      let __this = this;
      //fileTransfer.upload(filePath, encodeURI('http://45.76.180.140/upload/json1.php'), options)
      fileTransfer.upload(filePath, encodeURI('http://api.tlogin.net/basium/f01'), options)
        .then((data) => {
          //alert(data.response);
          __this.response_count ++;
          let resp = JSON.parse(data.response);
          if(resp['result_cd'] == 'S') {
            if(type == 'stage1')
              __this.bl_attach_url.push({"bl_attach_url" : resp['data_list'][0]['file_url']});  
            if(type == 'business')
              __this.br_attach_url.push({"br_attach_url" : resp['data_list'][0]['file_url']});  
            if(type == 'verify')
              __this.coe_attach_url.push({"coe_attach_url" : resp['data_list'][0]['file_url']});  
            if(type == 'invoice')
              __this.items_list[index]['attach_file_list'].push({'attach_type':'I' , 'attach_url':resp['data_list'][0]['file_url']}); 
            if(type == 'origin')
              __this.items_list[index]['attach_file_list'].push({'attach_type':'O' , 'attach_url':resp['data_list'][0]['file_url']});
          }
          if(__this.response_count == __this.upload_file_count) {
            __this.dismiss();
            __this.save();
          }
        }, (err) => {
          __this.response_count ++;
          if(__this.response_count == __this.upload_file_count) {
            __this.dismiss();
            __this.save();
          }
      });   
  }

  uploadFile(type , ext , imageData_array , index = 0) {  
    this.server.uploadImage(imageData_array).subscribe(data => {
      this.response_count ++;
      if(data.result_cd == "S") {
        if(type == 'stage1')
          for(var k = 0; k < data.data_list.length; k ++)
            this.bl_attach_url.push({"bl_attach_url" : data.data_list[k]['file_url']});  
        if(type == 'business')
          for(var k = 0; k < data.data_list.length; k ++)
            this.br_attach_url.push({"br_attach_url" : data.data_list[k]['file_url']});  
        if(type == 'verify')
          for(var k = 0; k < data.data_list.length; k ++)
            this.coe_attach_url.push({"coe_attach_url" : data.data_list[k]['file_url']});  
        if(type == 'invoice')
          for(var k = 0; k < data.data_list.length; k ++)
            this.items_list[index]['attach_file_list'].push({'attach_type':'I' , 'attach_url':data.data_list[k]['file_url']});
        if(type == 'origin')
          for(var k = 0; k < data.data_list.length; k ++)
            this.items_list[index]['attach_file_list'].push({'attach_type':'O' , 'attach_url':data.data_list[k]['file_url']});
      }
      if(this.response_count == this.upload_file_count) {
        this.dismiss();
        this.save();
      }
    }, err => {
      this.response_count ++;
      if(this.response_count == this.upload_file_count) {
        this.dismiss();
        this.save();
      }
    })  

  }
  save() {
    //alert(JSON.stringify(this.bl_attach_url) + '---' + JSON.stringify(this.br_attach_url) + '----' + JSON.stringify(this.coe_attach_url));
    let params = 'a14';
    let reg_type = 'A';
    if(this.stage2['tabSelect'] == 'ems')
      reg_type = 'A';
    else if(this.stage2['tabSelect'] == 'bl')
      reg_type = 'B';
    else 
      reg_type = 'C';
    let data = '{ ' + 
      '"api_key" : "b3145696-83fc-4943-a2c4-41a4d475d28e", ' + 
      '"request_param" : { ' + 
        '"user_key" : "' + this.user_key + '", ' + 
        '"reg_number" : "", ' +
        '"pcc" : "' + this.stage1['pcc'] + '", ' + 
        '"name" : "' + this.stage1['username'] + '", ' + 
        '"mobile" : "' + this.stage1['mobile'] + '", ' + 
        '"addr1" : "' + this.stage1['addr'] + '", ' + 
        '"addr2" : "' + this.stage1['detail_addr'] + '", ' + 
        '"post" : "' + this.stage1['zipcode'] + '", ';
        if(this.stage2['tabSelect'] == 'ems' || this.stage2['tabSelect'] == 'bl')
          data += '"bl" : "' + this.stage2['bl'] + '", ';
        
        data += '"exporter_nm" : "' + this.stage2['exporter_nm'] + '", ' + 
        '"exporter_cc" : "' + this.stage2['exporter_cc'] + '", ';
        /* tabSelect
        this.stage2.photos['ems'] , this.stage2.photos['bl'] , this.stage2.photos['hand'] 
        data += '"bl_list":[{ ' + 
          '"bl_attach_url" : "https://s3.ap-northeast-2.amazonaws.com/logins-services/1005/20190515/abc2114353df.jpg" ' + 
        '}] , ';
        */
        data += ' "reg_type": "' + reg_type + '", '
        data += '"bl_list":' + JSON.stringify(this.bl_attach_url) + ' , ';
        /* tabSelect
        this.stage2.photos['business'] , this.stage2.photos['verify']
        */
        if(this.stage2['businessYn'] == true) {
          data += '"br_list":' + JSON.stringify(this.br_attach_url) + ', ';
          data += '"coe_list":' + JSON.stringify(this.coe_attach_url) + ', ';
        }
        else {
          data += '"br_list":[], ';
          data += '"coe_list":[], ';
        }
        
        data += '"items" : [ ';
        for(var i = 0; i < this.items_list.length; i ++) {
          /*
          invoice_photos = []; origin_photos = []; 
          */
          data += '{ ' +
            '"item_no":"' + this.items_list[i].item_no + '", ' +
            '"c1":"' + this.items_list[i]['c1'] + '", "c2":"' + this.items_list[i]['c2'] + '", "c3":"' + this.items_list[i]['c3'] + '", "c4":"' + this.items_list[i]['c4'] + '", ' + 
            '"item_nm":"' + this.items_list[i]['item_nm'] + '", ' + 
            '"qty_unit":"' + this.items_list[i]['qty_unit'] + '", ' + 
            '"qty":"' + this.items_list[i]['qty'] + '", ' + 
            '"unit_price":"' + this.items_list[i]['unit_price'] + '", ' + 
            '"current_unit":"' + this.items_list[i]['current_unit'] + '", ' +
            '"weight":"' + this.items_list[i]['weight'] + '", ' + 
            '"weight_unit":"' + this.items_list[i]['weight_unit'] + '", ' + 
            '"selft_use_gb":"' + this.items_list[i]['selft_use_gb'] + '", ' + 
            '"fta_gb":"' + this.items_list[i]['fta_gb'] + '", ' +
            '"origin_cc":"' + this.items_list[i]['origin_cc'] + '", ' +
            '"attach_file_list":' + JSON.stringify(this.items_list[i]['attach_file_list']) + ' } ';

            if(i < this.items_list.length - 1)
              data += ' , ';
        }
        data += ' ] } } '; 
        
        this.presentLoading();
        this.server.post(encodeURI(params) , data).subscribe(data => {
          this.dismiss();
          if(data.result_cd != "S") {
              this.presentToast(data.result_msg);  
              return;
          }
          else {
              this.presentSuccessToast("간편접수 등록 성공");  
              this.navCtrl.setRoot('HomePage');
          }
        }, err => {
          this.dismiss();
          this.presentToast('간편접수등록 실패.');
        }); 
  }
  next_page() {
    if(this.items_list.length == 0) {
      this.presentToast('등록된 상품이 없습니다.');      
      return;
    }
    if(this.stage2['photos'][this.stage2['tabSelect']]['photo_array'].length > 0)
      this.upload_file_count ++;
    if(this.stage2['photos']['business']['photo_array'].length > 0)
      this.upload_file_count ++;
    if(this.stage2['photos']['verify']['photo_array'].length > 0)
      this.upload_file_count ++;
    if(this.stage2['photos'][this.stage2['tabSelect']]['pdf_array'].length > 0)
      this.upload_file_count += this.stage2['photos'][this.stage2['tabSelect']]['pdf_array'].length;
    if(this.stage2['photos']['business']['pdf_array'].length > 0)
      this.upload_file_count += this.stage2['photos']['business']['pdf_array'].length;
    if(this.stage2['photos']['verify']['pdf_array'].length > 0)
      this.upload_file_count += this.stage2['photos']['verify']['pdf_array'].length;
    //this.upload_file_count += this.invoice_photos.length;
    //this.upload_file_count += this.origin_photos.length;
    for(var i = 0; i < this.items_list.length; i ++) {
      if(this.items_list[i]['invoice_arr'].length > 0)
        this.upload_file_count ++;
      if(this.items_list[i]['origin_arr'].length > 0)
        this.upload_file_count ++;
      for(var j = 0; j < this.items_list[i]['invoice_pdfs'].length; j ++)
        this.upload_file_count ++;
      for(var j = 0; j < this.items_list[i]['origin_pdfs'].length; j ++)
        this.upload_file_count ++;
    }

    if( this.upload_file_count > 0 ) {
        this.presentLoading();
        if(this.stage2['photos'][this.stage2['tabSelect']]['photo_array'].length > 0)
          this.uploadFile('stage1' , 'image' , this.stage2['photos'][this.stage2['tabSelect']]['photo_array']);
        if(this.stage2['photos']['business']['photo_array'].length > 0)
          this.uploadFile('business' , 'image' , this.stage2['photos']['business']['photo_array']);
        if(this.stage2['photos']['verify']['photo_array'].length > 0)
          this.uploadFile('verify' , 'image' , this.stage2['photos']['verify']['photo_array']);
    
        for(var i = 0; i < this.stage2['photos'][this.stage2['tabSelect']]['pdf_array'].length; i ++ ) 
          this.uploadPdfFile(this.stage2['photos'][this.stage2['tabSelect']]['pdf_array'][i] , 'stage1');
        for(var i = 0; i < this.stage2['photos']['business']['pdf_array'].length; i ++ )
          this.uploadPdfFile(this.stage2['photos']['business']['pdf_array'][i] , 'business');
        for(var i = 0; i < this.stage2['photos']['verify']['pdf_array'].length; i ++ )
          this.uploadPdfFile(this.stage2['photos']['verify']['pdf_array'][i] , 'verify');
    
        for(var i = 0; i < this.items_list.length; i ++) {
            if(this.items_list[i]['invoice_arr'].length > 0)
              this.uploadFile('invoice' , 'image' , this.items_list[i]['invoice_arr'] , i);
            if(this.items_list[i]['origin_arr'].length > 0)
              this.uploadFile('origin' , 'image' , this.items_list[i]['origin_arr'] , i);
            for(var j = 0; j < this.items_list[i]['invoice_pdfs'].length; j ++)
              this.uploadPdfFile(this.items_list[i]['invoice_pdfs'][j] , 'invoice' , i)
            for(var j = 0; j < this.items_list[i]['origin_pdfs'].length; j ++)
              this.uploadPdfFile(this.items_list[i]['origin_pdfs'][j] , 'origin' , i)
        }  
    }
    else {
      this.save();
    }
    /*for(i = 0; i < this.invoice_photos.length; i ++) {
      this.uploadFile('invoice' , 'image' , this.invoice_photos[i]);
    }
    for(i = 0; i < this.origin_photos.length; i ++) {
      this.uploadFile('origin' , 'image' , this.origin_photos[i]);
    }*/
  }
    goItemDetail(item_no) {
        let item_product = {};
        for(var i = 0; i < this.items_list.length; i ++) {
            if(this.items_list[i]['item_no'] == item_no) {
              item_product = this.items_list[i];
              break;
            }
        }

        item_product['bl_list'] = []; item_product['br_list'] = [];  item_product['coe_list'] = []; 
        item_product['bl_pdf_list'] = []; item_product['br_pdf_list'] = [];  item_product['coe_pdf_list'] = []; 
        item_product['invoice_photos'] = []; item_product['origin_photos'] = [];

        item_product['bl'] = this.stage2['bl'];
        item_product['exporter_nm'] = this.stage2['exporter_nm'];
        item_product['exporter_cc'] = this.stage2['exporter_cc'];
        
        for(var i = 0; i < this.stage2['photos'][this.stage2['tabSelect']]['photo_array'].length; i ++) {
          item_product['bl_list'].push(`data:image/jpeg;base64,${this.stage2['photos'][this.stage2['tabSelect']]['photo_array'][i]}`);
        }
        for(var i = 0; i < this.stage2['photos']['business']['photo_array'].length; i ++) {
          item_product['br_list'].push(`data:image/jpeg;base64,${this.stage2['photos']['business']['photo_array'][i]}`);
        }
        for(var i = 0; i < this.stage2['photos']['verify']['photo_array'].length; i ++) {
          item_product['coe_list'].push(`data:image/jpeg;base64,${this.stage2['photos']['verify']['photo_array'][i]}`);
        }

        for(var i = 0; i < this.stage2['photos'][this.stage2['tabSelect']]['pdf_array'].length; i ++) {
          item_product['bl_pdf_list'].push(this.stage2['photos'][this.stage2['tabSelect']]['pdf_array'][i]);
        }
        for(var i = 0; i < this.stage2['photos']['business']['pdf_array'].length; i ++) {
          item_product['br_pdf_list'].push(this.stage2['photos']['business']['pdf_array'][i]);
        }
        for(var i = 0; i < this.stage2['photos']['verify']['pdf_array'].length; i ++) {
          item_product['coe_pdf_list'].push(this.stage2['photos']['verify']['pdf_array'][i]);
        }

        for(var  i = 0; i < item_product['invoice_arr'].length; i ++) {
          item_product['invoice_photos'].push(`data:image/jpeg;base64,${item_product['invoice_arr'][i]}`);
        }
        for(var  i = 0; i < item_product['origin_arr'].length; i ++) {
          item_product['origin_photos'].push(`data:image/jpeg;base64,${item_product['origin_arr'][i]}`);
        }
        item_product['tabSelect'] = this.stage2['tabSelect'];
        this.navCtrl.push('Item_detailPage' , {item_product: item_product , instant: true});
    }

    slideChanged() {
      this.curIndex = this.slides.getActiveIndex();
    }
    next() {
      this.slides.slideNext();
    }
    goback() {
      this.popup_c = false;
    }
    openPopup(type) {
      if(type == 'invoice') {
        this.images = [];
        for(var i = 0; i < this.invoice_photos.length; i ++)
          this.images.push(`data:image/jpeg;base64,${this.invoice_photos[i]}`);
      }
      else if(type == 'origin') {
        this.images = [];
        for(var i = 0; i < this.origin_photos.length; i ++)
          this.images.push(`data:image/jpeg;base64,${this.origin_photos[i]}`);
      }
      this.slide_count = this.images.length;
      this.presentLoading();
      let __this = this;
      setTimeout(function() {
        __this.dismiss();
      } , 1000);
      this.popup_c = true;
    }
}
