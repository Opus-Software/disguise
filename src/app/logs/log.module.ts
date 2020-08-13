import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LogComponent } from './log.component';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
      LogComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: 'logs', component: LogComponent }
    ]),
    SharedModule
  ],
  providers: [DatePipe]
})
export class LogModule { }
