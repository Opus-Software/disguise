import { Component, OnInit } from '@angular/core';
import { ImposterService } from './imposter.service';
import { faList, faTrash, faInfoCircle, faPlusSquare, faSyncAlt, faFileDownload,
    faTimes, faCheck, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { DialogService } from '../shared/dialog.service';
@Component({
    templateUrl: './imposter-list.component.html',
    styleUrls: ['./imposter-list.component.sass'],
})
export class ImposterListComponent implements OnInit {
    imposters: object[] = [];
    faList = faList;
    faInfoCircle = faInfoCircle;
    faPlusSquare = faPlusSquare;
    faTrash = faTrash;
    faSyncAlt = faSyncAlt;
    faFileDownload = faFileDownload;
    faTimes = faTimes;
    faCheck = faCheck;
    faFileUpload = faFileUpload;
    page = 1;
    pageSize = 8;
    ports = [];

    constructor(private imposterService: ImposterService,
                private router: Router,
                private dialogService: DialogService) {}

    ngOnInit(): void {
        this.getImposters();
    }

    getImposters(): void {
        this.ports = [];
        this.imposterService.getImposters().subscribe({
            next: imposters => {
                this.imposters = imposters['imposters'];
                this.imposters.forEach(element => {
                    this.getImposterName(element);
                    this.ports.push(element['port']);
                });
            }
        });
    }

    refresh(): void {
        this.getImposters();
    }

    getImposterName(imposter: object): void {
        this.imposterService.getImposter(imposter['port']).subscribe({
            next: details => {
                if (details['name']) {
                    imposter['name'] = details['name'];
                } else {
                    imposter['name'] = '-';
                }
            }
        });
    }

    onImposterDetail(port: number): void {
        this.router.navigate(['imposters', port]);
    }

    onAddImposter(): void {
        this.router.navigate(['newImposter']);
    }

    uploadImposters(): void {
        this.dialogService.upload('Upload Config File', 'Choose a file to upload:', this.ports, 'UPLOAD', 'CANCEL').then(
            ok => { this.refresh(); },
            fail => { }
        );
    }

    deleteImposter(port: number): void {
        this.dialogService.confirm('Delete Imposter', `Do you really want to delete the imposter on the port ${port}?`).then(
            ok => {
                if (ok) {
                    this.imposterService.deleteImposters(port).subscribe({
                        next: () => this.refresh()
                    });
                }
            },
            fail => { }
        );
    }
    viewLogs(port: string): void {
        localStorage.setItem('imposterFilter', port);
        localStorage.setItem('redirect', '1');
        this.router.navigate(['/logs']);
    }

    downloadImposters(): void {
        this.dialogService.download('Download Current Config', 'Choose a name to your file:').then(
            ok => { },
            fail => { }
        );
    }
}
