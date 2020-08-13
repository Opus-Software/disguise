import { Component, OnInit } from '@angular/core';
import { ImposterService } from './imposter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlusSquare, faPen, faTrash, faCaretDown, faCaretUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from '../shared/dialog.service';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Component({
    templateUrl: './imposter-detail.component.html',
    styleUrls: ['./imposter-detail.component.sass']
})

export class ImposterDetailComponent implements OnInit {
    imposter: object = { stubs: [] };
    minimizedImposter: object[] = [];
    faPlusSquare = faPlusSquare;
    faSearch = faSearch;
    faPen = faPen;
    faTrash = faTrash;
    faCaretDown = faCaretDown;
    faCaretUp = faCaretUp;
    port: number;
    stub: object = { predicates: [], responses: [] };
    validPredicate = true;
    validResponse = true;
    editResponse;
    editPredicate;
    predicateLines: string[] = [];
    responseLines: string[] = [];
    editPredicateLines: string[] = [];
    editResponseLines: string[] = [];
    requests: object[] = [];
    protocol: string;
    keys = [];

    constructor(private imposterService: ImposterService,
                private route: ActivatedRoute,
                private router: Router,
                private dialogService: DialogService,
                private ngxXml2jsonService: NgxXml2jsonService) { }

    ngOnInit(): void {
        this.port = +this.route.snapshot.paramMap.get('port');
        if (this.port) {
            this.getImposter(this.port);
        }
    }

    treatStubs(): void {
        this.imposter['stubs'].forEach(stub => {
            this.minimizedImposter.push({ minPredicate: this.minimizePredicate(stub['predicates']) });
        });
    }

    minimizePredicate(stub: object[]): string[] {
        if (!stub) {
            return [];
        }
        const stubs = [];
        stub.forEach(object => {
            const minObj = this.minimizeObject(object, '');
            stubs.push(minObj.substring(0, minObj.length - 2));
        });
        return stubs;
    }

    minimizeObject(obj: any, prefix: string): string {
        let finalString = '';
        switch (typeof obj) {
            case 'object': {
                const keys = Object.keys(obj);
                keys.forEach(prop => {
                    if (prefix === '') {
                        finalString += `${this.minimizeObject(obj[prop], prop)}`;
                    } else {
                        finalString += `${this.minimizeObject(obj[prop], prefix + '.' + prop)}`;
                    }
                });
                break;
            }
            default: {
                return `${prefix}:${obj}, `;
            }
        }
        return finalString;
    }


    getImposter(port: number): void {
        this.imposterService.getImposter(port).subscribe({
            next: imposter => {
                this.imposter = imposter;
                this.treatStubs();
                this.getLineNumbers();
            }
        });
    }

    reset(i: number): void {
        this.editResponse = JSON.stringify(this.imposter['stubs'][i]['responses'], null, 2);
        this.validPredicate = true;
        this.validResponse = true;
        this.editPredicate = JSON.stringify(this.imposter['stubs'][i]['predicates'], null, 2);
        this.editPredicateLines[i] = this.predicateLines[i];
        this.editResponseLines[i] = this.responseLines[i];
    }

    return(): void {
        this.router.navigate(['imposters']);
    }

    deleteStub(port: number, index: number): void {
        this.dialogService.confirm('Delete Stub', `Do you really want to delete the stub at index ${index}?`).then(
            ok => {
                if (ok) {
                    this.imposterService.deleteStub(port, index).subscribe({
                        next: () => this.windowReload()
                    });
                }
            },
            fail => { }
        );
    }

    onAddStub(port: number): void {
        this.dialogService.addStub(port).then(
            ok => {
                this.windowReload();
            },
            fail => { }
        );
    }

    viewLogs(port: string): void {
        localStorage.setItem('imposterFilter', port);
        localStorage.setItem('redirect', '2');
        this.router.navigate(['/logs']);
    }

    windowReload(): void {
        window.location.reload();
    }

    getStub(port: number, index: number): void {
        this.imposterService.getImposter(port).subscribe({
            next: imposter => {
                this.stub = imposter['stubs'][index];
            }
        });
    }

    putStub(i: number): void {
        try {
            JSON.parse(this.editPredicate);
            this.validPredicate = true;
        } catch {
            this.validPredicate = false;
        }
        try {
            this.validResponse = true;
            JSON.parse(this.editResponse);
        } catch {
            this.validResponse = false;
        }
        if (this.validResponse && this.validPredicate) {
            const body = { predicates: JSON.parse(this.editPredicate), responses: JSON.parse(this.editResponse) };
            this.imposterService.putStub(this.port, i, body).subscribe({
                next: () => this.windowReload()
            });
        }
    }

    returnImpostersList(): void {
        this.router.navigate(['imposters']);
    }

    getLineNumbers(): void {
        this.imposter['stubs'].forEach(stub => {
            let lines = '';
            let linesCount = 0;
            if (stub['predicates']) {
                linesCount = JSON.stringify(stub['predicates'], null, 2).split(/\r\n|\r|\n/).length;
                for (let i = 1; i <= linesCount; i++) {
                    lines = lines + `${i}.\n`;
                }
            }
            this.predicateLines.push(lines);
            this.editPredicateLines.push(lines);
            linesCount = JSON.stringify(stub['responses'], null, 2).split(/\r\n|\r|\n/).length;
            lines = '';
            for (let i = 1; i <= linesCount; i++) {
                lines = lines + `${i}.\n`;
            }
            this.responseLines.push(lines);
            this.editResponseLines.push(lines);
        });
    }

    onKey(target: string, index: number): void {
        if (target === 'pred') {
            this.editPredicateLines[index] = '';
            const lines = this.editPredicate.split(/\r\n|\r|\n/).length;
            for (let i = 1; i <= lines; i++) {
                this.editPredicateLines[index] = this.editPredicateLines[index] + `${i}.\n`;
            }
        } else {
            this.editResponseLines[index] = '';
            const lines = this.editResponse.split(/\r\n|\r|\n/).length;
            for (let i = 1; i <= lines; i++) {
                this.editResponseLines[index] = this.editResponseLines[index] + `${i}.\n`;
            }
        }
    }

    getRequests(): void {
        this.imposterService.getImposter(this.port).subscribe({
            next: (imposter) => {
                this.requests = imposter['requests'];
                this.requests.forEach((req) => {
                    this.keys.push(Object.keys(req['headers']));
                    if (req['headers']['Content-Type'] === 'application/json') {
                        if (req['body']) {
                            req['body'] = JSON.parse(req['body']);
                        }
                    } else if (req['headers']['Content-Type'] === 'application/xml') {
                        req['body'] = this.parseXml(req['body']);
                    }
                });
                this.protocol = imposter['protocol'];
            },
        });
    }

    isEmpty(obj: object): boolean {
        return Object.keys(obj).length <= 0;
    }

    parseXml(str: string) {
        str = str.replace(/ {4}| {2}|[\t\n\r]/g, '');
        const parser = new DOMParser();
        const xml = parser.parseFromString(str, 'text/xml');
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        return obj;
    }

}
