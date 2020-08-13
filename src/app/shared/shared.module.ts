import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';
import { DownloadDialogComponent } from './download-dialog.component';
import { UploadDialogComponent } from './upload-dialog.component';
import { AddStubDialogComponent } from './add-stub-dialog.component';
import { FilterDialogComponent } from './filter-dialog.component';
import { TimestampPipe } from './timestamp.pipe';

@NgModule({
    declarations: [
        DialogComponent,
        DownloadDialogComponent,
        UploadDialogComponent,
        AddStubDialogComponent,
        FilterDialogComponent,
        TimestampPipe
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FontAwesomeModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        TimestampPipe
    ],
    providers: [ DialogService ],
    entryComponents: [
        DialogComponent,
        DownloadDialogComponent,
        UploadDialogComponent,
        AddStubDialogComponent,
        FilterDialogComponent
    ]
})

export class SharedModule { }
