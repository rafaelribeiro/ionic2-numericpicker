import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { Numeric } from './components/component';
import { Observable } from 'rxjs';

@NgModule({
  declarations: [
    Numeric,
  ],
  providers: [],
  exports: [
    Numeric,
  ],
  imports: [
    BrowserModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class NumericModule { }
