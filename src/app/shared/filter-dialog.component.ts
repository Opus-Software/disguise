import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './filter-dialog.component.html',
    styleUrls: ['./filter-dialog.component.sass']
})
export class FilterDialogComponent implements OnInit {
    @Input() inputFilters: object;
    @Input() imposters: string[];
    faCalendar = faCalendar;
    filter = {
        level: 'none',
        timestampFrom: '',
        timestampTo: '' ,
        imposter:  'Choose Imposter'
    };
    date = { from: '', to: ''};
    time = {
        from: { hour: +'00', minute: +'00', second: +'00' },
        to: { hour: +'00', minute: +'00', second: +'00' }
    };

    constructor(private activeModal: NgbActiveModal,
                private datePipe: DatePipe) { }

    ngOnInit(): void {
        this.filter.level = this.inputFilters['level'];
        this.filter.timestampFrom = this.inputFilters['timestampFrom'];
        this.filter.timestampTo = this.inputFilters['timestampTo'];
        this.filter.imposter = this.inputFilters['imposter'];
        this.checkTimestampFilters();
    }

    accept(): void {
        this.activeModal.close(this.filter);
    }

    onDateSelect(label: string) {
        if (label === 'to') {
            this.filter.timestampTo = `${this.date.to['year']}-${('0' + this.date.to['month']).slice(-2)}-` +
                `${('0' + this.date.to['day']).slice(-2)} ${('0' + this.time.to['hour']).slice(-2)}:` +
                `${('0' + this.time.to['minute']).slice(-2)}:${('0' + this.time.to['second']).slice(-2)}`;
        } else {
            this.filter.timestampFrom = `${this.date.from['year']}-${('0' + this.date.from['month']).slice(-2)}-` +
            `${('0' + this.date.from['day']).slice(-2)} ${('0' + this.time.from['hour']).slice(-2)}:` +
            `${('0' + this.time.from['minute']).slice(-2)}:${('0' + this.time.from['second']).slice(-2)}`;
        }
    }

    onTimeSelect(label: string) {
        if (label === 'to') {
            if (!this.date.to) {
                const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                this.filter.timestampTo = currentDate + ` ${('0' + this.time.to['hour']).slice(-2)}:` +
                    `${('0' + this.time.to['minute']).slice(-2)}:${('0' + this.time.to['second']).slice(-2)}`;
            } else {
                const date = this.filter.timestampTo.substring(0, 10);
                this.filter.timestampTo = date + ` ${('0' + this.time.to['hour']).slice(-2)}:` +
                    `${('0' + this.time.to['minute']).slice(-2)}:${('0' + this.time.to['second']).slice(-2)}`;
            }
        } else {
            if (!this.date.from) {
                const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                this.filter.timestampFrom = currentDate + ` ${('0' + this.time.from['hour']).slice(-2)}:` +
                `${('0' + this.time.from['minute']).slice(-2)}:${('0' + this.time.from['second']).slice(-2)}`;
            } else {
                const date = this.filter.timestampFrom.substring(0, 10);
                this.filter.timestampFrom = date + ` ${('0' + this.time.from['hour']).slice(-2)}:` +
                    `${('0' + this.time.from['minute']).slice(-2)}:${('0' + this.time.from['second']).slice(-2)}`;
            }
        }
    }

    checkTimestampFilters(): void {
        if (this.filter.timestampFrom) {
            this.date.from = this.filter.timestampFrom.substring(0, 10);
            this.time.from.hour = +this.filter.timestampFrom.substring(11, 13);
            this.time.from.minute = +this.filter.timestampFrom.substring(14, 16);
            this.time.from.second = +this.filter.timestampFrom.substring(17, 19);
        }
        if (this.filter.timestampTo) {
            this.date.to = this.filter.timestampTo.substring(0, 10);
            this.time.to.hour = +this.filter.timestampTo.substring(11, 13);
            this.time.to.minute = +this.filter.timestampTo.substring(14, 16);
            this.time.to.second = +this.filter.timestampTo.substring(17, 19);
        }
    }

    cleanAll(): void {
        this.cleanTimestamp();
        this.cleanLevel();
        this.cleanImposter();
    }

    cleanTimestamp(): void {
        this.filter.timestampFrom = '';
        this.filter.timestampTo = '';
        this.date.from = '';
        this.date.to = '';
        this.time.from = { hour: +'00', minute: +'00', second: +'00' };
        this.time.to = { hour: +'00', minute: +'00', second: +'00' };
    }

    cleanLevel(): void {
        this.filter.level = 'none';
    }

    cleanImposter(): void {
        this.filter.imposter = 'Choose Imposter';
    }
}
