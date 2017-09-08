import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
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
    CommonModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class NumericModule { }
