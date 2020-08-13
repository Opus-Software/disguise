import { TestBed, async } from '@angular/core/testing';
import { LogService } from './log.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Constants } from '../shared/constants';

describe('LogService', () => {
    let logService: LogService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LogService]
        });
        logService = TestBed.inject(LogService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create the log service', async(() => {
        expect(LogService).toBeTruthy();
    }));

    describe('getLog()', () => {
        it('should return the list of logs', async(() => {
            const logs = {
                logs: [
                    { message: 'test', level: 'info', timestamp: '2020-05-14T00:00:00.744Z' }
            ]};

            logService.getLog().subscribe(
                response => {
                    expect(response['logs'].length).toBe(1);
                    expect(response['logs']).toEqual([{ message: 'test', level: 'info', timestamp: '2020-05-14T00:00:00.744Z' }]);
                },
                () => fail('should have succeded')
            );
            const req = httpMock.expectOne(`${Constants.mb}/logs`);
            expect(req.request.method).toBe('GET');
            req.flush(logs, { status: 200, statusText: 'OK' });
        }));
    });
});
