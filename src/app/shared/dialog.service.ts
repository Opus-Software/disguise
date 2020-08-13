import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadDialogComponent } from './download-dialog.component';
import { DialogComponent } from './dialog.component';
import { UploadDialogComponent } from './upload-dialog.component';
import { AddStubDialogComponent } from './add-stub-dialog.component';
import { FilterDialogComponent } from './filter-dialog.component';

@Injectable()
export class DialogService {

  constructor(private modalService: NgbModal) { }

  confirm(title: string, message: string, btnOkText: string = 'DELETE',
          btnCancelText: string = 'CANCEL', dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
      const modalRef = this.modalService.open(DialogComponent, { size: dialogSize, centered: true, windowClass: 'confirm-modal' });
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.btnOkText = btnOkText;
      modalRef.componentInstance.btnCancelText = btnCancelText;
      return modalRef.result;
  }

  download(title: string, message: string, btnOkText: string = 'DOWNLOAD',
           btnCancelText: string = 'CANCEL', dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
      const modalRef = this.modalService.open(DownloadDialogComponent, { size: dialogSize, centered: true, windowClass: 'download-modal' });
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.btnOkText = btnOkText;
      modalRef.componentInstance.btnCancelText = btnCancelText;
      return modalRef.result;
  }

  upload(title: string, message: string, ports: string[], btnOkText: string = 'UPLOAD',
         btnCancelText: 'CANCEL', dialogSize: 'sm'|'md' = 'sm'): Promise<boolean> {
      const modalRef = this.modalService.open(UploadDialogComponent, { size: dialogSize, centered: true, windowClass: 'upload-modal' });
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.btnOkText = btnOkText;
      modalRef.componentInstance.btnCancelText = btnCancelText;
      modalRef.componentInstance.ports = ports;
      return modalRef.result;
  }

  addStub(imposterPort: number, btnOkText: string = 'DONE', btnCancelText: string = 'CANCEL',
          dialogSize: 'sm'|'xl' = 'xl'): Promise<boolean> {
      const modalRef = this.modalService.open(AddStubDialogComponent, { size: dialogSize, keyboard: false, backdrop: 'static',
        windowClass: 'add-stub-dialog'});
      modalRef.componentInstance.btnOkText = btnOkText;
      modalRef.componentInstance.btnCancelText = btnCancelText;
      modalRef.componentInstance.imposterPort = imposterPort;
      return modalRef.result;
  }

  openFilter(filters: object, imposters: object, dialogSize: 'sm'|'md' = 'md'): Promise<object> {
      const modalRef = this.modalService.open(FilterDialogComponent, { size: dialogSize, centered: true, windowClass: 'filter-dialog' });
      modalRef.componentInstance.inputFilters = filters;
      modalRef.componentInstance.imposters = imposters;
      return modalRef.result;
  }
}
