import { Component, Injector , ViewChild , Input } from '@angular/core';
import { IonicPage , Platform , App } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { AppAvailability } from '@ionic-native/app-availability';
import { BasePage } from '../base/base';
import { Common } from '../../common';
//import * as launcher from '../../assets/js/start-app';
declare var launcher: any;
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
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
})
export class ConfirmPage extends BasePage {

  @ViewChild('input') myInput;

  calc_params = null;    searchAddress_visit = false;
  position = 'main'; zipcode = ''; addr = ''; detail_addr = '';
  username = ''; mobile = ''; pcc = '';

  is_address_access = false;

  constructor(injector: Injector , private platform: Platform, private appAvailability: AppAvailability , public inAppBrowser: InAppBrowser , protected app: App) {
    super(injector);

    let user = this.preferences.get('user');
    if (!user) {
      this.navCtrl.setRoot('SigninPage');
      return;
    }

    this.username = user['user_nm'];
    this.mobile = user['user_tel'];
    this.pcc = user['user_pcc'];
    this.zipcode = user['user_post'];
    this.addr = user['user_addr1'];
    this.detail_addr = user['user_addr2'];
    
    var __this = this;
      window.addEventListener('message', (event) => { 
          __this.zipcode = event.data.zonecode;
          __this.addr = event.data.fullAddr;
          __this.is_address_access = true;
          $('.mainWindow').show();
          $('.searchWindow').hide();   
          setTimeout(() => {
            __this.myInput.setFocus();
          },150);
      });   
      if( this.navParams.get("calc_params") ) {
        this.calc_params = this.navParams.get("calc_params");
      }
      if( this.navParams.get("zipcode") ) {
          this.zipcode = this.navParams.get("zipcode");
          this.addr = this.navParams.get("addr");
          setTimeout(() => {
            __this.myInput.setFocus();
          },150);
      }
      if( this.navParams.get("username") ) {
        this.username = this.navParams.get("username");
        this.mobile = this.navParams.get("mobile");
        this.pcc = this.navParams.get("pcc");
      }
  } 
  cancel() {
    if(this.is_address_access) {
        //this.app.getRootNav().pop();
        this.navCtrl.push('HomePage');
    }
    else
      this.navCtrl.pop();
  }
  next() {
    if(this.pcc == '') {
      this.presentToast('통관고유부호를 입력하세요.');
      return;
    }
    if(this.username == '') {
      this.presentToast('이름을 입력하세요.');
      return;
    }
    if(this.mobile == '') {
      this.presentToast('휴대폰 번호를 입력하세요.');
      return;
    }
    if(this.addr == '') {
      this.presentToast('주소를 입력하세요.');
      return;
    }
    if(this.zipcode == '') {
      this.presentToast('우편번호를 입력하세요.');
      return;
    }

    if(!this.calc_params)
      this.navCtrl.push('Transport_registerPage' , {pcc: this.pcc , username: this.username , mobile: this.mobile , addr: this.addr , zipcode: this.zipcode , detail_addr: this.detail_addr});
    else  
      this.navCtrl.push('Transport_registerPage' , {pcc: this.pcc , username: this.username , mobile: this.mobile , addr: this.addr , zipcode: this.zipcode , detail_addr: this.detail_addr , calc_params: this.calc_params});
      
  }
  searchAddress() {
      //this.position = 'search';
      $('.mainWindow').hide();
      $('.searchWindow').show();
      if(!this.searchAddress_visit) {
        var iframe = $('#iframe');
        iframe[0].src = iframe[0].src;
        setTimeout(function() {
          $('#iframe').css('visibility' , 'visible');
        } , 500);
      }
      this.presentLoading();
      var __this = this;
      setTimeout(function(){
        __this.dismiss();
      } , 2000);
      this.searchAddress_visit = true;
  }

  close() {
    $('.mainWindow').show();
    $('.searchWindow').hide();
    //this.position = 'main';
  }

  ionViewDidEnter(){ 
    if(this.platform.is('ios') || this.platform.is('android')){
      // This is a mobile device, add app-launcher script in head
      var head = document.getElementsByTagName('head')[0];
      var scriptTag = document.createElement("script"); 
      scriptTag.src = "assets/js/Launcher.js"; // script for launching apps
      head.appendChild(scriptTag);
    }
  }

  issue() {
      this.launchExternalApp('instagram://', Common.app_link['customs_office']['packagename'], Common.app_link['customs_office']['ios_url'], Common.app_link['customs_office']['android_url']);
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
