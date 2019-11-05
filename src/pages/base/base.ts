import { Injector } from '@angular/core';
import {
  NavController, LoadingController, ToastController, ActionSheetController,
  NavParams, AlertController, Loading
} from 'ionic-angular';
import { Preferences } from '../../providers/preferences';
import { RemoteService } from '../../providers/remote-service/remote-service';

export abstract class BasePage {
    protected navCtrl: NavController;
    protected navParams: NavParams;
    protected preferences: Preferences;
    protected server: RemoteService;
    protected alertCtrl: AlertController;
    protected toastCtrl: ToastController;
    protected loadingCtrl: LoadingController;
    protected actionCtrl: ActionSheetController;
    protected loading: Loading;
    protected isLoading: boolean = false;
    constructor(injector: Injector) {
      this.navCtrl = injector.get(NavController);
      this.navParams = injector.get(NavParams);
      this.preferences = injector.get(Preferences);
      this.server = injector.get(RemoteService);
      this.toastCtrl = injector.get(ToastController);
      this.loadingCtrl = injector.get(LoadingController);
      this.actionCtrl = injector.get(ActionSheetController);
      this.alertCtrl = injector.get(AlertController);
    }
    back() {
      this.navCtrl.pop();
    }
    textareaToDiv(msg: string) {
      if (msg) {
        msg = msg.replace(/(?:\r\n|\r|\n)/g, '<br />');
      }
      else {
        msg = "";
      }
      return msg;
    }
    presentToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
    presentSuccessToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom',
        cssClass: 'successToast'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
    presentLoading(msg?: string) {
      msg = '처리중입니다...';
      if (this.isLoading) {
      }
      else {
        this.loading = this.loadingCtrl.create({
          content: msg
        });
        this.isLoading = true;
      }
      this.loading.present();
    }
    presentConfirm(title: string, message: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        let confirm = this.alertCtrl.create({
          title: title,
          subTitle: message,
          buttons: ['Dismiss']
        });
  
        confirm.present();
      });
    }
    dismiss() {
      if (this.isLoading) {
        this.loading.dismiss();
        this.isLoading = false;
      }
    }
    getNumberFormat( _num ) {
        if(_num == '') return _num;
        if(isNaN(_num))  return '';
        _num = parseInt(_num);
        _num = _num.toString();  
        var num = _num.split("");
        num = num.reverse();
        _num = num.join("");
        var result = "";
        var first = true , gap_size = 3; //Desired distance between spaces
        while (_num.length > 0) { // Loop through string 
            if(!first)
              result = result + "," + _num.substring(0,gap_size); // Insert space character
            else{
                result = result + _num.substring(0,gap_size); // Insert space character
                first = false;
            }
            _num = _num.substring(gap_size);  // Trim String
        }
        num = result.split("");
        num = num.reverse();
        result = num.join("");
        return result;
    }
    getExtensionCheck( filePath ) : boolean {
      let file_parts = filePath.split('/');
      let last_file_part = file_parts[file_parts.length-1];
      let extension = '';
      file_parts = last_file_part.split('?');
      extension = file_parts[0].split('.')[file_parts[0].split('.').length - 1];
      if( !(extension == 'PDF' || extension == 'pdf' || extension == 'jpg' || extension == 'JPG' || extension == 'png' || extension == 'PNG') ) {
          return false;
      }
      return true;
    }
    getFileExtension (link) : string {
      let link_parts = link.split('.');
      let extension = link_parts[link_parts.length - 1];
      return extension;
    }
    isPdfFile ( filePath ) : boolean {
      let file_parts = filePath.split('/');
      let last_file_part = file_parts[file_parts.length-1];
      let extension = '';
      file_parts = last_file_part.split('?');
      extension = file_parts[0].split('.')[file_parts[0].split('.').length - 1];
      if(  !(extension == 'JPG' || extension == 'jpg' || extension == 'png' || extension == 'PNG') ) {
          return true;
      }
      return false;
    }
    getFileName( filePath ) : string {
        let file_name = '' , extension = '';
        let file_parts = filePath.split('/');
        let last_file_part = file_parts[file_parts.length-1];
        file_parts = last_file_part.split('?');
        if(file_parts.length < 2)
          file_name = file_parts[0];
        else 
        {
          extension = file_parts[0].split('.')[file_parts[0].split('.').length - 1];
          file_name = file_parts[1] + '.' + extension;
        }
        return file_name;
    }
    getDateFormat(str) : string {
      var e_date = str.substr(0 , 4);
      e_date = e_date + '.' + str.substr(4 , 2);
      e_date = e_date + '.' + str.substr(6 , 2);
      return e_date;
    }
    returnImage (blob) : any {
      var ret =  `data:image/jpeg;base64,${blob}`;
      return ret;
    }

    getDateFromDateTime(datetime) : string {
      var res = datetime.split(" ");
      return res[0];
    }
  }