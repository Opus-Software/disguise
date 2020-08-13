import { async, TestBed } from '@angular/core/testing';
import { ImposterListComponent } from './imposter-list.component';
import { ImposterService } from './imposter.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DialogService } from '../shared/dialog.service';

describe('ImposterListComponent', () => {
    let mockImposterService;
    let mockDialogService;

    beforeEach(async(() => {
        mockImposterService = jasmine.createSpyObj('mockImposterService', ['getImposters', 'getImposter']);
        mockDialogService = jasmine.createSpyObj('mockDialogService', ['confirm']);
        TestBed.configureTestingModule({
            declarations: [ImposterListComponent],
            providers: [
                { provide: ImposterService, useValue: mockImposterService },
                { provide: DialogService, useValue: mockDialogService}
            ],
            imports: [RouterTestingModule.withRoutes([])],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    function setup() {
        const fixture = TestBed.createComponent(ImposterListComponent);
        const impostersList = fixture.debugElement.componentInstance;
        const navSpy = spyOn(TestBed.inject(Router), 'navigate');
        return { fixture, impostersList, navSpy };
    }

    it('should create the imposters list component', async(() => {
        const { impostersList } = setup();
        expect(impostersList).toBeTruthy();
    }));

    it('should get and set the imposters list', async(() => {
        const { fixture, impostersList } = setup();
        mockImposterService.getImposters.and.returnValue(of({ imposters: [{ port: 1234, protocol: 'http' }] }));
        mockImposterService.getImposter.and.returnValue(of({ name: 'test' }));
        fixture.detectChanges();
        expect(impostersList.imposters).toEqual([{ port: 1234, protocol: 'http', name: 'test' }]);
        expect(impostersList.ports).toEqual([1234]);
    }));

    it('should refresh the imposters list', async(() => {
        const { fixture, impostersList } = setup();
        mockImposterService.getImposters.and.returnValue(of({ imposters: [{ port: 1234, protocol: 'http' }] }));
        mockImposterService.getImposter.and.returnValue(of({ name: 'test' }));
        fixture.detectChanges();
        expect(impostersList.imposters).toEqual([{ port: 1234, protocol: 'http', name: 'test' }]);
        mockImposterService.getImposters.and.returnValue(
            of({ imposters: [{ port: 1234, protocol: 'http' }, { port: 4321, protocol: 'http' }] })
        );
        impostersList.refresh();
        expect(impostersList.imposters).toEqual(
            [{ port: 1234, protocol: 'http', name: 'test' }, { port: 4321, protocol: 'http', name: 'test' }]
        );
    }));

    it('should go to imposter detail', async(() => {
        const { impostersList, navSpy } = setup();
        impostersList.onImposterDetail(123);
        expect(navSpy).toHaveBeenCalledWith(['imposters', 123 ]);
    }));

    it('should go to the logs page', async(() => {
        const { impostersList, navSpy } = setup();
        impostersList.viewLogs(123);
        expect(navSpy).toHaveBeenCalledWith(['/logs']);
    }));

    it('should go to the imposters add page', async(() => {
        const { impostersList, navSpy } = setup();
        impostersList.onAddImposter();
        expect(navSpy).toHaveBeenCalledWith(['newImposter']);
    }));
});
