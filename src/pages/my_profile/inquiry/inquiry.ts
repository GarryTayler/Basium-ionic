import { Component, Injector } from '@angular/core';
import { IonicPage  , Platform } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { BasePage } from '../../base/base';
@IonicPage()
@Component({
  selector: 'page-inquiry',
  templateUrl: 'inquiry.html'
})
export class InquiryPage extends BasePage {
  result_list = [];
  selected = -1;
  user_key = '';
  constructor(injector: Injector , public transfer: FileTransfer , public platform: Platform , public file: File 
    , private androidPermissions: AndroidPermissions) {
    super(injector);

    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }
    this.user_key = user['user_key'];

    this.load();
  }
  load() {
    this.presentLoading();
    let params = 'a26';
    let data = '{' +
      '"api_key" : "c75604d3-f750-4506-a272-6936d3124c07", ' +
      '"request_param" : { ' +
        '"user_key" : "' + this.user_key + '" ' + 
      '} }';
    this.server.post(encodeURI(params) , data).subscribe(data => {
      this.dismiss();
      this.result_list = data.data_list;
    }, err => {
      this.dismiss();
      this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
    })
  }
  detailClick (index) {
    if(index == this.selected)
      this.selected = -1;
    else
      this.selected = index;
  }
  back() {
    this.navCtrl.pop();
  }
  create_inquiry() {
    let __this = this;
    let myCallbackFunction = (_params) => {
      return new Promise((resolve , reject) => {
          if(_params['success']) { 
              __this.load();
          }
          resolve();
      });
    }
    this.navCtrl.push('Inquiry_createPage' , {callback: myCallbackFunction});
  }
  downloadFile(link) {
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          this.downloadFile__(link);
        } 
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(status => {
              if(status.hasPermission) {
                this.downloadFile__(link);
              }
            });
        }
    });
  }
  downloadFile__(link) {
      let path = null , pdf_links = [];
      if( this.platform.is('ios'))     {
          path = this.file.documentsDirectory;
      }
      else {
        //path = this.file.dataDirectory;
        path = this.file.externalRootDirectory + '/Download/';
      }
      const transfer = this.transfer.create();
      let __this = this;
      this.presentLoading();
      transfer.download(encodeURI(link) , path+'myfile_' + Math.floor(Date.now() / 1000).toString()+ '_' + 1 + '.' + this.getFileExtension(link)).then(entry => {
        let url = entry.toURL();
        __this.dismiss();
        __this.presentSuccessToast('다운로드 완료');
      });
  }
}
