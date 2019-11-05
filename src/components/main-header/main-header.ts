import { Component, Input, Injector } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Preferences } from '../../providers/preferences';
import { RemoteService } from '../../providers/remote-service/remote-service';
import { LocalNotifications } from '@ionic-native/local-notifications';
/**
 * Generated class for the FoodTabComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@IonicPage()
@Component({
  selector: 'main-header',
  templateUrl: 'main-header.html'
})
export class MainHeader {
  @Input() notification: string;
  notify_icon = './assets/icon/notification_icon.png';
  protected server: RemoteService;
  constructor(public navCtrl: NavController, public preferences: Preferences, injector: Injector , private localNotifications: LocalNotifications) {
    this.server = injector.get(RemoteService);
    this.localNotifications.on('click' , ( notification, state) => {
        this.navCtrl.push('NotificationPage');
    });
    this.backgroundService();
  }
  backgroundService() {
    let user = this.preferences.get('user');
    if (!user) {
      return;
    }
    let params = 'a05';
    let data = '{ ' +
      '"api_key" : "d69397d5-adb9-4ee1-b370-c73a79722bb7", ' + 
      '"request_param" : { ' + 
        '"user_key" : "' + user['user_key'] + '", ' + 
        '"sort_gb" : "B" ' + 
      ' } } ';
    let server_value: any;
    let __this = this;
    server_value = this.server;
    setInterval(function() {
      server_value.post(encodeURI(params) , data).subscribe(data => {
        if(data.result_cd == "S") {
          if(data.data_list.length > 0) {
              let last_date = __this.preferences.get('last_date');
              
              let last_notify_date = __this.preferences.get('last_notify_date');
              for( var i = 0; i < data.data_list.length; i ++ ) {
                if( data.data_list[i].alert_reg_dt != last_notify_date ) {
                  __this.makeNotification("새 알림" , data.data_list[i].alert_contents , data.data_list[i].sq);
                }
                else 
                  break;
              }
              __this.preferences.set('last_notify_date', data.data_list[0].alert_reg_dt);
              if(!last_date) {
                __this.notify_icon = './assets/icon/notification_icon1.png';
              }
              else if(last_date != data.data_list[0].alert_reg_dt) {
                __this.notify_icon = './assets/icon/notification_icon1.png';
              }
              else {
                __this.notify_icon = './assets/icon/notification_icon.png';
              }
          }
        }
      }, err => {
      });
    } ,60000);
  }
  gotoCalculator () {
    this.navCtrl.push('CalculatorPage');
  }
  gotoNotification () {
    var __this = this;
    let myCallbackFunction = (_params) => {
      return new Promise((resolve , reject) => {
          if(_params['success']) {
            __this.notify_icon = './assets/icon/notification_icon.png';
          }
          resolve();
      });
    }
    this.navCtrl.push('NotificationPage' , {callback: myCallbackFunction});
  }
  makeNotification(title , text , id) {
    this.localNotifications.schedule({
      id: id,
      title: title , 
      text: text ,
      data: {secret: "123"}
    });
  }
}
