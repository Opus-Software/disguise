import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ImposterListComponent } from './imposter-list.component';
import { ImposterDetailComponent } from './imposter-detail.component';
import { ImposterAddComponent } from './imposter-add.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ImposterListComponent,
    ImposterDetailComponent,
    ImposterAddComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: 'imposters', component: ImposterListComponent },
      { path: 'imposters/:port', component: ImposterDetailComponent },
      { path: 'newImposter', component: ImposterAddComponent }
    ]),
    SharedModule,
    ReactiveFormsModule
  ]
})

export class ImposterModule { }
