import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage , Slides , ActionSheetController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { Common } from '../../common';
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
  selector: 'page-transport_register',
  templateUrl: 'transport_register.html',
})
export class Transport_registerPage extends BasePage {

  @ViewChild(Slides) slides: Slides;
  curIndex: number = 0; slide_count = 3; images = [];
  popup = false;

  calc_params = null;
  tabSelect = "ems"; businessYn = false;
  selectedImage: string;
  photos = {}; bl = ''; exporter_cc = ''; exporter_nm = ''; exporter_cc_nm = '';
  stage1 = {};
  constructor(injector: Injector , private actionSheetCtrl: ActionSheetController ,
    private camera: Camera, public transfer: FileTransfer, public file: File ,
    private fileChooser: FileChooser, private fileOpener: FileOpener, private filePath: FilePath) {
    super(injector);
    if(this.navParams.get("calc_params")) {
      this.calc_params = this.navParams.get("calc_params");
      this.exporter_cc_nm = this.calc_params['exporter_cc'];
      this.exporter_cc = Common.country_mark[this.exporter_cc_nm];
    }
    this.stage1['pcc'] = this.navParams.get("pcc");
    this.stage1['username'] = this.navParams.get("username");
    this.stage1['mobile'] = this.navParams.get("mobile");
    this.stage1['addr'] = this.navParams.get("addr");
    this.stage1['zipcode'] = this.navParams.get("zipcode");
    this.stage1['detail_addr'] = this.navParams.get("detail_addr");

    this.photos['ems'] = {};
    this.photos['ems']['photo_array'] = []; this.photos['ems']['count'] = 0;
    this.photos['ems']['pdf_array'] = []; this.photos['ems']['pdf_count'] = 0;

    this.photos['bl'] = {};
    this.photos['bl']['photo_array'] = []; this.photos['bl']['count'] = 0;
    this.photos['bl']['pdf_array'] = []; this.photos['bl']['pdf_count'] = 0;

    this.photos['hand'] = {};
    this.photos['hand']['photo_array'] = []; this.photos['hand']['count'] = 0;
    this.photos['hand']['pdf_array'] = []; this.photos['hand']['pdf_count'] = 0;

    this.photos['business'] = {};
    this.photos['business']['photo_array'] = []; this.photos['business']['count'] = 0;
    this.photos['business']['pdf_array'] = []; this.photos['business']['pdf_count'] = 0;

    this.photos['verify'] = {};
    this.photos['verify']['photo_array'] = []; this.photos['verify']['count'] = 0;
    this.photos['verify']['pdf_array'] = []; this.photos['verify']['pdf_count'] = 0;

    //this.photos['ems']['pdf_count'] = 1;
  }

  prev() {
    this.navCtrl.pop();
  }
  next_page() {
    if(this.tabSelect == 'ems' || this.tabSelect == 'bl')
      if(this.bl == '') {
        this.presentToast('운송장번호를 입력하세요.');
        return;
      }
    this.exporter_cc = Common.country_mark[this.exporter_cc_nm];

    if(this.exporter_cc_nm == '') {
      this.presentToast('수출국가를 입력하세요.');
      return;
    }
    if(this.exporter_cc == '' || !this.exporter_cc) {
      this.presentToast('수출국가정보와 일치하지 않습니다.');
      return;
    }
    if(this.exporter_nm == '') {
      this.presentToast('수출자를 입력하세요.');
      return;
    }
    let stage2_param = {
      tabSelect: this.tabSelect ,
      bl: this.bl ,
      exporter_cc: this.exporter_cc ,
      exporter_nm: this.exporter_nm ,
      businessYn: this.businessYn ,
      photos: this.photos
    };

    if(this.tabSelect != 'hand') {
        stage2_param.photos['business']['photo_array'] = [];
        stage2_param.photos['business']['pdf_array'] = [];
        stage2_param.photos['verify']['photo_array'] = [];
        stage2_param.photos['verify']['pdf_array'] = [];
    }

    //alert(JSON.stringify(stage2_param));
    
    if(!this.calc_params)
      this.navCtrl.push('Price_registerPage' , {stage1: this.stage1 , stage2: stage2_param});
    else
      this.navCtrl.push('Price_registerPage' , {stage1: this.stage1 , stage2: stage2_param , calc_params: this.calc_params}); 
  }
  tab_choose(tabName) {
    this.tabSelect = tabName;
    if(tabName == 'ems') {
      $('.tab_ems').addClass('active');
      $('.tab_bl').removeClass('active');
      $('.tab_hand').removeClass('active');
      $('.ems_content').show();
      $('.bl_content').hide();  
      $('.hand_content').hide();  
    }
    else if(tabName == 'bl') {
      $('.tab_ems').removeClass('active');
      $('.tab_bl').addClass('active');
      $('.tab_hand').removeClass('active');
      $('.ems_content').hide();
      $('.bl_content').show();  
      $('.hand_content').hide();
    }
    else if(tabName == 'hand') {
      $('.tab_ems').removeClass('active');
      $('.tab_bl').removeClass('active');
      $('.tab_hand').addClass('active');
      $('.ems_content').hide();
      $('.bl_content').hide();  
      $('.hand_content').show();
    }
  }

  ionViewDidEnter(){ 
    let __this = this;
    $('#business_checkbox').on('change' , function(e) {
        if(!__this.businessYn) {
            $('#no_label').hide();
            $('#yes_label').show();
        }
        else {
            $('#no_label').show();
            $('#yes_label').hide();
        }
        __this.businessYn = !__this.businessYn;
    });
  }
  update($event) {
    this.businessYn = !this.businessYn;
  }

  async selectCountry() {

    let buttons = [];
    Object.keys(Common.mark_country).forEach(key => {
        let country_key = key;
        let country_name = Common.mark_country[key];
        var value = {
          text: country_name,
          handler: () => {
            this.exporter_cc = country_key;
            this.exporter_cc_nm = country_name;
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

    const actionSheet = await this.actionSheetCtrl.create({
      buttons: buttons
    });
    await actionSheet.present();
  }

  async selectSource(type) {

      let actionSheet = this.actionSheetCtrl.create({
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
          } ,
          {
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
        /*if(!__this.getExtensionCheck(resolvedFilePath)) {
          __this.presentToast("지원되지 않는 파일입니다.");
        }
        else {*/
         // if(__this.isPdfFile(resolvedFilePath)) {
            __this.photos[type]['pdf_array'].push(resolvedFilePath);
            __this.photos[type]['pdf_count'] ++;
            
            if(type == 'ems' || type == 'bl' || type == 'hand') {
              var root_class = '.attach_' + type;
              $(root_class).removeClass('no_file');
              $(root_class + ' .text_label').removeClass('no_file');
              if(__this.photos[type]['photo_array'].length == 0)
                $(root_class + ' .attach_pdf').addClass('no_file');
              else
                $(root_class + ' .attach_pdf').removeClass('no_file');
              $(root_class + ' .attach_pdf').show();
              $(root_class + ' .attach_pdf .attach_img_count').html(__this.photos[type]['pdf_count'])
              $(root_class + ' .attach_label').hide();
              $(root_class + ' .issue_button').removeClass('no_file');
            }
          //}
        /*else {
              __this.file.resolveLocalFilesystemUrl(resolvedFilePath).then((entry:any)=>{
                  entry.file((file1)=>{
                  var reader = new FileReader();
                  reader.onload =  (encodedFile: any)=>{
                    var src = encodedFile.target.result;

                    alert(src);

                    __this.photos[type]['photo_array'].push(src);
                    __this.photos[type]['count'] ++;

                    if(type == 'ems' || type == 'bl' || type == 'hand') {
                      var root_class = '.attach_' + type;
                      $(root_class).removeClass('no_file');
                      $(root_class + ' .text_label').removeClass('no_file');
                      $(root_class + ' .attach_img').show();
                      $(root_class + ' .attach_img .attach_img_count').html(__this.photos[type]['count']);
                      $(root_class + ' .attach_pdf').removeClass('no_file');
                      $(root_class + ' .attach_label').hide();
                      $(root_class + ' .issue_button').removeClass('no_file');
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
        this.photos[type]['count'] ++;
        this.photos[type]['photo_array'].push(imageData);
        if(type == 'ems' || type == 'bl' || type == 'hand') {
          var root_class = '.attach_' + type;
          $(root_class).removeClass('no_file');
          $(root_class + ' .text_label').removeClass('no_file');
          $(root_class + ' .attach_img').show();
          $(root_class + ' .attach_pdf').removeClass('no_file');
          $(root_class + ' .attach_img .attach_img_count').html(this.photos[type]['count']);
          $(root_class + ' .attach_label').hide();
          $(root_class + ' .issue_button').removeClass('no_file');
        }
    });
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
  openPopup(type) {
    if(type == 'ems') {
      this.images = [];
      for(var i = 0; i < this.photos['ems']['photo_array'].length; i ++)
        this.images.push(`data:image/jpeg;base64,${this.photos['ems']['photo_array'][i]}`);
    }
    else if(type == 'bl') {
      this.images = [];
      for(var i = 0; i < this.photos['bl']['photo_array'].length; i ++)
        this.images.push(`data:image/jpeg;base64,${this.photos['bl']['photo_array'][i]}`);
    }
    else if(type == 'hand') {
      this.images = [];
      for(var i = 0; i < this.photos['hand']['photo_array'].length; i ++)
        this.images.push(`data:image/jpeg;base64,${this.photos['hand']['photo_array'][i]}`);
    }
    else if(type == 'business') {
      this.images = [];
      for(var i = 0; i < this.photos['business']['photo_array'].length; i ++)
        this.images.push(`data:image/jpeg;base64,${this.photos['business']['photo_array'][i]}`);
    }
    else {
      this.images = [];
      for(var i = 0; i < this.photos['verify']['photo_array'].length; i ++)
        this.images.push(`data:image/jpeg;base64,${this.photos['verify']['photo_array'][i]}`);
    }
    this.slide_count = this.images.length;
    this.presentLoading();
    let __this = this;
    setTimeout(function() {
      __this.dismiss();
    } , 1000);

    this.popup = true;
  }
}
