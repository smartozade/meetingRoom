import { Component, ViewChild } from '@angular/core';
import { NavController,Slides, NavParams, AlertController} from 'ionic-angular';
import {SettingPage } from '../setting/setting';
import {Device} from '@ionic-native/device';

import * as Moment from 'moment';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Http, Headers} from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides:Slides;
  public query : string = 'slide1';

      socket:any;

      today = Moment(new Date()).format('MM / DD / YYYY');
      public check:boolean = true;
      public booking:boolean = false;
      public data:any;
      public future = [];
      public past = [];
      public current = [];
      public currentList:any;
      public pastList:any;
      public pastRev:any;
      public dataRev:any;
      public futureList:any;
      public futureRev:any;
      public Meetings= [];
      public IP:any;
      public deviceId:any;
      public device_uuid:any;
      public platform:any;
      public Email:any;
      count:any;
      tasks:any;
      thisday:any;
      
      showLevel1 = null;
      showLevel2 = null;

  constructor(public navCtrl: NavController, public alertCtrl:AlertController,public navParams:NavParams, 
    public http:Http, private device:Device) {       
        this.device_uuid = device.uuid;
        this.platform = device.platform;
        this.Email = window.localStorage.getItem("email");
        this.IP = window.localStorage.getItem("server");
        this.deviceId = window.localStorage.getItem('deviceId');
        this.socket = io('http://'+ this.IP +':8001'+ '/');//8001
        var data = this.getData();
        this.socket.on(this.Email,function(msg, data){
              console.log('message', msg);
            window.location.reload(true);
            });
        this.past = [{"title":"Technical","name":"AK","start_time":"2017-10-13 14:00:00","end_time":"2017-10-13 19:00:00"}];    
        this.future = [{"title":"Technical","name":"AK","start_time":"2017-10-13 14:00:00","end_time":"2017-10-13 19:00:00"}];
        this.thisday = this.todayDate(new Date);        
  }

  ionViewDidLoad() {
    this.task();
    //console.log(this.Meetings);
    let header = new Headers();
    //application/x-www-form-urlencoded
    header.append('Content-Type','application/Json')
    var link = 'http://'+ this.IP +'/meeting/public/device-update';

    var body = new FormData();
    body.append('device_no', this.deviceId);
    body.append('device_uuid', this.device_uuid);
    body.append('platform', this.platform);    
    //console.log(JSON.stringify(body));
    this.http.post(link, body)
    .subscribe(data =>{
      console.log(data);},
      error =>{
        console.log("error");
    });
    
  }
  ionViewWillEnter(){
  
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'API Error!',
      subTitle: 'Unable to connect to the API to update Meetings!',
      buttons: ['OK']
    });
    alert.present();
  }

isLevel1Shown(idx) {
  return this.showLevel1 === idx;
};

isLevel2Shown(idx) {
  return this.showLevel2 === idx;
};

toggleLevel1(idx) {
  if (this.isLevel1Shown(idx)) {
    this.showLevel1 = null;
  } else {
    this.showLevel1 = idx;
  }
};

toggleLevel2(idx) {
  if (this.isLevel2Shown(idx)) {
    this.showLevel1 = null;
    this.showLevel2 = null;
  } else {
    this.showLevel1 = idx;
    this.showLevel2 = idx;
  }
};

  // lets get todays date for display
  todayDate(para){
    var today = new Date(para);
    var m:number;
    var tmonth = "";
     var month = (today.getMonth());  
     var m_names = new Array("January", "February", "March", 
                            "April", "May", "June", "July", "August", "September", 
                            "October", "November", "December");
  for(m=0;m<12; m++){
    if(month===m){
      tmonth = m_names[m];
      continue;
    }
  }
    var tom = tmonth + " ";
     tom += today.getDate() + ",";  
     tom += " " + today.getFullYear(); 
  return tom;
  }
        //'http://'+this.IP +'/MeetioServer/public/meeting'
      //http://192.168.234.220/MeetioServer/public/meeting
    public getData(){
      this.Meetings = [];
      this.Email = window.localStorage.getItem("email");
      this.IP = window.localStorage.getItem("server");
      this.http.get('http://'+this.IP +'/meeting/public/getMeetings?email='+this.Email).map(res=>res.json()).subscribe(
        result=>{
          for(var j=0; j<result.length; j++){
              this.Meetings.push(result[j]);
          }
            
        },
        err=>{
          this.showAlert();
            
        });
    return this.Meetings;
    }
//get formated date for each meeting and return it as string object
getMeetingDay(dday:string){
     var fday = Moment(new Date(dday)).format('DD / MM / YYYY');
  return fday;
}

//get time formated from date for each meeting and return it as object
 getTime(mtime:string) {
      var hours = this.checkTime(new Date(mtime).getHours());
      var minutes = this.checkTime(new Date(mtime).getMinutes());

      return hours + ":" + minutes;
  }

  
setPageContents(){
  var list = this.Meetings;
  this.currentList = [];
  this.pastList = [];
  this.futureList = []; 
  this.data = [];
  var now = new Date();
  for(var i = 0; i < list.length; i++){
    if(new Date(list[i].start_time).getTime() < now.getTime() && new Date(list[i].end_time).getTime() < now.getTime()){      
      this.pastList.push(list[i]);
      continue;
    }
    if(new Date(list[i].start_time).getTime() < now.getTime() && new Date(list[i].end_time).getTime() > now.getTime()){      
      this.currentList.push(list[i]);
      continue;
    }
    if(new Date(list[i].start_time).getTime() > now.getTime() && new Date(list[i].end_time).getTime() > now.getTime()){      
      this.futureList.push(list[i]);
      continue;
    } 
  } 
  if(this.pastList.length >0){
    this.pastRev  = this.pastList.reverse();
    window.localStorage.setItem("past",JSON.stringify(this.pastList[this.futureList.length - 1]));
  }
  if(this.currentList.length > 0){
    window.localStorage.setItem("current",JSON.stringify(this.currentList[0]));
    document.getElementById('currentTitle').innerHTML = this.currentList[0].subject;
    document.getElementById('currentName').innerHTML = this.currentList[0].from;
    document.getElementById('avail').innerHTML = "OCCUPIED";
    var ch =(new Date(this.currentList[0].start_time ).getHours());
    var cm = this.checkTime(new Date(this.currentList[0].start_time ).getMinutes());
    var ceh =(new Date(this.currentList[0].end_time).getHours());
    var cem = this.checkTime(new Date(this.currentList[0].end_time).getMinutes());
    document.getElementById('currentTime').innerHTML = ch+ " : " + cm + "  -  " + ceh+ " : " + cem ;
    
    // Lets give room for Concurrent / Colliding Meetings

    // if(this.currentList.length>1){
    //    var remaining = document.getElementById('remaining');
    //    remaining.innerHTML = "";
    //   for(var x =1; x<this.currentList.length; x++){
    //     var aa = document.createElement('p');
    //     var dt = document.createElement('h5');
    //     var dn = document.createElement('h5');
    //     var dst = document.createElement('h5');
    //     dt.innerHTML = this.currentList[x].subject;
    //     dn.innerHTML =  this.currentList[x].from;
    //     var fhl =(new Date( this.currentList[x].start_time).getHours());
    //     var fml = this.checkTime((new Date( this.currentList[x].start_time ).getMinutes()));
    //     var fehl =(new Date( this.currentList[x].end_time).getHours());
    //     var feml = this.checkTime((new Date( this.currentList[x].end_time).getMinutes()));
    //     dst.innerHTML = fhl+ " : " + fml + "  -  " + fehl+ " : " + feml ;
    //     remaining.appendChild(aa);
    //     remaining.appendChild(dt);
    //     remaining.appendChild(dst);
    //     remaining.appendChild(dn);
    //   }

    // }

  }else if(this.futureList.length >0){
      var diff =(new Date(this.futureList[this.futureList.length - 1].start_time).getTime() - now.getTime()) / 1000;
      diff /= 60;
      var rd = Math.abs(Math.round(diff));
      document.getElementById('avail').innerHTML = "AVAILABLE <br>"+" <br> For   "+ Math.floor(rd/60)+ " hrs " + Math.floor(rd%60)+ " mins ";
      document.getElementById('currentTitle').innerHTML = "";
      document.getElementById('currentName').innerHTML = "";
      document.getElementById('currentTime').innerHTML = "";
  }else {
    this.booking = true;
    document.getElementById('avail').innerHTML = "FREE";
    document.getElementById('currentTitle').innerHTML = "";
    document.getElementById('currentName').innerHTML = "";
    document.getElementById('currentTime').innerHTML = "";

  }
     
  if(this.futureList.length >0){
    for(var f =0; f<this.futureList.length; f++){
      var day = Moment(new Date(this.futureList[this.futureList.length - 1].start_time)).format('MM / DD / YYYY');
      this.data.push(this.futureList[this.futureList.length - 1]);
      this.futureList.pop(this.futureList[this.futureList.length - 1]);
      continue;
    }
    // this.dataRev = this.data.reverse();
    // this.futureRev  = this.futureList.reverse();
    // window.localStorage.setItem("future",JSON.stringify(this.futureList[this.futureList.length - 1]));
    // document.getElementById('nextTitle').innerHTML = this.futureList[this.futureList.length - 1].subject;
    // document.getElementById('nextName').innerHTML = this.futureList[this.futureList.length - 1].from;
    // document.getElementById('nextDay').innerHTML = this.todayDate(this.futureList[this.futureList.length - 1].start_time);
    // var fh =(new Date(this.futureList[this.futureList.length - 1].start_time).getHours());
    // var fm = this.checkTime(new Date(this.futureList[this.futureList.length - 1].start_time ).getMinutes());
    // var feh =(new Date(this.futureList[this.futureList.length - 1].end_time).getHours());
    // var fem = this.checkTime(new Date(this.futureList[this.futureList.length - 1].end_time).getMinutes());
    // document.getElementById('nextTime').innerHTML = fh+ " : " + fm + "  -  " + feh+ " : " + fem ;
  }

  if(this.data.length >0){
    for(var a =0; a<this.data.length; a++){
      // var day = Moment(new Date(this.futureList[this.futureList.length - 1].start_time)).format('MM / DD / YYYY');
      this.data.push(this.futureList[this.futureList.length - 1]);
      this.data.pop(this.data[this.data.length - 1]);
      continue;
    }
  }

  this.dataRev = this.data.reverse();
  this.futureRev  = this.futureList.reverse();
  window.localStorage.setItem("future",JSON.stringify(this.futureList[this.futureList.length - 1]));
      
  
}

  task():void{
    
    let self = this;

    self.tasks = setInterval(function () {
      var r = self.getTimeRemaining();

      var clockDivs = document.getElementsByClassName('clock');
      for(var i = 0; i < clockDivs.length; i++ ){
        clockDivs[i].innerHTML = ""+ r.hours+ ":"+ r.minutes ;
      }
      self.check = false;
      self.setPageContents();
      
    },30000);

  }

  getTimeRemaining() {
      var dt = new Date();

      var hours = this.checkTime(dt.getHours());
      var minutes = this.checkTime(dt.getMinutes());

      return {
          'total': dt,
          'hours': hours,
          'minutes': minutes,
      };
  }

  checkTime(i) {
      i = (i < 10) ? "0" + i : i; 
      
      return i;
  }

  
//meeting room checkin logic
 showBooking() {
    // let prompt = this.alertCtrl.create({
    //    title: 'Meeting Title',
    //   // message: "Enter the meeting Title",
    //   inputs: [
    //     {
    //       name: 'title',
    //       placeholder: 'Title'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Save',
    //       handler: data => {
    //         let prompt = this.alertCtrl.create({
    //           title: 'Meeting Title',
    //           inputs: [
    //             {
    //               name: 'title',
    //               placeholder: 'Enter your name'
    //             },
    //           ],
    //           buttons: [
    //             {
    //               text: 'Cancel',
    //               handler: data => {
    //                 console.log('Cancel clicked');
    //               }
    //             },
    //             {
    //               text: 'Save',
    //               handler: data => {
    //                 console.log('Saved clicked');
    //               }
    //             }
    //           ]
    //         });
    //         prompt.present();
    //         console.log('Saved clicked');
    //       }
    //     }
    //   ]
    // });
    // prompt.present();
  }

  setting(){
    this.navCtrl.push(SettingPage);
  }


showdata(){
  if(this.query == 'slide1')
  {
    this.slides.slideTo(0,0);
  }
  if(this.query == 'slide2')
  {      
    this.slides.slideTo(1,0);
  }
  if(this.query == 'slide3')
  {     
    this.slides.slideTo(2,0);
  }
  if(this.query == 'slide4')
  {     
    this.slides.slideTo(3,0);
  }
  
}
  // showdata() function ends here !!!

slideChanged(){
    if(this.slides._activeIndex == 0){
        this.query = 'slide1';
    }
    if(this.slides._activeIndex == 1){
        this.query = 'slide2';
    }
    if(this.slides._activeIndex == 2){
        this.query = 'slide3';
    }
      if(this.slides._activeIndex == 3){
        this.query = 'slide4';
    }

  }

}
