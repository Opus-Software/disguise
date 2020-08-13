import { TestBed, async } from '@angular/core/testing';
import { ImposterService } from './imposter.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { Constants } from '../shared/constants';

describe('ImposterService', () => {
    let imposterService: ImposterService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ImposterService]
        });
        imposterService = TestBed.inject(ImposterService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create the imposter service', async(() => {
        expect(ImposterService).toBeTruthy();
    }));

    describe('getImposters()', () => {
        it('should return the list of imposters', async(() => {
            const imposters = {
                imposters: [
                    { port: 1234, protocol: 'http' }
            ]};

            imposterService.getImposters().subscribe(
                response => {
                    expect(response['imposters'].length).toBe(1);
                    expect(response['imposters']).toEqual([{ port: 1234, protocol: 'http' }]);
                },
                () => fail('should have succeded')
            );
            const req = httpMock.expectOne(`${Constants.mb}/imposters`);
            expect(req.request.method).toBe('GET');
            req.flush(imposters, { status: 200, statusText: 'OK' });
        }));
    });

    describe('getImposter()', () => {
        it('should return the given imposter', async(() => {
            const imposter = { port: 1234, protocol: 'http', stubs: [] };
            imposterService.getImposter(1234).subscribe(
                response => {
                    expect(response['port']).toEqual(1234);
                    expect(response['protocol']).toEqual('http');
                    expect(response['stubs']).toEqual([]);
                },
                () => fail('should have succeded')
            );
            const req = httpMock.expectOne(`${Constants.mb}/imposters/1234`);
            expect(req.request.method).toBe('GET');
            req.flush(imposter, { status: 200, statusText: 'OK' });
        }));
    });

    describe('postImposters()', () => {
        it('should post the imposter', async(() => {
            const imposter = { port: 1234, protocol: 'http' };
            imposterService.postImposters(imposter).subscribe(
                response => expect(response).toEqual(imposter),
                () => fail('should have succeded')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method === 'POST'
                && request.url === `${Constants.mb}/imposters`
                && JSON.stringify(request.body) === JSON.stringify(imposter);
            });
            req.flush(imposter, { status: 201, statusText: 'Created' });
        }));
    });

    describe('addStub()', () => {
        it('should post the stub', async(() => {
            const stub = { predicates: [], responses: [] };
            imposterService.addStub(1234, stub).subscribe(
                response => expect(response).toEqual(stub),
                () => fail('should have succeded')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method === 'POST'
                && request.url === `${Constants.mb}/imposters/1234/stubs`
                && JSON.stringify(request.body) === JSON.stringify(stub);
            });
            req.flush(stub, { status: 201, statusText: 'Created' });
        }));
    });

    describe('deleteImposters()', () => {
        it('should delete the imposter', async(() => {
            imposterService.deleteImposters(1234).subscribe(
                response => expect(response).toEqual({}),
                () => fail('should have succeded')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method === 'DELETE'
                && request.url === `${Constants.mb}/imposters/1234`;
            });
            req.flush({}, { status: 200, statusText: 'OK' });
        }));
    });

    describe('putStub()', () => {
        it('should put the stub', async(() => {
            const stub = { predicates: [], responses: [] };
            imposterService.putStub(1234, 0, stub).subscribe(
                response => expect(response).toEqual(stub),
                () => fail('should have succeded')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method === 'PUT'
                && request.url === `${Constants.mb}/imposters/1234/stubs/0`
                && JSON.stringify(request.body) === JSON.stringify(stub);
            });
            req.flush(stub, { status:  200, statusText: 'OK'});
        }));
    });

    describe('deleteStub()', () => {
        it('should delete the stub', async(() => {
            imposterService.deleteStub(1234, 0).subscribe(
                response => expect(response).toEqual({}),
                () => fail('should have succeded')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method === 'DELETE'
                && request.url === `${Constants.mb}/imposters/1234/stubs/0`;
            });
            req.flush({}, { status: 200, statusText: 'OK' });
        }));
    });
});
