import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NumericModule } from 'ionic2-numericpicker/dist/src';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    NumericModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
