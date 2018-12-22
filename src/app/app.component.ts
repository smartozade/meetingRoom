import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Device} from '@ionic-native/device';

import { HomePage } from '../pages/home/home';
import {SettingPage} from '../pages/setting/setting';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      console.log(Device.name);
      //config settings
      const configSet = localStorage.getItem('server');
      if (configSet) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = SettingPage;
      }


      //settings ends here
    });
  }
}

