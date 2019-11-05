import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides , Platform } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { File } from '@ionic-native/file';
import { BasePage } from '../base/base';
import { Common } from '../../common';

@IonicPage()
@Component({
  selector: 'page-item_detail',
  templateUrl: 'item_detail.html'
})
export class Item_detailPage extends BasePage {

  @ViewChild(Slides) slides: Slides;
  curIndex: number = 0; slide_count = 2;
  item_product = {};
  images = ['https://www.hdfcbank.com/mobile/images/Bharat_card_new.jpg' , 'https://www.barclays.co.uk/content/dam/lifestyle-images/personal/credit-cards/ccard_forward_16_9.full.high_quality.png'];
  popup = false; instant = false;
  mark_country = []; key_fta = [];
  constructor(injector: Injector , public transfer: FileTransfer , public platform: Platform , public file: File 
    , private androidPermissions: AndroidPermissions) {
    super(injector);
    this.item_product = this.navParams.get("item_product");
    this.mark_country = Common.mark_country;
    this.key_fta = Common.key_fta;
    if(this.navParams.get("instant"))
      this.instant = this.navParams.get("instant");
    this.presentLoading();
    let __this = this;
    setTimeout(function() {
      __this.dismiss();
    } , 1500);

    this.load();
  }
  load() {
    if((this.item_product.hasOwnProperty('br_list') && this.item_product['br_list'].length>0) || (this.item_product.hasOwnProperty('coe_list') && this.item_product['coe_list'].length>0))   {
      this.item_product['businessYN'] = 'Y';
    }
    else
      this.item_product['businessYN'] = 'N';
    if( !this.instant ) {
      this.item_product['invoice_arr'] = [];
      this.item_product['origin_arr'] = [];
      for(var i = 0; i < this.item_product['attach_file_list'].length; i ++){
          if(this.item_product['attach_file_list'][i]['attach_type'] == 'I') 
            this.item_product['invoice_arr'].push(this.item_product['attach_file_list'][i]);
          if(this.item_product['attach_file_list'][i]['attach_type'] == 'O') 
            this.item_product['origin_arr'].push(this.item_product['attach_file_list'][i]);
      }
    }
  }
  close() {
    this.navCtrl.pop();
  }
  //image
  openImage(type) {

    if(type == 'bl') {
      this.images = this.item_product['bl_list'];
    }
    else if(type == 'br') {
      this.images = this.item_product['br_list'];
    }
    else if(type == 'coe') {
      this.images = this.item_product['coe_list'];
    }
    else if(type == 'invoice') {
      this.images = this.item_product['invoice_photos'];
    }
    else {
      this.images = this.item_product['origin_photos'];
    }

    this.presentLoading();
    let __this = this;
    setTimeout(function() {
      __this.dismiss();
    } , 1000);
    this.popup = true;
  }
  slideChanged() {
    this.curIndex = this.slides.getActiveIndex();
  }
  next() {
    this.slides.slideNext();
  }
  goback() {
    this.popup = false;
  }

  downloadFile(type) {
      let path = null , pdf_links = [];
      if( this.platform.is('ios'))     {
          path = this.file.documentsDirectory;
      }
      else {
        //path = this.file.dataDirectory;
        path = this.file.externalRootDirectory + '/Download/';
      }
      switch(type) {
        case 'bl':
            pdf_links = this.item_product['bl_pdf_list']
            break;
        case 'br':
            pdf_links = this.item_product['br_pdf_list']
            break;
        case 'coe':
            pdf_links = this.item_product['coe_pdf_list']
            break;
        case 'invoice':
            pdf_links = this.item_product['invoice_pdfs']
            break;
        case 'origin':
            pdf_links = this.item_product['origin_pdfs']
            break;
      }
      const transfer = this.transfer.create();
      let response_count = 0;
      let __this = this;
      if(pdf_links.length > 0)
        this.presentLoading();
      for(var i = 0; i < pdf_links.length; i ++) {

        transfer.download(encodeURI(pdf_links[i]) , path+'myfile_' + Math.floor(Date.now() / 1000).toString()+ '_' + (i+1) + '.' + this.getFileExtension(pdf_links[i])).then(entry => {
          response_count ++;
          let url = entry.toURL();
          //this.document.viewDocument(url , 'application/pdf' , {});
          if(response_count == pdf_links.length) 
          {
            __this.dismiss();
            __this.presentSuccessToast('다운로드 완료');
          }
        });
      }  
  }

  downloadPdf(type) {
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          this.downloadFile(type);
        } 
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(status => {
              if(status.hasPermission) {
                this.downloadFile(type);
              }
            });
        }
    });
  }
}
