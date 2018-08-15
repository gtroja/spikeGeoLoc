import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  message : string;

  print( text ){
    this.message += text + '\n'
  }

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy
  ){

    //ja que o iphone não nos da acesso ao console.log
    console.log = (texto, add?)=>{
      this.message += texto + "\n";
      if(add){
        this.message += "\n" + JSON.stringify(add)
      }
  
    }
    
    this.message = "ola mundo\n"
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        this.print("posso requisitar")
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.print('Request successful')
            let options = {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            };            
            this.geolocation.getCurrentPosition(options).then((resp) => {
              this.print("lat "+resp.coords.latitude)
              this.print("lon "+resp.coords.longitude)
              
             }).catch((error) => {
               this.print('erro :(' + JSON.stringify(error) + error)
             });

          },
          error => 
            this.print('Error requesting location permissions' + error + JSON.stringify(error))
        );
      }
      else{
        this.print("Não posso requisitar a posição")
      }
    
    });

    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }; 

    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.print("lat "+resp.coords.latitude)
      this.print("lon "+resp.coords.longitude)      
     }).catch((error) => {
       this.print('erro :(' + JSON.stringify(error) + error)
     });
     
     let watch = this.geolocation.watchPosition(options);
     watch.subscribe(
      (data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      this.print("STREAM: lat: " + data.coords.latitude)
      this.print("STREAM: long: " + data.coords.longitude)
      },
      err => {
        this.print("erro no stream de pos" + err)
      }
    );




  }

}
