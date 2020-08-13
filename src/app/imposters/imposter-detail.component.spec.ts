import { async, TestBed } from '@angular/core/testing';
import { ImposterDetailComponent } from './imposter-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ImposterService } from './imposter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DialogService } from '../shared/dialog.service';

describe('ImposterDetailComponent', () => {
    let mockImposterService;
    let mockDialogService;
    beforeEach(async(() => {
        mockImposterService = jasmine.createSpyObj('mockImposterService', ['getImposter']);
        mockDialogService = jasmine.createSpyObj('mockDialogService', ['confirm']);
        TestBed.configureTestingModule({
            declarations: [ImposterDetailComponent],
            providers: [
                { provide: ImposterService, useValue: mockImposterService },
                { provide: DialogService, useValue: mockDialogService },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 123 } } } }
            ],
            imports: [RouterTestingModule.withRoutes([])],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    function setup() {
        const fixture = TestBed.createComponent(ImposterDetailComponent);
        const imposterDetail = fixture.debugElement.componentInstance;
        const navSpy = spyOn(TestBed.inject(Router), 'navigate');
        return { fixture, imposterDetail, navSpy };
    }

    it('should create the imposter detail component', async(() => {
        const { imposterDetail } = setup();
        expect(imposterDetail).toBeTruthy();
    }));

    it('should get and set the imposter details', async(() => {
        const { fixture, imposterDetail } = setup();
        mockImposterService.getImposter.and.returnValue(of({ port: 123, protocol: 'http', stubs: []}));
        fixture.detectChanges();
        expect(imposterDetail.imposter).toEqual({ port: 123, protocol: 'http', stubs: [] });
    }));

    it('should return to imposter list', async(() => {
        const { imposterDetail, navSpy } = setup();
        imposterDetail.return();
        expect(navSpy).toHaveBeenCalledWith(['imposters']);
    }));

    it('should go to logs page', async(() => {
        const { imposterDetail, navSpy } = setup();
        imposterDetail.viewLogs(123);
        expect(navSpy).toHaveBeenCalledWith(['/logs']);
    }));
});
