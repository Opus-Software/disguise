import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImposterService } from '../imposters/imposter.service';

@Component({
    selector: 'app-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.sass']
})
export class UploadDialogComponent {

    @Input() title: string;
    @Input() message: string;
    @Input() btnOkText: string;
    @Input() btnCancelText: string;
    @Input() ports: string[];

    constructor(private activeModal: NgbActiveModal,
                private imposterService: ImposterService) { }
    fileReader;
    selectedFile;
    portsInUse = [];
    filename = '';

    onFileChanged(event): void {
        this.selectedFile = event.target.files[0];
        this.fileReader = new FileReader();
        this.fileReader.readAsText(this.selectedFile, 'UTF-8');
        this.filename = this.selectedFile['name'];
    }

    public decline() {
        this.activeModal.dismiss();
    }

    public accept() {
        const text = JSON.parse(this.fileReader.result);
        text['imposters'].forEach(imposter => {
            if (this.ports.includes(imposter.port)) {
                this.portsInUse.push(imposter.port);
            } else {
                this.imposterService.postImposters(imposter).subscribe({
                    next: () => {}
                });
            }
        });
        if (this.portsInUse.length > 0) {
            alert('These ports are already in use: ' + this.portsInUse);
            this.portsInUse = [];
            this.activeModal.dismiss();
        }
        this.activeModal.close(true);
    }
}
