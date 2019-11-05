import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Preferences } from '../providers/preferences';
import { Deeplinks } from '@ionic-native/deeplinks';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'SigninPage';
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public preferences: Preferences , private deeplinks: Deeplinks) {
    platform.ready().then(() => {
        statusBar.styleDefault();
        preferences.load().then((data) => {
            if (data) {
              if (data.user) {
                preferences.data = data;
                this.rootPage = "HomePage";
                setTimeout(function(){
                  splashScreen.hide();
                } , 1000);
              }
              else {
                splashScreen.hide();  
                preferences.setEmpty();
              }
            }
            else {
              splashScreen.hide();
              this.rootPage = "SigninPage";
              preferences.setEmpty();
            }
        } ,
        (error) => {
            splashScreen.hide();
            this.rootPage = "SigninPage";
        });
    });
  }
}
