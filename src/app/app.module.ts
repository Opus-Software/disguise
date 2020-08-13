import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LogModule } from './logs/log.module';
import { ImposterModule } from './imposters/imposter.module';
import { HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'about', component: AboutComponent},
      { path: '', redirectTo: 'imposters', pathMatch: 'full' },
      { path: '**', redirectTo: 'imposters', pathMatch: 'full' }
    ], { onSameUrlNavigation: 'reload' }),
    LogModule,
    ImposterModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
