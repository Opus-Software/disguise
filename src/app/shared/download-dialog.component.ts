import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImposterService } from '../imposters/imposter.service';

@Component({
    selector: 'app-dialog',
    templateUrl: './download-dialog.component.html',
    styleUrls: ['./download-dialog.component.sass']
})
export class DownloadDialogComponent {

    @Input() title: string;
    @Input() message: string;
    @Input() btnOkText: string;
    @Input() btnCancelText: string;

    constructor(private activeModal: NgbActiveModal,
                private imposterService: ImposterService) { }
    filename = '';

    public decline() {
        this.activeModal.close(false);
    }

    public accept() {
        this.imposterService.getImposters({ params: { removeProxies: true } }).subscribe({
            next: imposters => {
                const blob = new Blob([JSON.stringify(imposters, null, 2)], { type: 'text/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display: none');
                a.href = url;
                a.download = this.filename.trim() ? this.filename + '.json' : 'config.json';
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                this.activeModal.close(true);
            }
        });
    }
}
