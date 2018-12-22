import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators,FormBuilder,FormGroup,FormControl} from '@angular/forms'; 
import {HomePage} from '../home/home';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
public server:any;
  public deviceId:any;
  public setting:FormGroup;
  public mama:any;
  public man;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public fm:FormBuilder, public alertCtrl:AlertController, public http:Http) {

    this.setting = fm.group({
          server: ['', Validators.compose([Validators.minLength(10), Validators.required])],
          deviceId: ['', Validators.compose([Validators.minLength(4), Validators.required])]
    
        });

        this.man = this.setting;
        this.server = this.setting.controls['server'];  
        this.deviceId = this.setting.controls['deviceId'];    
  }

  ionViewDidLoad() {
     //console.log('ionViewDidLoad SettingPage');
  }

  back(){
    this.navCtrl.push(HomePage);
  }

  submit(){
    this.http.get("http://"+this.server.value +"/meeting/public/register-dev?device=" +this.deviceId.value)
    .map(res=>res.json()).subscribe(result=>{
      if(result){
        console.log(result.room_email);
        window.localStorage.setItem("email",result.room_email);
        window.localStorage.setItem("server", this.server.value);
        window.localStorage.setItem('deviceId', this.deviceId.value);
          this.navCtrl.push(HomePage);
          window.location.reload(true);
      }   
          },
        err=>{
          this.showAlert();
            this.navCtrl.push(SettingPage);
    })
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invalid Details',
      subTitle: 'The IP with the DeviceID does not match please try again',
      buttons: ['OK']
    });
    alert.present();
  }   

}
