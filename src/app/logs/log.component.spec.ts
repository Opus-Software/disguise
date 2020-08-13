import { TestBed, async } from '@angular/core/testing';
import { LogComponent } from './log.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LogService } from './log.service';
import { of } from 'rxjs';
import { ImposterService } from '../imposters/imposter.service';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogService } from '../shared/dialog.service';
import { TimestampPipe } from '../shared/timestamp.pipe';

describe('LogComponent', () => {
    let mockLogService;
    let mockImposterService;
    beforeEach(async(() => {
        mockLogService = jasmine.createSpyObj('mockLogService', ['getLog']);
        mockImposterService = jasmine.createSpyObj('mockImposterService', ['getImposters']);
        TestBed.configureTestingModule({
            declarations: [LogComponent, TimestampPipe],
            providers: [
                { provide: LogService, useValue: mockLogService },
                { provide: ImposterService, useValue: mockImposterService },
                { provide: DialogService },
                DatePipe,
            ],
            imports: [NgbModule, RouterTestingModule.withRoutes([])],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    function setup() {
        const fixture = TestBed.createComponent(LogComponent);
        const log = fixture.debugElement.componentInstance;
        return { fixture, log };
    }

    it('should create the log component', async(() => {
        const { log } = setup();
        expect(log).toBeTruthy();
    }));

    it('should get and set the logs and imposters ports', async(() => {
        const { fixture, log } = setup();
        mockLogService.getLog.and.returnValue(of({ logs: [{ message: '[tcp:123] test', level: 'info',
            timestamp: '2020-01-01T10:00:00.123Z' }] }));
        mockImposterService.getImposters.and.returnValue(of({ imposters: [{ port: 123, protocol: 'tcp' }] }));
        fixture.detectChanges();
        const ts = log.parseTimestamp('2020-01-01T10:00:00.123Z');
        expect(log.filteredLog).toEqual([{ message: 'test', imposter: 'tcp:123', level: 'info',
            timestamp: ts }]);
        expect(log.logArray).toEqual(log.filteredLog);
        expect(log.imposters).toEqual([123]);
    }));

    it('should apply the level filter', async(() => {
        const { fixture, log } = setup();
        mockLogService.getLog.and.returnValue(of({ logs: [{ message: '[tcp:123] test', level: 'info',
            timestamp: '2020-01-01T10:00:00.123Z' }, { message: '[http:222] error', level: 'error',
            timestamp: '2020-01-01T10:00:00.123Z' }] }));
        mockImposterService.getImposters.and.returnValue(of({ imposters: [{ port: 123, protocol: 'tcp' },
            { port: 222, protocol: 'http' }] }));
        fixture.detectChanges();
        const ts = log.parseTimestamp('2020-01-01T10:00:00.123Z');
        log.filters.level = 'error';
        log.applyLevelFilter();
        fixture.detectChanges();
        expect(log.filteredLog).toEqual([{ message: 'error', imposter: 'http:222', level: 'error', timestamp: ts }]);
    }));

    it('should apply the imposter filter', async(() => {
        const { fixture, log } = setup();
        mockLogService.getLog.and.returnValue(of({ logs: [{ message: '[tcp:123] test', level: 'info',
            timestamp: '2020-01-01T10:00:00.123Z' }, { message: '[http:222] error', level: 'error',
            timestamp: '2020-01-01T10:00:00.123Z' }] }));
        mockImposterService.getImposters.and.returnValue(of({ imposters: [{ port: 123, protocol: 'tcp' },
            { port: 222, protocol: 'http' }] }));
        fixture.detectChanges();
        const ts = log.parseTimestamp('2020-01-01T10:00:00.123Z');
        log.filters.imposter = '222';
        log.applyImposterFilter();
        fixture.detectChanges();
        expect(log.filteredLog).toEqual([{ message: 'error', imposter: 'http:222', level: 'error', timestamp: ts }]);
    }));

    it('should apply the timestamp flter', async(() => {
        const { fixture, log } = setup();
        mockLogService.getLog.and.returnValue(of({ logs: [{ message: '[tcp:123] test', level: 'info',
            timestamp: '2020-10-10T10:00:00.123Z' }, { message: '[http:222] error', level: 'error',
            timestamp: '2020-01-01T10:00:00.123Z' }] }));
        mockImposterService.getImposters.and.returnValue(of({ imposters: [{ port: 123, protocol: 'tcp' },
            { port: 222, protocol: 'http' }] }));
        fixture.detectChanges();
        const ts = log.parseTimestamp('2020-01-01T10:00:00.123Z');
        const ts2 = log.parseTimestamp('2020-10-10T10:00:00.123Z');
        log.filters.timestampFrom = '2019-10-10 00:00:00';
        log.filters.timestampTo = '2020-02-02 00:00:00';
        log.applyTimestampFilter();
        expect(log.filteredLog).toEqual([{ message: 'error', imposter: 'http:222', level: 'error', timestamp: ts }]);
    }));

    it('should apply more than one filter', async(() => {
        const { fixture, log } = setup();
        mockLogService.getLog.and.returnValue(of({ logs: [{ message: '[tcp:123] test', level: 'info',
            timestamp: '2020-10-10T10:00:00.123Z' }, { message: '[http:222] error', level: 'error',
            timestamp: '2020-01-01T10:00:00.123Z' }, { message: '[tcp:123] test2', level: 'error',
            timestamp: '2020-01-01T10:00:00.123Z' }] }));
        mockImposterService.getImposters.and.returnValue(of({ imposters: [{ port: 123, protocol: 'tcp' },
            { port: 222, protocol: 'http' }] }));
        fixture.detectChanges();
        const ts = log.parseTimestamp('2020-01-01T10:00:00.123Z');
        log.filters.level = 'error';
        log.filters.imposter = '123';
        log.applyLevelFilter();
        log.applyImposterFilter();
        expect(log.filteredLog).toEqual([{ message: 'test2', imposter: 'tcp:123', level: 'error', timestamp: ts }]);
    }));

    it('should apply all filters', async(() => {
        const { fixture, log } = setup();
        mockLogService.getLog.and.returnValue(of({ logs: [{ message: '[tcp:123] test', level: 'info',
            timestamp: '2020-10-10T10:00:00.123Z' }, { message: '[http:222] error', level: 'error',
            timestamp: '2020-01-01T10:00:00.123Z' }, { message: '[tcp:123] test2', level: 'error',
            timestamp: '2020-01-01T10:00:00.123Z' }] }));
        mockImposterService.getImposters.and.returnValue(of({ imposters: [{ port: 123, protocol: 'tcp' },
            { port: 222, protocol: 'http' }] }));
        fixture.detectChanges();
        const ts = log.parseTimestamp('2020-01-01T10:00:00.123Z');
        log.filters.level = 'error';
        log.filters.imposter = '123';
        log.applyAllFilters();
        expect(log.filteredLog).toEqual([{ message: 'test2', imposter: 'tcp:123', level: 'error', timestamp: ts }]);
    }));
});
