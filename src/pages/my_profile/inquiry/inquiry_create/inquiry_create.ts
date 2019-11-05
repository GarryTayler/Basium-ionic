import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides } from 'ionic-angular';
import { BasePage } from '../../../base/base';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { Common } from '../../../../common';
import { File } from '@ionic-native/file';
/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inquiry_create',
  templateUrl: 'inquiry_create.html',
})
export class Inquiry_createPage extends BasePage {

  @ViewChild(Slides) slides: Slides;
  curIndex: number = 0; slide_count = 3; images = [];
  popup_c = false;

  __file: string = "";
  title = ""; content = "";  user_key = '';

  photo_array = []; 
  pdf_array = [];

  upload_file_count = 0; response_count = 0;
  attach_files = []; callback = null;

  constructor(injector: Injector, public camera: Camera, public transfer: FileTransfer, public file: File 
    , private fileChooser: FileChooser, private fileOpener: FileOpener, private filePath: FilePath) {
      super(injector);      
      let user = this.preferences.get('user');
      if (!user) {
        this.navCtrl.setRoot('SigninPage');
        return;
      }
      this.user_key = user['user_key'];
      this.callback = this.navParams.get("callback");
  } 

  getPicture(sourceType: PictureSourceType) {
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
       this.photo_array.push(imageData);
    });
  }

  back() {
    this.navCtrl.pop();
  }

  save() {

    if(this.title == '') {
      this.presentToast("제목을 입력하세요.");
      return;
    }
    if(this.content == '') {
      this.presentToast("내용을 입력하세요.");
      return;
    }

    if(this.photo_array.length > 0)
      this.upload_file_count ++;
    for(var i = 0; i < this.pdf_array.length; i ++)
      this.upload_file_count ++;

    if( this.upload_file_count > 0 ) {
      this.presentLoading();
      if(this.photo_array.length > 0)
        this.uploadFile(this.photo_array);    
      for(var i = 0; i < this.pdf_array.length; i ++)
        this.uploadPdfFile(this.pdf_array[i]);
    }
    else {
      this.store_data();
    }
    
  }

  uploadPdfFile(filePath) {
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
          __this.attach_files.push({"dq_attach_url" : resp['data_list'][0]['file_url']});  
        }
        if(__this.response_count == __this.upload_file_count) {
          __this.dismiss();
          __this.store_data();
        }
      }, (err) => {
        __this.response_count ++;
        if(__this.response_count == __this.upload_file_count) {
          __this.dismiss();
          __this.store_data();
        }
    });   
}

  uploadFile(imageData_array) {  
    this.server.uploadImage(imageData_array).subscribe(data => {
      this.response_count ++;
      if(data.result_cd == "S") {
          for(var k = 0; k < data.data_list.length; k ++)
            this.attach_files.push({"dq_attach_url" : data.data_list[k]['file_url']});  
      }
      if(this.response_count == this.upload_file_count) {
        this.dismiss();
        this.store_data();
      }
    }, err => {
      this.response_count ++;
      if(this.response_count == this.upload_file_count) {
        this.dismiss();
        this.store_data();
      }
    })  
  }

  store_data() {
      let params = 'a27';
      let data = '{ ' +
        '"api_key": "e964494e-2146-498a-b086-19c02af161ed", ' + 
        '"request_param": { ' + 
          '"user_key": "' + this.user_key + '", ' + 
          '"dq_key": "", ' + 
          '"title": "' + this.title + '", ' + 
          '"contents": "' + this.content + '", ' + 
          '"attach_files": ' +  JSON.stringify(this.attach_files) +
        '} ' +
      '}  ';
      this.presentLoading();
      this.server.post(encodeURI(params) , data).subscribe(data => {
        this.dismiss();
        if(data.result_cd != "S") {
            this.presentToast(data.result_msg);  
            return;
        }
        this.presentSuccessToast("1:1문의 등록 완료");
        this.callback({success:true}).then(()=>{
          this.navCtrl.pop();
        });

      }, err => {
        this.dismiss();
        this.presentToast('오류가 발생하였습니다.다시 시도해 주세요.');
      }); 
  }

  async presentActionSheet() {
    const actionSheet = this.actionCtrl.create({
        cssClass: 'inquiry_file_asheet',
        buttons: [
          {
            text: "촬영",
            icon: 'camera',
            handler: () => {
              this.getPicture(this.camera.PictureSourceType.CAMERA);
            }
          },
          {
            text: "앨범",
            icon: 'albums',
            handler: () => {
              this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text: "파일",
            icon: 'link',
            handler: () => {
              this.getFile();  
            }
          }
        ]       
    });
    await actionSheet.present();
  }

  getFile() {
    let __this = this;
    this.fileChooser.open().then(file=> {
      this.filePath.resolveNativePath(file).then(resolvedFilePath=> {
        /*if(!__this.getExtensionCheck(resolvedFilePath)) {
          __this.presentToast("지원되지 않는 파일입니다.");
        }
        else { */ 
        __this.pdf_array.push(resolvedFilePath);
        //}
      }).catch(err=> {
          console.log(JSON.stringify(err));
      });
    }).catch(err => {
      console.log(JSON.stringify(err));
    });
  }

  addFile() {
    this.presentActionSheet();
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
    this.images = [];
    for(var i = 0; i < this.photo_array.length; i ++)
      this.images.push(`data:image/jpeg;base64,${this.photo_array[i]}`);
    this.slide_count = this.images.length;
    this.presentLoading();
    let __this = this;
    setTimeout(function() {
      __this.dismiss();
    } , 1000);
    this.popup_c = true;
  }
}
