import { Component, OnInit } from '@angular/core';
import { LogService } from './log.service';
import { faFilter, faSync, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ImposterService } from '../imposters/imposter.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DialogService } from '../shared/dialog.service';
@Component({
    templateUrl: './log.component.html',
    styleUrls: ['./log.component.sass']
})

export class LogComponent implements OnInit {
    page = 1;
    pageSize = 10;
    maxSize = 10;
    logArray: object[] = [];
    isChecked = false;
    faFilter = faFilter;
    faSearch = faSearch;
    faSync = faSync;
    filteredLog: object[] = [];
    imposters: string[] = [];
    redirectedPort: string;
    filters = {
        level: 'none',
        timestampFrom: '',
        timestampTo: '',
        imposter: 'Choose Imposter'
    };
    redirect = 0;
    searchFilter = '';

    constructor(private logService: LogService,
                private imposterService: ImposterService,
                private datePipe: DatePipe,
                private router: Router,
                private dialogService: DialogService) { }

    ngOnInit(): void {
        this.getLog();
        this.getAllImposters();
    }

    getLog() {
        this.logService.getLog().subscribe(
            data => {
                this.logArray = data['logs'].sort((n1, n2) => {
                    if (n1 < n2) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                this.logArray.forEach(log => {
                    log['timestamp'] = this.parseTimestamp(log['timestamp']);
                    const match = log['message'].match(/\[(.*?)\]/);
                    log['imposter'] = match[1];
                    log['message'] = log['message'].substring(match[0].length + 1);
                });
                this.filteredLog = this.logArray;
                this.checkImposterFilter();
                this.applySearchFilter();
                this.applyAllFilters();
                const switchState = localStorage.getItem('isChecked');
                if (switchState) {
                    this.isChecked = JSON.parse(switchState);
                    this.page = +localStorage.getItem('page');
                    localStorage.removeItem('page');
                    this.auto_refresh();
                }
            }
        );
    }

    parseTimestamp(log: string): string {
        return this.datePipe.transform(new Date(log), 'yyyy-MM-dd HH:mm:ss');
    }

    getAllImposters(): void {
        this.imposters = [];
        this.imposterService.getImposters().subscribe(
            imposters => {
                imposters['imposters'].forEach(imposter => {
                    this.imposters.push(imposter['port']);
                });
            }
        );
    }

    refresh() {
        this.getLog();
        this.getAllImposters();
    }

    onFilters(): void {
        this.dialogService.openFilter(this.filters, this.imposters).then(
            appliedFilters => {
                if (JSON.stringify(appliedFilters) !== JSON.stringify(this.filters)) {
                    this.filters.level = appliedFilters['level'];
                    this.filters.timestampFrom = appliedFilters['timestampFrom'];
                    this.filters.timestampTo = appliedFilters['timestampTo'];
                    this.filters.imposter = appliedFilters['imposter'];
                    this.refresh();
                }
            },
            fail => { }
        );
    }

    checkValue() {
        if (!this.isChecked) {
            this.auto_refresh();
        } else {
            localStorage.removeItem('isChecked');
            clearTimeout(JSON.parse(localStorage.getItem('timeout')));
            localStorage.removeItem('timeout');
            localStorage.removeItem('page');
        }
    }

    auto_refresh() {
        localStorage.setItem('isChecked', 'true');
        const timeout = setTimeout(() => {
            localStorage.setItem('page', `${this.page}`);
            this.refresh();
        }, 5000); // Activate after 5 seconds.
        localStorage.setItem('timeout', JSON.stringify(timeout));
    }

    applyLevelFilter(): void {
        if (this.filters.level !== 'none') {
            this.filteredLog = this.filteredLog.filter(log => {
                return log['level'] === this.filters.level;
            });
        }
    }

    applyTimestampFilter(): void {
        this.filteredLog = this.filteredLog.filter(log => {
            const from = this.filters.timestampFrom ?  this.filters.timestampFrom : '0000-01-01 00:00:00';
            const to = this.filters.timestampTo ? this.filters.timestampTo : '9999-12-31 23:59:59';
            const logTime = new Date(log['timestamp']);
            return (logTime >= new Date(from) && logTime <= new Date(to));
        });
    }

    applyImposterFilter(): void {
        if (this.filters.imposter !== 'Choose Imposter') {
            this.filteredLog = this.filteredLog.filter(log => {
                return log['imposter'].includes(this.filters.imposter);
            });
        }
    }

    checkImposterFilter(): void {
        const imposter = localStorage.getItem('imposterFilter');
        if (imposter) {
            localStorage.removeItem('imposterFilter');
            this.filters['imposter'] = imposter;
            this.redirectedPort = imposter;
            this.applyImposterFilter();
        }
        const redirectMode = localStorage.getItem('redirect');
        localStorage.removeItem('redirect');
        if (redirectMode === '1') {
            this.redirect = 1;
        } else if (redirectMode === '2') {
            this.redirect = 2;
        } else {
            this.redirect = 0;
        }
    }

    applyAllFilters(): void {
        this.applyImposterFilter();
        this.applyTimestampFilter();
        this.applyLevelFilter();
    }

    returnImpostersList(): void {
        this.router.navigate(['imposters']);
    }

    returnImposterDetails(): void {
        this.router.navigate(['imposters', this.redirectedPort]);
    }

    applySearchFilter(): void {
        if (this.searchFilter.trim()) {
            this.filteredLog = this.filteredLog.filter(log => {
                const fit = (
                    log['timestamp'].toLowerCase().includes(this.searchFilter.toLowerCase()) ||
                    log['level'].toLowerCase().includes(this.searchFilter.toLowerCase()) ||
                    log['imposter'].toLowerCase().includes(this.searchFilter.toLowerCase()) ||
                    log['message'].toLowerCase().includes(this.searchFilter.toLowerCase())
                );
                return fit;
            });
        } else {
            this.filteredLog = this.logArray;
            this.applyAllFilters();
        }
    }
}
