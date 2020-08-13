import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'timestamp'})
export class TimestampPipe implements PipeTransform {
    constructor(private datePipe: DatePipe) { }
    transform(value: string): string {
        if (!value) {
            return '';
        }
        return this.datePipe.transform(new Date(value), 'yyyy-MM-dd T HH:mm:ss');
    }
}
